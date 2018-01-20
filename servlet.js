var express = require("express");
var fs = require("fs");
var shell = require('shelljs');
var Regex = require('regex');
console.log("Reg: " + JSON.stringify(Regex))

var fileSrvc = require('./services/fileSrvc');
var app = express();
var out = "";

app.listen(9000, function(){
  console.log("Hi")
});

app.use(express.static('public'))
app.use(express.static('files'))

let hello = require('./services/fileSrvc');

var FileReader = require('filereader')
fileReader = new FileReader();

console.log(fileSrvc)
console.log(fileSrvc.getFiles('.'));

app.get("/vcs/add/file", function(req, res){
  //console.log("DEBUG ", JSON.stringify(req.query))

  if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
  }
  else {
    shell.echo("booYa!");
    shell.mkdir("foo");
  }

  fs.watchFile("./files/tes.java", function () {
    console.log("File changed!");
  });

  console.log("Query ", req.query)

  res.send("Hello world! \n " + out)
});
