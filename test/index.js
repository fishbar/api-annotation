/*!
 * api-annotation: test/index.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-10-19 01:33:37
 * CopyRight 2015 (c) Fish And Other Contributors
 */
var testMod = require('../index');
var expect = require('expect.js');
var path = require('path');
var fs = require('xfs');

describe('index.js', function () {
  describe.skip('index.resolvePath()', function () {
    it('should work fine', function () {
      var result;
      result = testMod.resolvePath('/a/b/c', '/a/d/e');
      expect(result).to.be('../../d/e');
      result = testMod.resolvePath('/a', '/e');
      expect(result).to.be('./e');
    });
  });
  describe('index.process()', function () {
    it('should work fine', function () {
      testMod.process(path.join(__dirname, 'fixtures/syntax'), function (err, result) {
        expect(err).to.be(null);
        expect(result).have.keys([
          path.join(__dirname, './fixtures/syntax/case_001.js'),
          path.join(__dirname, './fixtures/syntax/case_003.js')
        ]);
      });
    });
    it('should work fine while some of the api annotation error', function () {
      var rfile = path.join(__dirname, 'auto_router.js');
      testMod.process(path.join(__dirname, './mock'), function (err, result) {
        expect(err.length).to.be(1);
        expect(err[0].message).to.match(/http method not allowed/);
        expect(err[0].file).to.be(path.join(__dirname, './mock/ctrl1.js'));
        expect(err[0].message).to.match(/http method not allowed: unknow/);
      });
    });
  });

  describe('index.genRouter()', function () {
    var rfile = path.join(__dirname, 'auto_router.js');
    var mockRouter = {
      cache: {}
    };
    mockRouter.get = mockRouter.post =
      mockRouter.delete = mockRouter.put =
      mockRouter.patch = function (path, fn) {
        this.cache[path] = fn;
      };
    afterEach(function () {
      try {
        fs.unlinkSync(rfile);
      } catch (e) {
        // nothing to do
      }
    });
    it('should work fine', function () {
      var options = {
        routerFile: rfile
      };
      testMod.genRouter(path.join(__dirname, 'fixtures/syntax'), options, function (err, result) {
        expect(err).to.be(null);
        require(rfile)(mockRouter);
      });
    });
  });

  describe('index.genDocument()', function () {
    var docPath = path.join(__dirname, '../docs_test');
    afterEach(function (done) {
      fs.rm(docPath, done);
    });
    it('should work fine', function () {
      var options = {
        docPath: docPath
      };
      testMod.genDocument(path.join(__dirname, 'fixtures/syntax'), options, function (err, doc) {
        expect(err).to.be(null);
        expect(doc.length).to.above(0);
        expect(doc[0]).have.keys([
          'api'
        ]);
      });
    });
  });
});
