var config = require('../.vcs/config');
var fileSrvc = require('./fileSrvc');

if(!config.ignorePaths)
  config.ignorePaths = ['.*.git.*', '.*.vcs.*', '.*.node_modules.*'];

if(!config.add)
  config.add = [];

if(!config.delete)
  config.delete = [];

exports.updateFileStats = function (statuses) {
    config.fileStatuses = {};
}

exports.clean = function () {
  config.add = [];
  config.delete = [];
}

exports.delete = function (files) {


  if (Array.isArray(files))
  config.delete = config.delete.concat(files);
  else
  console.log("delete input cannot be interperted: " + files);
};

exports.add = function (fileString) {
  console.log("fs: " + fileString);
  let files = fileSrvc.getFilesThatMatch(fileString);
  if (Array.isArray(files)) {
    for(index in files)
      console.log("saved: " + files[index].id);
      config.add = config.add.concat(files[index].id);
  }
  else
    console.log("add input cannot be interperted: " + files);
};

exports.getConfig = function () {
  const ret = JSON.parse(JSON.stringify(config));
  console.log("config: " + ret);
  return ret;
}

exports.save = function () {
  exportStr = "exports.";
  vars = ['ignorePaths', 'delete', 'add'];
  data = "";
  for (index in vars) {
    jsonObj = JSON.stringify(config[vars[index]]);
    data += exportStr + vars[index] + "=" + jsonObj + ";\n";
  }

  fileSrvc.save("./.vcs/config.js", data);

}
