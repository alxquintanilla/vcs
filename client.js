var express = require("express");
var fs = require("fs");
var shell = require('shelljs');
var fileSrvc = require('./services/fileSrvc');

var configSrvc = require('./services/configSrvc');



// print process.argv
const cmd = process.argv[2];

console.log("cmd: " + cmd);
console.log("dirname: " + __dirname);

var path = require('path');
var here = path.basename(__dirname) + '/' + path.basename(__filename);
console.log("relPath: " + here)

//fileSrvc.getFiles(".")
console.log("files: " + fileSrvc.getFiles("."))

console.log(process.argv);
switch (cmd) {
  case 'add':
    configSrvc.add(process.argv[3]);
}



configSrvc.save();
