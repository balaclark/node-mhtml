
var should = require('should');
var fs = require('fs-extra');
var mhtml = require(__dirname + '/../mhtml');

var sources = __dirname + '/examples/';
var tmpdir = __dirname + '/tmp/';

beforeEach(function (done) {
  fs.mkdirs(tmpdir, done);
});

afterEach(function (done) {
  fs.remove(tmpdir, done);
});

describe('Extraction', function () {

  it('should extract a single file', function (done) {
    mhtml.extract(sources + 'example1.mhtml', tmpdir, function (err) {
      var extracted = fs.readdirSync(tmpdir);
      extracted.should.eql(['bench.jpg','example.css','example.html','example.jpg','flower.jpg','good-example.jpg']);
      done();
    });
  });

  it('should create any non-existing output folders', function (done) {
    mhtml.extract(sources + 'example1.mhtml', tmpdir + 'one/two/three', function (err) {
      var basedir = fs.readdirSync(tmpdir);
      var outputdir = fs.readdirSync(tmpdir + 'one/two/three');
      basedir.should.eql(['one']);
      outputdir.should.eql(['bench.jpg','example.css','example.html','example.jpg','flower.jpg','good-example.jpg']);
      done();
    });
  });

  it('should leave any other files in the output folder alone', function (done) {

    fs.copySync(sources + 'foo.txt', tmpdir + 'foo.txt');

    mhtml.extract(sources + 'example1.mhtml', tmpdir, function (err) {
      var extracted = fs.readdirSync(tmpdir);
      extracted.should.eql(['bench.jpg','example.css','example.html','example.jpg','flower.jpg','foo.txt','good-example.jpg']);
      done();
    });
  });

  it('should clean up the output folder when the "force" option is passed', function (done) {

    fs.copySync(sources + 'foo.txt', tmpdir + 'foo.txt');

    mhtml.extract(sources + 'example1.mhtml', tmpdir, function (err) {
      var extracted = fs.readdirSync(tmpdir);
      extracted.should.eql(['bench.jpg','example.css','example.html','example.jpg','flower.jpg','good-example.jpg']);
      done();
    }, true);
  });
});

describe('Errors', function () {

  it('should complain if an invalid file is given', function (done) {
    mhtml.extract(sources + 'foo.txt', tmpdir, function (err) {
      err.should.be.and.instanceOf(Error).and.have.property('message', 'Invalid MHTML file');
      fs.readdirSync(tmpdir).should.be.empty;
      done();
    })
  });
});
