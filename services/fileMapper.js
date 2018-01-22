let fileReq = {
  project: '',
  branck: undefined,
  version: undefined
}

let projectObj = {
  name:'firstProj',
  files: [{
    relname: ''
  }]
}


let updateObj = [{
  fileId: 0,
  fileName: 'file1';
  content: 'hello world'
},{
  fileId: 1,
  fileName: 'file2',
  content: 'goodbye world'
}];

let  pojInfo = {
  version: 0,
  ownerId:
}

let pulled = {
  clientId: 837464
}

let fileMap = {
  remoteId: 3,
  serverId: 4,
}

var shell = require('shelljs');
var fileSrvc = require('./services/fileSrvc');

exports.newProject(name, files, ownerId) {
  const dirs = fileSrvc.getDirectories("./projects");
  for (index in dirs) {
    const relname = dirs[index].relname;
    const basename = relname.substring(relname.lastIndexOf('/')+1);
    if(basename == name) {
      return false;
    }
  }
  shell.mkdir("projects/" + name);

  for (index in files) {
    const file = files[index];
    fileSrvc.writeFile(file.fullName, file.content);
  }

  const projDir = "projects/" + name;
  const versionDir = projDir + "/0";
  fileSrvc.saveFiles(files, versionDir);

  updatePulled(versionDir, ownerId);
}

function getVersionInfo (version) {
  return jsonFileSrvc.getFileObject('./projects/' + version + '/versionInfo.js');
}

function updatePulled(dir, clientId) {
  let versionInfo = getVersionInfo();
  if(versionInfo.pulledIds == undefined)
    versionInfo.pulledIds = [];
  versionInfo.push(clientId);
  jsonFileSrvc.save(versionInfo);
}

exports.update = function (updateObj, clientId) {
  const pulledIds = getVersionInfo().pulledIds;
  for(index in pulledIds) {
    if(pulledIds[index] == clientId)

  }

}

exports.saveNewVersion = function (projectObj) {
  const projDir = "projects/" + projectObj.relname;
  let projInfo = jsonFileSrvc.getFileObject('projDir');
  projInfo.version = 1 + projInfo.version;

  const versionDir = projDir + "/" + pojInfo.version;
  shell.mkdir(versionDir);

  fileSrvc.saveFiles(projectObj.files, versionDir);
}

exports.get = function (projectObj, version) {

}
