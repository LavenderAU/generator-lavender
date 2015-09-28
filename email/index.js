'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var EmailGenerator = module.exports = function EmailGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
	
  this.on('end', function() {
  	this.installDependencies({
      skipInstall: options['skip-install']
    });
  });  
  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(EmailGenerator, yeoman.generators.NamedBase);

EmailGenerator.prototype.welcome = function welcome() {
	var cb = this.async();
  console.log(chalk.bold.green('\n\nGreetings traveler.\n'));
  var prompts = [{
    name: 'projectName',
    message: 'What is the job code for this project?',
    default: 'ABC123'
  }, {    
    name: 'clientName',
    message: 'And for which client?'    
  }, {
    name: 'litmusUsername1',
    message: 'Username for lavender.litmus.com:'
  }, {
    name: 'litmusPassword1',
    message: 'Password:'    
  }, {
    prefix: 'projectPrefix',
    message: 'Use prefix when packaging?',
    default: ''
  }/*, {
    name: 'litmusUsername2',
    message: 'Username for lavender2.litmus.com:'
  }, {
    name: 'litmusPassword2',
    message: 'Password:'    
  }*/];

  this.prompt(prompts, function(answers) {
    this.projectName = answers.projectName;
    this.clientName = answers.clientName;
    this.litmusUsername1 = answers.litmusUsername1;
    this.litmusPassword1 = answers.litmusPassword1;
    // this.litmusUsername2 = answers.litmusUsername2;
    // this.litmusPassword2 = answers.litmusPassword2;
    cb();
  }.bind(this));
}
EmailGenerator.prototype.askFor = function askFor() {

};

EmailGenerator.prototype.files = function files() {
	this.mkdir('img');
	this.template('Gruntfile.js', 'Gruntfile.js');
  this.copy('_package.json', 'package.json');
  this.copy('_bower.json', 'bower.json');
  this.copy('p.gif', 'img/p.gif');
  this.copy('index.json', 'index.json');
  this.copy('_index.jade', 'index.jade');
  this.template('_index.html', 'index.html');
};
