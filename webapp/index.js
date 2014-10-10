'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var WebappGenerator = module.exports = function WebappGenerator(args, options, config) {

  yeoman.generators.Base.apply(this, arguments);

  this.vendorList = [{
    id: 'core-js',
    name: 'Core JS'
  }, {
    id: 'jquery',
    name: "Jquery v2"
  }, {
    id: 'jquery#1.10',
    name: "Jquery v1.10"
  }, {
    id: "greensock",
    name: "Greensock TweenMax"
  }, {
    id: "bootstrap",
    name: "Bootstrap",
    dependencies: ["respond"]
  }, {
    id: "respond",
    name: "RespondJS"
  }, {
    id: "html5shiv",
    name: "HTML5Shiv"
  }, {
    id: "modernizr",
    name: "Modernizr"
  }, {
    id: "raphael",
    name: "Raphael JS"
  }, {
    id: "accounting",
    name: "accounting.js"
  }, {
    id: "jquery-ui",
    name: "Jquery UI",
    dependencies: ["jqueryui-touch-punch"]
  }];

  this.on('end', function() {
    var projectDep = [
      'normalize.css',
      'less-elements'
    ];

    var i = -1,
      ii = this.selectedFeatures.length - 1;

    while (i++ != ii) {
      if (this.selectedFeatures[i] != 'includeCore') {
        projectDep.push(this.selectedFeatures[i]);

        /*
        var libWithDep = getLibDep(this.selectedFeatures[i].id, this.vendorList);
        if(libWithDep) {
          var j = libWithDep.dependencies.length;
          while (j--) {
            projectDep.push(libWithDep.dependencies[j]);
          }
        }
        */

      }
    }

    this.bowerInstall(projectDep, {
      save: true,
      callback: function() {
        //console.log ("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      }
    });

    this.installDependencies({
      skipInstall: options['skip-install'],
      callback: function() {
        console.log(chalk.bold.green("\n*** *** *** *** *** *** *** *** *** *** *** *** ***\n\nAll done. Compiling vendor specific stylesheets.\n\n*** *** *** *** *** *** *** *** *** *** *** *** ***"));
        this.spawnCommand('grunt', ['init']);
      }.bind(this)
    });

  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

/** **/

var scriptTag = function(src) {
  return "<script src=\"" + src + "\"></script>";
};

var styleTag = function(href) {
  return "<link rel=\"stylesheet\" type=\"text/css\" href=\"" + href + "\" />";
}

/** **/

util.inherits(WebappGenerator, yeoman.generators.Base);

WebappGenerator.prototype.welcome = function welcome() {
  var cb = this.async();
  console.log(chalk.bold.green('\n\nGreetings traveler.\n'));
  var prompts = [{
    name: 'projectName',
    message: 'What is the job code for this project?',
    default: 'ABC123'
  }];

  this.prompt(prompts, function(answers) {
    this.projectName = answers.projectName;
    cb();
  }.bind(this));
};

WebappGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  var i = -1,
    ii = this.vendorList.length - 1,
    /*choicesList = [{
      name: 'Lavender Core',
      value: 'includeCore',
      checked: false
    }];*/

    choicesList = [];

  while (i++ != ii) {
    choicesList.push({
      name: this.vendorList[i].name,
      value: this.vendorList[i].id,
      checked: false
    })
  }

  var prompts = [{
    name: 'devFolder',
    message: 'Ok so, where do you want to put the dev source files?',
    default: 'src'
  }, {
    name: 'buildFolder',
    message: 'And the compiled files?',
    default: 'dist'
  }, {
    name: 'devFile',
    message: 'Cheerios. Now enter the name of the html dev file?',
    default: 'index.html'
  }, {
    type: 'checkbox',
    name: 'features',
    message: 'Awesomesauce. Now what more would you like?',
    choices: choicesList
  }];

  this.prompt(prompts, function(answers) {
    var features = answers.features;
    this.selectedFeatures = features;

    function hasFeature(feat) {
      return features.indexOf(feat) !== -1;
    }

    //doing this for css
    this.includeBootstrap = hasFeature('bootstrap');
    this.includeJQUI = hasFeature('jquery-ui');
    this.isCoreApp = hasFeature("core-js");
    this.devFile = answers.devFile;

    if (answers.devFolder == ".") {
      this.devFolder = "";
      this.useminDevDest = "__dirname";
    } else {
      this.devFolder = this.useminDevDest = answers.devFolder;
      this.useminDevDest = "'" + this.useminDevDest + "'";
    }

    if (answers.buildFolder == ".") {
      this.buildFolder = "";
      this.useminBuildDest = "__dirname";
    } else {
      this.buildFolder = this.useminBuildDest = answers.buildFolder;
      this.useminBuildDest = "'" + this.useminBuildDest + "'";
    }

    var indent = "\r\n\t\t";

    this.vendorScripts = indent;
    this.vendorScripts = indent + scriptTag("assets/js/main.js");

    this.vendorStyleSheets = "";
    this.vendorGruntTasks = "";

    this.gruntInit = "bower";
    if (this.isCoreApp) {
      this["coreapp"] = "core-app='Main'"
    }
    if (this.includeBootstrap) {
      this.vendorStyleSheets += styleTag("assets/vendor/bootstrap/dist/css/bootstrap.css");
      this.vendorGruntTasks += ",\r\n\tbootstrap:{files:{\"" + this.devFolder + "/assets/vendor/bootstrap/dist/css/bootstrap.css\": \"" + this.devFolder + "/assets/vendor/bootstrap/less/bootstrap.less\"}}";
      this.gruntInit += ", 'less:bootstrap'";
    }
    if (this.includeJQUI) {
      this.vendorStyleSheets += indent + styleTag("assets/vendor/jquery-ui/themes/base/jquery.ui.all.css");
    }
    cb();
  }.bind(this));

};

WebappGenerator.prototype.app = function app() {
  var folders = [
    this.devFolder,
    this.devFolder + '/assets',
    this.devFolder + '/assets/less',
    this.devFolder + '/assets/js',
    this.devFolder + '/assets/js',
    this.devFolder + '/assets/js/lib',
    this.devFolder + '/assets/css',
    this.devFolder + '/assets/img',
    this.devFolder + '/assets/img/sprite-src',
    this.devFolder + '/assets/vendor'
  ];
  var i = -1,
    ii = folders.length - 1;
  while (i++ != ii) {
    this.mkdir(folders[i]);
  }
  this.template('Gruntfile.js', 'Gruntfile.js');

  this.copy('_package.json', 'package.json');
  this.copy('_bower.json', 'bower.json');
};

WebappGenerator.prototype.projectfiles = function projectfiles() {

  this.write(this.devFolder + '/assets/js/main.js', this.readFileAsString(path.join(__dirname, 'templates/main.js')));

  var buildName = this.devFile.substr(0, this.devFile.lastIndexOf('.')) || this.devFile;

  this.buildScriptName = "<!-- build:js assets/js/" + buildName + ".script.min.js -->";
  this.buildStyleName = "<!-- build:css assets/css/" + buildName + ".style.min.css -->";

  this.copy('bowerrc', '.bowerrc');

  this.write(this.devFolder + '/assets/css/main.css', '/* */');
  this.write(this.devFolder + '/assets/less/main.less',
    '@import "../vendor/less-elements/elements.less";');

  this.template('h5bp.html', this.devFolder + "/" + this.devFile);
};