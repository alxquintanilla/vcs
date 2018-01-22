var shell = require('shelljs');
var fileSrvc = require('./services/fileSrvc');

exports.getFileObject = function (fileLocName) {
  let fileObj = require(fileLocName);
  fileObj.fileLocName = fileLocName;
  return fileObj;
}

exports.save(fileObj) {
  if(fileLocName === undefined)
    return false;

    const expStr = "exports.";
    const eq = '=';
    const ret = "\n";

    Object.getOwnPropertyNames(fileObj);
    let content = '';
    for (v in vars) {
      if(v != 'fileLocName')
        content += expStr + v + eq + JSON.stringify(vars[index]) + ret;
    }

    fileSrvc.save(fileObj.fileLocName, content);
}
