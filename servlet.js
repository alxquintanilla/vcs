var express = require("express");
var app = express();
var out = "";

app.listen(9000, function(){
  console.log("Hi")
});

app.get("/vcs/add/file", function(req, res){
  //console.log("DEBUG ", JSON.stringify(req.query))
  console.log("Query ", req.query)
  console.log("")
  res.send("Hello world! \n " + out)
});
