var fs = require("fs");
var configSrvc = require('./configSrvc');
var config = configSrvc.getConfig();

function ignore (dir) {
  for(index in config.ignorePaths) {
    if(dir.search(config.ignorePaths[index]) == 0)
      return true;
  }
  return false;
}


console.log("ignore: " + config.ignorePaths);

function getFilesThatMatch (str) {
  let files = getFiles('.');
  let retFiles = [];
  for (index in files) {
      console.log(index + str.search(files[index].relname) + ") str: " + str + "search: " + files[index].relname)
      if(str.search(files[index].relname) == 0) {
        console.log("pushed!")
        retFiles.push(files[index]);
      }
  }
  return retFiles;
}

function getFileObj (fileName, allInfo) {
    function getObj(id, lastModifyDate) {
      return {
        id: id,
        lastModifyDate: lastModifyDate
      }
    }

    fileObj = {};


    stats = fs.statSync(fileName)
    fileObj.id = stats.ino;
    fileObj.lastModifyDate = stats.mtime;

    console.log("stats: " + JSON.stringify(stats));
    if(allInfo) {
      const fd = fs.openSync(fileName, "r");
      var buffer = new Buffer(stats.size);

      fs.readSync(fd, buffer, 0, buffer.length, null);
      var data = buffer.toString("utf8", 0, buffer.length);

      fileObj.contents = data;
      fs.close(fd);
    }


    return fileObj;
}

function getDirectories(dir) {
  var results = []
  var list = fs.readdirSync(dir);
  list.forEach(function(file) {
      file = dir + '/' + file
      var stat = fs.statSync(file)
      state.relname = file;
      if (stat && stat.isDirectory()) {
        recRes = getFiles(file);
        results.push(getFileObj(file, true));
        if(recRes)
          results = results.concat(getFiles(file))
      }
  })
  return results
}

function getFiles(dir) {
    if (!ignore(dir)) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) {
          recRes = getFiles(file);
          if(recRes)
            results = results.concat(getFiles(file))
        }

        else {
          let obj = getFileObj(file, true);
          obj.relname = file;
          results.push(obj);
        }
      })
    return results
  }
}

function save(filename, data) {
  fs.writeFileSync(filename, data);
}

exports.getFilesThatMatch = getFilesThatMatch;
exports.save = save;
exports.getFiles = getFiles;
exports.getDirectories = getDirectories;
