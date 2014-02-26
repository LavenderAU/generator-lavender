'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var WebappGenerator = module.exports = function WebappGenerator(args, options, config) {

  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function() {
    this.installDependencies({
      skipInstall: options['skip-install'],
      callback: function() {
        console.log(chalk.bold.green("\n*** *** *** *** *** *** *** *** *** *** *** *** ***\n\nAll done. Compiling vendor specific stylesheets.\n\n*** *** *** *** *** *** *** *** *** *** *** *** ***"));
        this.spawnCommand('grunt', ['init']);
      }.bind(this)
    });
    var projectDep = [
      'jquery',
      'normalize.css',
      'less-elements'
    ];

    if (this.includeGSAP) {
      projectDep.push('greensock');
    }
    if (this.includeBootstrap) {
      projectDep.push('bootstrap');
    }
    if (this.includeRaphael) {
      projectDep.push('raphael');
    }
    if (this.includeAccounting) {
      projectDep.push('accounting');
    }

    if (this.includeJQUI) {
    	projectDep.push('jquery-ui')
    }
    this.bowerInstall(projectDep, {
      save: true
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
    default: 'LDXXXX'
  }];

  this.prompt(prompts, function(answers) {
    this.projectName = answers.projectName;
    cb();
  }.bind(this));
};

WebappGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

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
    default: 'dev.index.html'
  }, {
    name: 'buildFile',
    message: 'Enter the name of the html release file?',
    default: 'index.html'
  }, {
  	type: 'checkbox',
    name: 'features',
    message: 'Awesomesauce. Now what more would you like?',
    choices: [{
      name: 'Lavender Core',
      value: 'includeCore',
      checked: false
    }, {
      name: 'Bootstrap',
      value: 'includeBootstrap',
      checked: false
    }, {
      name: 'Greensock JS',
      value: 'includeGSAP',
      checked: false
    }, {
    	name: 'Jquery-UI',
    	value: 'includeJQUI',
    	checked: false
    }, {
      name: 'accounting.js',
      value: 'includeAccounting',
      checked: false
    }, {
      name: 'Raphael',
      value: 'includeRaphael',
      checked: false
    }]
  }];

  this.prompt(prompts, function(answers) {
    var features = answers.features;

    function hasFeature(feat) {
      return features.indexOf(feat) !== -1;
    }
    this.includeCore = hasFeature('includeCore');
    this.includeBootstrap = hasFeature('includeBootstrap');
    this.includeGSAP = hasFeature('includeGSAP');
    this.includeRaphael = hasFeature('includeRaphael');
    this.includeAccounting = hasFeature('includeAccounting');
    this.includeJQUI = hasFeature('includeJQUI');

    this.devFile = answers.devFile;
    this.buildFile = answers.buildFile;
    if (answers.devFolder == ".") {
      this.devFolder = "";
      this.useminDevDest = "__dirname";
    } else {
      this.devFolder = this.useminDevDest = answers.devFolder + "/";
      this.useminDevDest = "'" + this.useminDevDest + "'";
    }

    if (answers.buildFolder == ".") {
      this.buildFolder = "";
      this.useminBuildDest = "__dirname";
    } else {
      this.buildFolder = this.useminBuildDest = answers.buildFolder + "/";
      this.useminBuildDest = "'" + this.useminBuildDest + "'";
    }

    //include jquery by default
    this.vendorScripts = scriptTag("devassets/vendor/jquery/dist/jquery.js");
    var indent = "\r\n\t\t";
    if (this.includeGSAP) {
      this.vendorScripts += indent + scriptTag("devassets/vendor/greensock/src/uncompressed/TweenMax.js");
    }
    if (this.includeAccounting) {
      this.vendorScripts += indent + scriptTag("devassets/vendor/accounting/accounting.js");
    }
    if (this.includeRaphael) {
      this.vendorScripts += indent + scriptTag("devassets/vendor/raphael/raphael.js");
    }
    if (this.includeJQUI) {
    	this.vendorScripts += indent + scriptTag("devassets/vendor/jquery-ui/ui/jquery-ui.js");
    }
    //always include core last
    if (this.includeCore) {
      this.vendorScripts += indent + scriptTag("devassets/js/lib/lavcore/core.src.js");
    }

    this.vendorStyleSheets = "";
    this.vendorGruntTasks = "";
    if (this.includeBootstrap) {
      this.vendorStyleSheets += styleTag("devassets/vendor/bootstrap/dist/css/bootstrap.css");
      this.vendorGruntTasks += ",\nbootstrap:{files:{\"" + this.devFolder + "devassets/css/vendor/bootstrap/dist/css/bootstrap.css\": \"" + this.devFolder + "devassets/vendor/bootstrap/less/bootstrap.less\"}}";
    }

    if (this.includeJQUI) {
    	this.vendorStyleSheets += indent + styleTag("devassets/vendor/jquery-ui/themes/base/jquery.ui.all.css");
    }

    cb();
  }.bind(this));

};

WebappGenerator.prototype.app = function app() {
  var folders = [
    this.devFolder,
    this.buildFolder,
    this.buildFolder + 'assets',
    this.buildFolder + 'assets/img',
    this.buildFolder + 'assets/css',
    this.buildFolder + 'assets/css/vendor',
    this.buildFolder + 'assets/js',
    this.buildFolder + 'assets/js/vendor',
    this.devFolder + 'devassets',
    this.devFolder + 'devassets/less',
    this.devFolder + 'devassets/js',
    this.devFolder + 'devassets/js/lib',
    this.devFolder + 'devassets/css',
    this.devFolder + 'devassets/css/vendor'
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
  if (this.includeCore) {
    var cb = this.async();
    console.log(chalk.bold.green("\n*** *** *** *** *** *** *** *** *** *** *** *** ***\n\nDownloading Lavender Core.\n\n*** *** *** *** *** *** *** *** *** *** *** *** ***"));
    var http = require('http');
    var _this = this;
    var parts = [];
    http.get('http://lav.net.au/cdn/core.src.js', function(res) {
      res.on("data", function(chunk) {        
        parts.push(chunk);        
      }).on('end', function() {
        _this.write(_this.devFolder + 'devassets/js/lib/lavcore/core.src.js', parts.join(''));        
        cb();
      });
    }).on('error', function(e) {
      console.log("Error: " + e.message);
    });
  }

  this.copy('bowerrc', '.bowerrc');
  this.write(this.devFolder + 'devassets/js/main.js', '//main.js');
  this.write(this.devFolder + 'devassets/css/main.css', '/* */');
  this.write(this.devFolder + 'devassets/less/main.less',
    '@import "../vendor/less-elements/elements.less";');

  this.template('h5bp.html', this.devFolder + this.devFile);
};


WebappGenerator.prototype.getCore = function getCore() {

};