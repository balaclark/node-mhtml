'use strict';

var path = require('path');
var Part = require(__dirname + '/part');

module.exports = PartCollection;

function PartCollection() {
  this.length = 0;
  this.basePath = null;
  this._parts = [];
}

PartCollection.prototype = {

  push: function (part) {

    var dirname;

    if (!(part instanceof Part)) {
      throw new Error('Invalid part');
    }

    // TODO: move this into Path::setBasePath()
    if (!this.length && part.meta('content-type') === 'text/html') {
      dirname = path.dirname(part.meta('content-location'));
      if (dirname.match(/^file:/)) {
        part.basePath = this.basePath = dirname.replace(/\\/g, '/') + '/';
      }
    } else {
      part.basePath = this.basePath;
    }

    this._parts.push(part);
    this.length = this._parts.length;
  },

  each: function (cb) {
    this._parts.forEach(cb);
  }
};
