# broccoli-jstranform

Broccoli plugin for applying [jstransform](https://github.com/facebook/jstransform)
ES6 to ES5 transformations.

## Installation

```bash
npm install --save-dev broccoli-jstransform
```

## Usage

```js
var compileES6 = require('broccoli-jstransform');
var applicationJs = compileES6(sourceTree, options);
```

### Options

* `.transforms` (array): An array of jstransform transformations
  to be performed. Defaults to the full set of transforms included in jstranform.
  Options are:

  es6-arrow-function  
  es6-class  
  es6-destructuring  
  es6-object-concise-method  
  es6-object-short-notation  
  es6-rest-param  
  es6-template  
  es7-spread-property  

* `.visitors` (array): An array of custom tranforms. If `.transforms` is specified 
  then this option is ignored.
* `.ignoredFiles` (array): An array of file paths to ignore. These are included
  in the output tree without being transformed. [Glob patterns](https://github.com/isaacs/minimatch) 
  can be used.
* `.extensions` (array): File extensions to transform. Defaults to '.js'
* `.sourceMap`: Create source maps (experimental)
