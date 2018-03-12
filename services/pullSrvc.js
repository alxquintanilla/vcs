const fileSrvc = require('./fileSrvc');
const configSrvc = require('./configSrvc');
const fileMapper = require('./fileMapper');
const utilSrvc = require('./UtilSrvc');

const files = fileSrvc.getFiles('/Users/jozse/workspace/JDBCGenerator');

fileMapper.setProjectRepoName('.vcs/repo')

let count = 1;
for(index in files) {
  files[index].id = count++;
}


// let projectObj = {
//   projectUserId: 0,
//   name: projObj.name,
//   files: projObj.files,
//   version: 0
// }

function pull () {

}

function commit () {
  let config =  configSrvc.getConfig();
  if(!config.projectObj) {
    console.log('Please define project name cmd: vcs define projectName [Project Name]');
  } else {
    let files = fileSrvc.getFiles();
    let addedFiles = [];

    for (let index in files) {
      let file = files[index];
      if(utilSrvc.arrayContains(config.add, file.id) != -1) {
        addedFiles.push(file);
      }
    }

    config.projectObj.files = addedFiles;
    console.log("length: " + config.projectObj.files.length);
    if (!fileMapper.newProject(config.projectObj)) {
      fileMapper.push(config.projectObj);
    }

    configSrvc.removeFromTracked(config.delete);
    configSrvc.updateTracked(addedFiles);

    configSrvc.clean();
  }
}

function update() {

}

function checkout (projectName, branch, version) {
  let config =  configSrvc.getConfig();
  if (config.projectObj) {
      commit();
  }

  let projectObj = {
    name: projectName,
    branch: branch,
    version: version
  }

  // let files = fileMapper.pull(projectObj);
  fileSrvc.clean();

  let pulled = fileMapper.pull(projectObj);
  console.log(JSON.stringify(pulled));
}

exports.checkout = checkout;
exports.commit = commit;
