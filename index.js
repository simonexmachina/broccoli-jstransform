var Filter = require('broccoli-filter'),
    jstransform = require('jstransform'),
    minimatch = require('minimatch');

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
  this.ignoreRegExps = this.options.ignoredFiles.map(function(pattern) {
    return minimatch.makeRe(pattern);
  });
}

JSTransformPlugin.prototype.processString = function(fileContents, relativePath) {
  if (this.shouldTransform(relativePath)) {
    try {
      fileContents = jstransform.transform(this.visitors, fileContents).code;
    }
    catch(e) {
      e.message = "Call to jstransform.transform() failed for file '" + relativePath + "': " + e.message;
      throw e;
    }
  }
  return fileContents;
};

JSTransformPlugin.prototype.shouldTransform = function(relativePath) {
  for (var i = 0; i < this.ignoreRegExps.length; i++) {
    if (this.ignoreRegExps[i].test(relativePath)) {
      return false;
    }
  }
  return true;
};

function defaultVisitors() {
  return jstransformVisitors([
    'es6-arrow-function',
    'es6-class',
    'es6-object-concise-method',
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
