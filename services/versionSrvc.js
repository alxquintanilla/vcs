let updateObj = [{
  fileId: 0,
  fileName: 'file1';
  content: 'hello world'
},{
  fileId: 1,
  fileName: 'file2',
  content: 'goodbye world'
}];

let tracker = {
  ip: 837464,
  lastPullDate:
}

let fileMap = {
  remoteId: 3,
  serverId: 4,
}

var shell = require('shelljs');
var fileSrvc = require('./services/fileSrvc');

exports.newProjects(name, files) {
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
}

exports.update = function (updateObj) {

}
