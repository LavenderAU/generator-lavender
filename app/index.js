'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var LavenderGenerator = module.exports = function LavenderGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
  this.on('end', function() {           
    console.log ("Nothing to see here. Run "+chalk.bold.yellow("'yo lavender:webapp'")+" or "+chalk.bold.yellow("'yo lavender:email'") +" instead.");
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};


util.inherits(LavenderGenerator, yeoman.generators.Base);
