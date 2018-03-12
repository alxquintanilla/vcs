const shell = require('shelljs');
const fileSrvc = require('./fileSrvc');
const utilSrvc = require('./UtilSrvc');
const jsonFileSrvc = require('./jsonFileSrvc');

const projectRepoName = "vcs-project-repo";

let versionInfo;
let projectObj;
let projectInfo;
let branchInfo;
let prevVersionInfo;

function newProject (projObj) {
  const name = projObj.name;
  projectObj = {
    projectUserId: 0,
    name: projObj.name,
    files: projObj.files,
    version: 0
  }

  const projInfo = getProjectInfo(projectObj);
  if(projInfo) {
    // Todo: implement error service
    return undefined;
  }

  const dir = projectRepoName + "/" + name;
  shell.mkdir(dir);

  versionInfo = {
    ownerId: 0,
    trackedFiles: {},
    pulledIds: [0],
    version: 0,
    fileLocName: "./" + projectRepoName + "/" + name + "/0/versionInfo.js"
  }

  branchInfo = {
    ownerId: 0,
    currentVersion: 0,
    fileLocName: "./" + projectRepoName + "/" + name + "/branchInfo.js"
  }

  projectInfo = {
    ownerId: 0,
    name: name,
    lastFileId: 0,
    lastReqId: 1,
    fileLocName: "./" + projectRepoName + "/" + name + "/projectInfo.js"
  }

  saveFiles(projectObj);
  saveInfo();
}

function getVersionDirectory (projectObject){
  const version = getVersion(projectObject);
  return getBranchPath(projectObject) + version + "/";
}

function getVersionInfo (projectObj) {
  return jsonFileSrvc.getFileObject(getVersionDirectory(projectObj) + 'versionInfo.js');
}

function updatePulled() {
  versionInfo.push(projectObj.projectUserId);
  jsonFileSrvc.save(versionInfo);
}

function getPrevTracked () {
  return JSON.parse(JSON.stringify(prevVersionInfo.trackedFiles));
}

function removeFiles () {
  for (index in projectObj.remove) {
    delete versionInfo.trackedFiles[projectObj.remove[index]];
  }
}

function validateFile (file) {
  return file && Number.isInteger(file.id) && file.relname;
}

function alignNames () {
  for(index in projectObj.files) {
    let file = projectObj.files[index];
    if(validateFile(file)) {
      versionInfo.trackedFiles[file.id].relname = file.relname;
    }
  }
}

function updateTracked () {
  const versionDir = getVersionDirectory(projectObj);
  const fileNameIdMap = fileSrvc.saveFiles(projectObj.files, versionDir + "repo/");

  let leftOvers = updateById (fileNameIdMap);
  updateByName (leftOvers, fileNameIdMap);
}

function updateById (fileNameIdMap) {
  let leftOvers = [];

  for (index in projectObj.files) {
    let file = projectObj.files[index];
    if (Number.isInteger(file.id)) {
      versionInfo.trackedFiles[file.id] = {relname: file.filename, id: fileNameIdMap[file.filename]};
    }
    else {
      leftOvers.push(file);
    }
  }
  return leftOvers;
}

function updateByName (leftOvers, fileNameIdMap) {
  for (index in leftOvers) {
    let file = leftOvers[index];
    let id;
    for (inner in versionInfo.trackedFiles) {
      let tracked = versionInfo.trackedFiles[inner];
      if (tracked.relname == file.relname) {
        id = inner;
        break;
      }
    }
    if(!id) {
      id = ++projectInfo.lastFileId;
    }
    let trackedFileInfo = {
      relname: file.relname,
      id: fileNameIdMap[file.relname]
    }
    versionInfo.trackedFiles[id] = trackedFileInfo;
  }

}

function saveFiles (projectObj) {
  const versionDir = getVersionDirectory(projectObj);

  if(versionInfo.version != 0) {
   versionInfo.trackedFiles = getPrevTracked(projectObj);
   removeFiles();
   alignNames();
   updateTracked ();
  }
  else {
    updateTracked ();
  }
}

function push (projObj) {
  projectObj = projObj;
  if(!validate(projectObj))
    return undefined;
  projectObj.version = undefined;
  getInfo(projectObj);

  if(!branchInfo) {
    newBranch();
    return;
  }

  const pulledIds = versionInfo.pulledIds;
  if(utilSrvc.arrayContains(pulledIds, projectObj.projectUserId) == -1)
    return false;

  saveNewVersion();
}

function getProjectInfo(projectObj) {
  const projFileName = getProjectPath(projectObj) + "projectInfo.js";
  return jsonFileSrvc.getFileObject(projFileName);
}

function getBranchInfo(projectObj) {
  const branchFileName = getBranchPath(projectObj) + "branchInfo.js";
  return jsonFileSrvc.getFileObject(branchFileName);
}

function getProjectPath (projectObj) {
  return "./" + projectRepoName + "/" + projectObj.name + "/";
}

function getBranchPath (projectObj) {
  let projDir = getProjectPath(projectObj);
  let branch = "";
  if(projectObj.branch)
    branch = projectObj.branch + "/";


  return projDir + branch;
}

function getInfo (projectObj) {
  projectInfo = getProjectInfo(projectObj);
  branchInfo = getBranchInfo(projectObj);
  if(branchInfo) {
    versionInfo = getVersionInfo(projectObj);
  }
}

function newBranch() {
  const branchPath = getBranchPath(projectObj);
  branchInfo = {
    ownerId: projectObj.projectUserId,
    currentVersion: 0,
    fileLocName: branchPath + "/branchInfo.js"
  }

  versionInfo = {
    ownerId: projectObj.projectUserId,
    trackedFiles: {},
    pulledIds: [projectObj.projectUserId],
    version: 0,
    fileLocName: branchPath + "/0/versionInfo.js"
  }

  saveFiles(projectObj);
  saveInfo();
}

function saveInfo () {
  jsonFileSrvc.save(branchInfo);
  jsonFileSrvc.save(projectInfo);
  jsonFileSrvc.save(versionInfo);
}

function saveNewVersion () {
  prevVersionInfo = versionInfo;
  projectObj.version = 1 + branchInfo.currentVersion;
  branchInfo.currentVersion = projectObj.version;

  versionInfo = {
    ownerId: projectObj.projectUserId,
    trackedFiles: {},
    pulledIds: [projectObj.projectUserId],
    version: projectObj.version,
    fileLocName: getBranchPath(projectObj) + projectObj.version + "/versionInfo.js"
  }



  const versionDir = getVersionDirectory(projectObj);
  shell.mkdir(versionDir);

  saveFiles(projectObj, versionDir);
  saveInfo();
}

function getVersion (projectObj) {
  version = parseInt(projectObj.version);
  if(!Number.isInteger(version) || version > branchInfo.currentVersion || version < 0)
    return branchInfo.currentVersion;

  return version;
}

function validate (projectObj) {
  return projectObj.name !== undefined && projectObj.projectUserId !== undefined;
}

function checkout (projObj) {
  projectObj = projObj;
  if(!validate(projectObj))
    return undefined;

  getInfo(projectObj);
  projectObj.projectUserId = ++projectInfo.lastReqId;
  let files = pullFiles();

  saveInfo();
  return files;
}

function pull (projObj) {
  projectObj = projObj;
  if(!validate(projectObj))
    return undefined;

  getInfo(projectObj);
  let files = pullFiles();

  saveInfo();
  return files;
}

function pullFiles () {
  const reqId = projectObj.projectUserId;

  let dir = getBranchPath(projectObj);
  let vInfo = getVersionInfo(projectObj);
  let version = vInfo.version;

  let projObj = JSON.parse(JSON.stringify(projectObj));
  projObj.version = vInfo.version;



  // Todo: re-write, use file discriptors.
  let files = [];
  let tracked = JSON.parse(JSON.stringify(vInfo.trackedFiles));
  while (version != -1 && (utilSrvc.arrayContains(vInfo.pulledIds, reqId) == -1) && Object.keys(tracked).length > 0)  {
    let newFiles = fileSrvc.getFiles(dir + version + "/repo/", true);
    for(index in newFiles) {
      let str = "";
      for(i in newFiles) {
        str += newFiles[i].id + ", ";
      }
      let file = newFiles[index];
      let idIndex = utilSrvc.objectContains(tracked, file, cmpIds);
      if(idIndex > -1) {
        delete tracked[idIndex];
        file.id = idIndex;
        file.relname = file.filename.substr(file.filename.indexOf("/repo/") + 5);
        files.push(file);
      }
    }
    version--;
    projObj.version--;
    vInfo = getVersionInfo(projObj);
  }

  if(utilSrvc.arrayContains(versionInfo.pulledIds, reqId) == -1)
    versionInfo.pulledIds.push(reqId);

  if(Object.keys(tracked).length > 0)
    console.log("unable to find files");

  return files;
}

function cmpIds (obj1, obj2) {
  return obj1.id === obj2.id;
}

exports.newProject = newProject;
exports.push = push;
exports.checkout = checkout;
exports.pull = pull;
