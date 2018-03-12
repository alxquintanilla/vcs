const mapper = require("./serverFileMapper");
const fileSrvc = require("./fileSrvc");
const fs = require("fs");

let files = fileSrvc.getFiles("./files");
let projObj = {
  name: "newProject",
  projectUserId: 2,
  files: files,
  // branch: "bad ass mother",
  version: 0,
  remove: [4,3]
}

for(index in files) {
  files[index].id = undefined;
}


// files = mapper.pull(projObj);
// files = mapper.checkout(projObj);
// console.log(JSON.stringify(files));
//
// fileSrvc.saveFiles(files, "./filePot/");
mapper.push(projObj);
// mapper.newProject(projObj);
// mapper.saveNewVersion(projObj);
