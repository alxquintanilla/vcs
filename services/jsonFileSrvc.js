var shell = require('shelljs');
var fileSrvc = require('./fileSrvc');

exports.getFileObject = function (fileLocName) {
  if(fileLocName.indexOf('.') == 0)
    fileLocName = process.cwd() + fileLocName.substr(1);
  try {
    console.log("js file loc: " + fileLocName)
    let fileObj = require(fileLocName);
    fileObj.fileLocName = fileLocName;
    return fileObj;
  }
  catch (e) {
    console.log("error: " + JSON.stringify(e));
    return {fileLocName: fileLocName};
  }
}

exports.save = function (fileObj) {
  if(fileObj.fileLocName === undefined)
    return false;

    const expStr = "exports.";
    const eq = '=';
    const ret = "\n";

    let content = '';
    for (v in fileObj) {
      if(v != 'fileLocName')
        content += expStr + v + eq + JSON.stringify(fileObj[v], null, 2) + ret;
    }

    fileSrvc.save(fileObj.fileLocName, content);
}
