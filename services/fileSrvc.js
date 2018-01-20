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

function getFiles(dir) {
//    console.log(ignore(dir) + ") dir: '" + dir + "'")
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
        else results.push(getFileObj(file, true));
    })
    return results
  }
}

exports.getFiles = getFiles;
