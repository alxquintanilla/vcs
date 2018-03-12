exports.cmds = [{
  name: 'Add',
  format: 'vcs add [file 1 exp] [file 2 exp]...',
  params: [{
    name: 'file [N] exp',
    definition: 'File expessions (see expression)'
  }],
  description: 'Adds all files fitting the given file expressions'
},{
  name: 'Delete',
  format: 'vcs delete [file 1 exp] [file 2 exp]...',
  params: [{
    name: 'file [N] exp',
    definition: 'File expessions (see expression)'
  }],
  description: 'Deletes all files fitting the given file expressions'
},{
  name: 'Clean',
  format: 'vcs clean',
  params: [],
  description: 'Removes all files from add and delete queues'
},{
  name: 'Status',
  format: 'vcs status',
  params: [],
  description: 'Prints the current state of the files in your working directory'
},{
  name: 'Commit',
  format: 'vcs commit [message]',
  params: [{
    name: 'message',
    definition: 'A message to be attached with your commit'
  }],
  description: 'Saves a version on your local with corresponding to the add and ' +
  'delete files indicated.'
},{
  name: 'Define',
  format: 'vcs define [variable name] [value]',
  params: [{
    name: 'variable name',
    definition: 'The name of the variable you wish to define.'
  },{
    name: 'value',
    definition: 'The new value of the given variable'
  }],
  description: 'You will be prompted to use this command when you configuration ' +
  'is insufficient'
},{
  name: 'Checkout',
  format: 'vcs checkout [project name] [branch name] [version]',
  params: [{
    name: 'project name',
    definition: 'The name of the project'
  },{
    name: 'branch name',
    definition: 'The name of the branch - Optional(Master or last branch checked out by default)'
  },{
    name: 'version',
    definition: 'The version number - Optional(Latest version by defualt)'
  }],
  description: 'Command is used to get copies of different projects branches and versions'
}];

exports.info = [,{
  name: 'expression',
  format: 'Under the hood it simply matches with a regex expression. However ' +
  'you can but dont have to use * to match any string as seen in the following ' +
  'examples.',
  params: [],
  description: '\texamples:\n \t\t"./sampleDir" - all files within the home sampleDir.' +
  '\t\t"/sampleDir/*.java" - all files within a sampleDir that are java files'
}];
