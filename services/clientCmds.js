// print process.argv
var fs = require("fs");
var shell = require('shelljs');
var fileSrvc = require('./fileSrvc');
var configSrvc = require('./configSrvc');
const pullSrvc = require('./pullSrvc');
const utilSrvc = require('./UtilSrvc');
console.log("fresh:" + JSON.stringify(process.argv));


function itterativeCmds (cmd) {
  console.log(JSON.stringify(process.argv));
  let found = false;
  for(let index=3; index < process.argv.length; index++) {
    let arg = process.argv[index];
    if (arg) {
      arg = arg.replace(/\.\*/g, "*");
      arg = arg.replace(/\*/g, ".*");
    }
    console.log(arg);
    switch (cmd) {
      case 'add':
        configSrvc.add(arg);
        found = true;
        break;
      case 'delete':
        configSrvc.delete(arg);
        found = true;
        break;
    }
  }
  return found;
}

function oneShotCmds (cmd) {
  let found = false;
  switch (cmd) {
    case 'clean':
      configSrvc.clean();
      found = true;
			break;
    case 'status':
      configSrvc.status();
      found = true;
			break;
    case 'commit':
      pullSrvc.commit();
      found = true;
			break;
    case 'checkout':
      pullSrvc.checkout(process.argv[3], process.argv[4], process.argv[5]);
      found = true;
			break;
    case 'define':
      configSrvc.define();
      found = true;
			break;
    case 'help':
      utilSrvc.help(process.argv[3]);
      found = true;
			break;
  }
  return true;
}


const cmd = process.argv[2];

// var path = require('path');
// var here = path.basename(__dirname) + '/' + path.basename(__filename);
//
// let args = JSON.parse(JSON.stringify(process.argv));
//
// args.splice(0,3)
//
// if(args.length == 0)
//   args.push(undefined);
if(!itterativeCmds(cmd))
  if(!oneShotCmds(cmd))
    console.log("Unrecognized command '" + cmd + "'\n\tRun 'vcs help' for command list");

configSrvc.save();
