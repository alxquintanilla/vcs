var config = require('../.vcs/config');

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

exports.add = function (files) {
  if (Array.isArray(files))
    config.add = config.add.concat(files);
  else
    console.log("add input cannot be interperted: " + files);
};

exports.getConfig = function () {
  const ret = JSON.parse(JSON.stringify(config));
  console.log("config: " + ret);
  return ret;
}
