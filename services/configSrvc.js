const fileSrvc = require('./fileSrvc');
const utilSrvc = require('./UtilSrvc');
const colors = require('colors');
const jsonFS = require('./jsonFileSrvc');

let config = jsonFS.getFileObject('.\\.vcs\\config.js');

//------------------------------  Initialize ---------------------------------//

if(!config.ignorePaths)
  config.ignorePaths = ['.*.git.*', '.*.vcs.*', '.*.node_modules.*'];

if(!config.add)
  config.add = [];

if(!config.delete)
  config.delete = [];

if(!config.tracked)
  config.tracked = {};

exports.updateFileStats = function (statuses) {
    config.fileStatuses = {};
}

//--------------------------------  Utils  -----------------------------------//

function hasBeenModified (id) {
  //Todo: verify file has changed.
  return true;
}

function updateArray (array, fileString, remove) {
  let files = fileSrvc.getFilesThatMatch(fileString);
  console.log("fs: " + fileString);
  fileString.replace("*", ".*");
  if (Array.isArray(files)) {
    for(index in files) {
      let id = files[index].id;
      if(remove) {
        utilSrvc.arrayRemoveObj(array, id);
      }
      else {
        if(id && utilSrvc.arrayContains(array, id) == -1 && hasBeenModified(id)){
          array.push(id);
        }
      }
    }
  }
  else
    console.log("add input cannot be interperted: " + files);
}

exports.getConfig = function () {
  const ret = JSON.parse(JSON.stringify(config));
  return ret;
}

exports.save = function () {
  jsonFS.save(config);
}

//--------------------------  Config Modification  ---------------------------//

exports.clean = function () {
  config.add = [];
  config.delete = [];
}

exports.delete = function (fileString) {
  updateArray(config.delete, fileString);
  removeAdd(fileString);
}

function removeAdd (fileString) {
  updateArray(config.add, fileString, true);
}

function removeDelete (fileString) {
  updateArray(config.delete, fileString, true);
}

exports.removeAdd = removeAdd;

exports.removeDelete = removeDelete;

exports.add = function (fileString) {
  updateArray(config.add, fileString, false);
  // removeDelete(fileString);
};

//---------------------------------  Output ----------------------------------//

function printStatus(header, files, color) {
  console.log(header);
  for(index in files) {
    console.log(colors[color]("\t" + files[index].filename));
  }
  console.log("\n");
}

function define(variable) {
  console.log("arg: " + process.argv[3]);
  switch (process.argv[3]) {
    case 'projectName':
      if(config.projectObj === undefined)
        config.projectObj = {};
      console.log('here');
      config.projectObj.name = process.argv[4];
      config.projectObj.projectUserId = 0;
      break;
  }

  console.log(JSON.stringify(config));
}

exports.define = define;

exports.status = function () {
  let files = fileSrvc.getFilesThatMatch(".*");
  let addFiles = [];
  let deleteFiles = [];
  let untrackedFiles = [];
  for(index in files) {
    let file = files[index];
    if(utilSrvc.arrayContains(config.add, file.id) != -1) {
      addFiles.push(file);
    }
    else if (utilSrvc.arrayContains(config.delete, file.id) != -1) {
      deleteFiles.push(file);
    }
    else {
      untrackedFiles.push(file);
    }
  }
  printStatus("File To Be added", addFiles, "green");
  printStatus("Files To Be Deleted", deleteFiles, "red");
  printStatus("Untracked Files", untrackedFiles, "yellow");
}

function updateTracked (files) {
  for (let index in files) {
    let file = files[index];
    console.log(JSON.stringify(file));
    if(!config.tracked[file.id])
      config.tracked[file.id] = {};
    config.tracked[file.id].date = file.lastModifyDate;
  }
}

function removeFromTracked (files) {
  for (let index in files) {
    let file = files[index];
    delete config.tracked[file];
  }
}

function isModified(file) {
  return config.tracked[file.id] &&
      config.tracked[file.id].lastModifyDate < file.lastModifyDate;
}

exports.updateTracked = updateTracked;
exports.removeFromTracked = removeFromTracked;
exports.isModified = isModified;
