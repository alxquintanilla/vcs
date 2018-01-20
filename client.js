var express = require("express");
var fs = require("fs");
var shell = require('shelljs');
var Regex = require('regex');
var fileSrvc = require('./services/fileSrvc');


// print process.argv
const cmd = process.argv[2];

console.log("cmd: " + cmd);
console.log("dirname: " + __dirname);

var path = require('path');
var here = path.basename(__dirname) + '/' + path.basename(__filename);
console.log("relPath: " + here)

//fileSrvc.getFiles(".")
console.log("files: " + fileSrvc.getFiles("."))
