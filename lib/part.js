'use strict';

var mimelib = require('mimelib');
var cheerio = require('cheerio');

module.exports = Part;

function Part() {
  this._meta = {};
  this.basePath = '';
  this.content = '';
}

Part.prototype = {

  meta: function (key, value) {

    if (!key && !value) {
      return this._meta;
    }

    key = key.toLowerCase();

    if (value) {
      return this._meta[key] = value;
    }

    if (this._meta.hasOwnProperty(key)) {
      return this._meta[key];
    }
  },

  decoder: {
    base64: function (encoded) {
      return new Buffer(encoded, 'base64');
    },
    'quoted-printable': mimelib.decodeQuotedPrintable
  },

  filePath: function () {

    if (this.meta('content-location')) {
      return this.meta('content-location').replace(/\\/g, '/').replace(this.basePath, '');
    }

    // TODO: use content-id if present?
    var ext = (mimelib.contentTypesReversed.hasOwnProperty(this.meta('content-type')))
      ? '.' + mimelib.contentTypesReversed[this.meta('content-type')] : '';

    return Math.floor(Math.random() * 5000000000) + ext;
  },

  isLocal: function () {
    return Boolean(!this.meta('content-location') || this.meta('content-location').match(/^file:/));
  },

  decoded: function (cb) {

    var $, decoded = this.decoder[this.meta('content-transfer-encoding')](this.content);

    // convert all file:// links to be relative to the exported folder
    if (typeof decoded === 'string' && this.basePath) {

      // strip out any <base> tags as they are generally useless once the mhtml
      // is exported.
      // FIXME: this code is mostly for Excel files and is quite hacky, improve
      if (this.meta('content-type') === 'text/html') {
        $ = cheerio.load(decoded);
        $('head').find('base').remove();
        decoded = $.html();
      }

      decoded = decoded.replace(new RegExp(this.basePath, 'g'), '');
    }

    cb(null, decoded);
  }
};
