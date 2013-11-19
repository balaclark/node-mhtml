'use strict';

var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var mkdir = require('mkdirp');
var rmdir = require('rimraf');
var path = require('path');
var EOL = require('os').EOL;
var Part = require(__dirname + '/part');

module.exports = extractMHTML;

function MHTMLExtractor(source, opts) {
  this.boundary = null;
  this.source = source;
  this.parts = [];
  return this;
}

MHTMLExtractor.prototype = {

  getParts: function (cb) {

    var instream = fs.createReadStream(this.source);
    var outstream = new stream;
    var rl = readline.createInterface(instream, outstream);

    var lineno = 0;
    var lines = [];
    var boundary;
    var validMhtml = false;
    var part;
    var meta;

    var readMeta = false;
    var readContent = false;

    rl.on('line', function readLine(line) {

      lines.push(line);

      boundary = line.match(/boundary=["'](.+?)["']/);

      if (!this.boundry && line.match('Content-Type: multipart/related')) {
        validMhtml = true;
      }

      if (!this.boundary && boundary) {
        this.boundary = boundary[1];
      }

      if (line.match(new RegExp('^--' + this.boundary))) {
        readMeta = true;
        readContent = false;
        part = new Part();
      }

      if (readMeta === true) {

        // a newline after the meta block signifies the start of the content block
        if (line.match(/^$/)) {
          readMeta = false;
          readContent = true;
          this.parts.push(part);
        } else {
          meta = line.match(/^(Content-[A-Za-z-]+):(?:\s+)?(.*)/i);
          if (meta) {
            part.meta[meta[1].toLowerCase()] = meta[2];
          }
        }
      }

      if (readContent === true && !line.match(/^$/)) {
        part.content += line + EOL;
      }

      lineno++;

    }.bind(this));

    rl.on('close', function endRead() {
      if (!validMhtml) cb(new Error('Invalid MHTML file'));
      else cb(null);
    }.bind(this));
  },

  extractParts: function (dest, cb, force) {

    // TODO: optionally delete existing, otherwise return error
    // TODO: allow mode to be passed as an argument
    // TODO: save assets in subfolder?

    var noParts = this.parts.length;
    var done = 0;

    var extract = function (err) {

      mkdir(dest, function (err) {

        if (err) return cb(err);

        this.parts.forEach(function (part) {

          var filePath = path.join(dest, part.filename());

          part.decoded(function (err, content) {

            fs.writeFile(filePath, content, function (err) {
              if (err) return cb(err);
              done++;
              if (done == noParts) return cb(null);
            });
          });
        });
      }.bind(this));
    }.bind(this);

    if (force) {
      rmdir(dest, extract);
    } else {
      extract();
    }
  },

  extract: function (dest, cb, force) {
    var force = (typeof force === 'undefined') ? false : force;
    this.getParts(function readFile(err) {
      if (err) return cb(err);
      this.extractParts(dest, function extractParts(err) {
        cb(err);
      }, force);
    }.bind(this));
  }
};

function extractMHTML(source, destination, cb, force) {
  new MHTMLExtractor(source).extract(destination, cb, force);
}
