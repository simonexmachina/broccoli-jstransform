var Filter = require('broccoli-filter'),
    jstransform = require('jstransform');

module.exports = JSTransformPlugin;
JSTransformPlugin.prototype = Object.create(Filter.prototype);
JSTransformPlugin.prototype.constructor = JSTransformPlugin;
function JSTransformPlugin(inputTree, options) {
  if (!(this instanceof JSTransformPlugin)) return new JSTransformPlugin(inputTree, options);
  this.options = {
    extensions: ['js'],
    ignoredFiles: [],
    visitors: null
  };
  for (var key in options) {
    if (this.options.hasOwnProperty(key)) {
      this.options[key] = options[key];
    }
  }
  if (this.options.transforms) {
    this.visitors = jstransformVisitors(this.options.transforms);
  }
  else {
    this.visitors = this.options.visitors || defaultVisitors();
  }
  Filter.call(this, inputTree, this.options);
}

JSTransformPlugin.prototype.processString = function(fileContents, relativePath) {
  if (this.options.ignoredFiles.indexOf(relativePath) === -1) {
    fileContents = jstransform.transform(this.visitors, fileContents).code;
  }
  return fileContents;
};

function defaultVisitors() {
  return jstransformVisitors([
    'es6-arrow-function',
    'es6-class',
    'es6-object-short-notation',
    'es6-rest-param',
    'es6-template'
  ]);
}

function jstransformVisitors(transforms) {
  var visitors = [];
  transforms.forEach(function(transform) {
    var visitor = require('jstransform/visitors/' + transform + '-visitors');
    visitors = visitors.concat(visitor.visitorList);
  });
  return visitors;
}
