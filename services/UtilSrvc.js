const helpJS = require('./data/help');

function help (key) {
  if (!processTopic(key, 'Commands', helpJS.cmds)) {
    console.log('\n');
    processTopic(key, 'Information', helpJS.info);
  }
}

exports.help = help;

function processTopic (key, title, array) {
  if(!key) {
    console.log(title + ":")
  }
  for (let index in array) {
    let t = array[index];
    if(!key) {
      console.log("\t" + t.name + " - " + t.format)
    } else {
      if(t.name.toLowerCase() == key.toLowerCase()) {
        printTopic(t);
        return true;
      }
    }
  }
  if (key) {
    console.log("Unrecognized help topic '" + key + "'.")
    help();
  }
}

function printTopic (topic) {
  console.log(topic.name + "\n\t" + topic.format + "\n\t" + topic.description +
    "\n\tParams:");
  for (let index in topic.params) {
    let param = topic.params[index];
    console.log('\t\t' + param.name + " - " + param.description);
  }

}

exports.arrayContains = function (array, obj, customCmp) {
  if(customCmp) {
    cmp = customCmp;
  }
  else {
    cmp = objCmp;
  }

  for(index=0; index < array.length; index++) {
    if(cmp(array[index], obj)) {
      return index;
    }
  }
  return -1;
}

exports.objectContains = function (object, obj, customCmp) {
  if(customCmp) {
    cmp = customCmp;
  }
  else {
    cmp = objCmp;
  }

  for(index in object) {
    if(cmp(object[index], obj)) {
      return index;
    }
  }
  return undefined;
}

function objCmp (obj1, obj2) {
  if (obj1 == obj2) {
    return true;
  }
}

exports.arrayRemoveObj = function (array, obj) {
  for(index=0; index < array.length; index++) {
    if (array[index] === obj) {
      array.splice(index, 1);
    }
  }
  return undefined;
}

exports.arrayRemoveIndex = function (array, index) {
  let retVal = array[index];
  array = array.splice(0, index).concat(array.splice(1));
  return retVal;
}

exports.getKeyByValue = function (obj, val) {
  return Object.keys(object).find(key => obj[key] === value);
}

exports.removeIterate = function (str, regex, replaceStr) {
  while(str.match(regex)) {
     str = str.replace(regex, replaceStr);
   }
   return str;
}
