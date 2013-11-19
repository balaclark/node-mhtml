'use strict';

var path = require('path');
var mimelib = require('mimelib')
var cheerio = require('cheerio');

module.exports = Part;

function Part() {
  this.meta = {};
  this.content = '';
}

Part.prototype = {

  decoder: {
    base64: function (encoded) {
      return new Buffer(encoded, 'base64');
    },
    'quoted-printable': mimelib.decodeQuotedPrintable
  },

  filename: function () {

    if (this.meta.hasOwnProperty('content-location')) {
      return path.basename(this.meta['content-location'].replace(/\\/g, '/'));
    }

    // TODO: use content-id if present?
    var ext = (mimelib.contentTypesReversed.hasOwnProperty(this.meta['content-type']))
      ? '.' + mimelib.contentTypesReversed[this.meta['content-type']] : '';

    return Math.floor(Math.random() * 5000000000) + ext;
  },

  decoded: function (cb) {

    var decoded = this.decoder[this.meta['content-transfer-encoding']](this.content);

    // TODO: make this optional
    if (this.meta['content-type'].match('text/html')) {

      var $ = cheerio.load(decoded);
      var attrs = $('[href]');
      var todo = attrs.length;

      attrs.each(function () {

        var attr = $(this).attr('href');
        if (attr.match(/^file:/)) {
          decoded = decoded.replace(new RegExp(attr, 'g'), attr.match(/[^/]*$/)[0]);
        }

        todo--;
      });

      if (!todo) cb(null, decoded);

    } else {
      cb(null, decoded)
    }
  }
};
