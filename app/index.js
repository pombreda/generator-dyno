'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var DynoGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    this.log(this.yeoman);
    this.log(chalk.magenta('You\'re using the fantastic Dyno generator: \n Coffeescript, Jade Templates, Browserify, and Gulp'));

    var prompts = [{
      type: 'confirm',
      name: 'coffeescriptOption',
      message: 'Would you like to include Coffeescript?',
      default: true
    }, {
      type: 'confirm',
      name: 'bowerOption',
      message: 'Would you like to include Bower for dependency management?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.coffeescriptOption = props.coffeescriptOption;
      this.bowerOption = props.bowerOption;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('src');
    this.mkdir('src/scripts');

    if (!this.coffeescriptOption) {
      this.template('_main.js', 'src/scripts/main.js')
      this.template('_example.js', 'src/scripts/example.js')
      this.template('_index-js.jade', 'src/index.jade')
    } else {
      this.template('_main.coffee', 'src/scripts/main.coffee')
      this.template('_example.coffee', 'src/scripts/example.coffee')
      this.template('_index-coffee.jade', 'src/index.jade')
    }

    this.copy('_gulpfile.js', 'gulpfile.js');
    this.mkdir('src/images');
    this.copy('dyno-logo.png', 'src/images/dyno-logo.png')

    this.mkdir('src/stylesheets');
    this.template('_main.scss', 'src/stylesheets/main.scss')

    this.template('_package.json', 'package.json');

    if(this.bowerOption) {
      this.template('_bower.json', 'bower.json');
      this.copy('_bowerrc', '.bowerrc');
    }
    this.copy('gitignore', '.gitignore');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = DynoGenerator;
