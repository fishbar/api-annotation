/*!
 * api-annotation: test/index.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-10-19 01:33:37
 * CopyRight 2015 (c) Fish And Other Contributors
 */
var testMod = require('../index');
var expect = require('expect.js');
var path = require('path');
var fs = require('fs');

describe('index.js', function () {
  after(function () {
    fs.unlinkSync(path.join(__dirname, './auto_router.js'));
  });
  describe('index.resolvePath()', function () {
    it('should work fine', function () {
      var result;
      result = testMod.resolvePath('/a/b/c', '/a/d/e');
      expect(result).to.be('../../d/e');
      result = testMod.resolvePath('/a', '/e');
      expect(result).to.be('./e');
    });
  });
  describe('index.processDir()', function () {
    var mockRouter = {
      _cache: {}
    };
    mockRouter.get = mockRouter.post =
      mockRouter.delete = mockRouter.put =
      mockRouter.patch = function (path, fn) {
        this._cache[path] = fn;
      };
    it('should work fine', function () {
      var rfile = path.join(__dirname, 'auto_router.js');
      testMod.processDir(path.join(__dirname, 'fixtures/syntax'), {
        routerFile: rfile
      }, function (err, result) {
        expect(err).to.be(null);
        require(rfile)(mockRouter);
        // expect(result.router['./fixtures/syntax/case_001.js']).to.be.an.Array;
      });
    });
    it('should work fine while some of the api annotation error', function () {
      var rfile = path.join(__dirname, 'auto_router.js');
      testMod.processDir(path.join(__dirname, './mock'), {
        routerFile: rfile
      }, function (err, result) {
        expect(err.length).to.be(1);
        expect(err[0].message).to.match(/http method not allowed/);
        expect(err[0].file).to.be('./mock/ctrl1.js');
        expect(err[0].message).to.match(/http method not allowed: unknow/);
        require(rfile)(mockRouter);
        // expect(result.router['./fixtures/syntax/case_001.js']).to.be.an.Array;
      });
    });
  });

});
