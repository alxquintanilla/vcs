var fs = require("fs");
var shell = require('shelljs');
var configSrvc = require('./configSrvc');
var utilSrvc = require('./UtilSrvc');
var config = configSrvc.getConfig();

function ignore (dir) {
  for(index in config.ignorePaths) {
    if(dir.search(config.ignorePaths[index]) == 0)
      return true;
  }
  return false;
}

function clean () {
  shell.rm('-r', './*');
}

function getFilesThatMatch (str, dir) {
  if (!dir)
    dir = ".";

  files = getFiles(dir);

  let retFiles = [];
  let regExp = new RegExp(str);
  for (index in files) {
      if(regExp.test("./" + files[index].relname)) {
        retFiles.push(files[index]);
      }
  }

  return retFiles;
}

function getFileObj (filename, allInfo) {
    fileObj = {};

    if(!fs.existsSync(filename)) {
      return undefined;
    }

    stats = fs.statSync(filename)
    fileObj.id = stats.ino;
    fileObj.filename = filename;
    fileObj.lastModifyDate = stats.mtime;

    if(allInfo) {
      const fd = fs.openSync(filename, "r");
      var buffer = new Buffer(stats.size);

      fs.readSync(fd, buffer, 0, buffer.length, null);
      var data = buffer.toString("utf8", 0, buffer.length);

      fileObj.contents = data;
      fs.close(fd);
    }


    return fileObj;
}

exports.getFile = getFileObj;

function getDirectoriesWithName (str, dir) {
  if (!dir)
    dir = ".";
  files = getDirectories(dir);

  for (index in files) {
      if(files[index].relname === str) {
        retFiles.push(files[index]);
      }
  }
  return retFiles;
}

function getDirectories(dir, depth) {
  if (!dir)
    dir = ".";
  var results = []

  var list = fs.readdirSync(dir);
  list.forEach(function(file) {
      file = dir + '/' + file
      var stat = fs.statSync(file)
      if (stat && stat.isDirectory()) {
        results.push(file);

        if (depth === undefined || depth !== 0) {
          results.concat(getDirectories(dir, depth - 1));
        }
      }
  })
  return results
}

function getFiles(dir, ignoreIgnore) {
  if(!dir)
    dir = ".";

  if (ignoreIgnore || !ignore(dir)) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) {
          recRes = getFiles(file);
          if(recRes)
            results = results.concat(getFiles(file, ignoreIgnore))
        }

        else {
          let obj = getFileObj(file, true);
          obj.relname = file.substr(2);
          results.push(obj);
        }
      });
    return results
  }
}

function save(filename, data) {
  let linuxPath = "." + filename.substring(filename.indexOf("\\VcsProject\\") + 11).replace(/\\/g, "/");
  shell.mkdir("-p", linuxPath.substr(0, linuxPath.lastIndexOf("/")));
  console.log("filename: " + linuxPath);
  fs.writeFileSync(filename, data,{flag: 'w+'});
}

function saveFiles(files, dir) {
  if(!dir) {
    dir = "";
  }

  let ids = {};
  for (index in files) {
    const filename = dir + files[index].relname;
    shell.mkdir("-p", filename.substr(0, filename.lastIndexOf("/")));
    fs.writeFileSync(filename, files[index].contents)
    const stats = fs.statSync(filename)
    ids[files[index].relname] = stats.ino;
  }
  return ids;
}

exports.clean = clean;
exports.saveFiles = saveFiles;
exports.getFilesThatMatch = getFilesThatMatch;
exports.save = save;
exports.getFiles = getFiles;
exports.getDirectories = getDirectories;
