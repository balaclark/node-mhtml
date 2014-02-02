MHTML
-----

[![Build Status](https://api.travis-ci.org/balaclark/node-mhtml.png)](https://travis-ci.org/balaclark/node-mhtml)
[![Coverage Status](https://coveralls.io/repos/balaclark/node-mhtml/badge.png)](https://coveralls.io/r/balaclark/node-mhtml)

Extract MHTML files to HTML.

Usage
-----

### Command Line

Basic extract.
```sh
mhtml archive.mhtml
```

Extract to a different directory.
```sh
mhtml archive.mhtml output
```

Extracts all mhtml archives contained inside a folder.
```sh
mhtml archives
```

Get more usage instructions and examples.
```sh
mhtml --help
```

### Library

```js
var mhtml = require('/mhtml');
mhtml.extract('path/to/file.mhtml', 'path/to/destination', function (err) {
  console.log('done.');
});
```

Example images ©
----------------

  * Ben Fredericson (http://www.flickr.com/photos/xjrlokix/7670504246/sizes/m/in/photostream/, http://www.flickr.com/photos/xjrlokix/7670507852/sizes/m/in/photostream/)
  * Major Clanger (http://www.flickr.com/photos/major_clanger/4850772/sizes/m/in/photostream/)
