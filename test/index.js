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
  describe('index.process()', function () {
    it('should work fine', function () {
      testMod.process(path.join(__dirname, 'fixtures/syntax'), function (err, data) {
        expect(err).to.be(null);
        expect(data.result).have.keys([
          path.join(__dirname, './fixtures/syntax/case_001.js'),
          path.join(__dirname, './fixtures/syntax/case_003.js')
        ]);
      });
    });
    it('should work fine while some of the api annotation error', function () {
      var rfile = path.join(__dirname, 'auto_router.js');
      testMod.process(path.join(__dirname, './mock'), function (err, data) {
        expect(err.length).to.be(1);
        expect(err[0].message).to.match(/http method not allowed/);
        expect(err[0].file).to.be(path.join(__dirname, './mock/ctrl1.js'));
        expect(err[0].message).to.match(/http method not allowed: unknow/);

        let ctrl11 = path.join(__dirname, './mock/sub/ctrl11.js');
        let ctrl10 = path.join(__dirname, './mock/sub/ctrl10.js');
        let ctrl0 = path.join(__dirname, './mock/ctrl0.js');
        let ctrl1 = path.join(__dirname, './mock/ctrl1.js');
        let ctrl2 = path.join(__dirname, './mock/ctrl2.js');
        expect(data.result[ctrl0].length).to.eql(1);
        expect(data.result[ctrl1]).to.eql(undefined);
        expect(data.result[ctrl2]).to.eql(undefined);
        expect(data.result[ctrl10].length).to.eql(1);
        expect(data.result[ctrl11].length).to.eql(2);
      });
    });
  });

  describe('index.genRouter()', function () {
    var rfile = path.join(__dirname, 'auto_router.js');
    var mockRouter = {
      cache: {}
    };
    mockRouter.get = function (path, fn) {
      this.cache['get_' + path] = fn;
    };
    mockRouter.post = function (path, fn) {
      this.cache['post_' + path] = fn;
    };
    mockRouter.delete = function (path, fn) {
      this.cache['delete_' + path] = fn;
    }
    mockRouter.put = function (path, fn) {
      this.cache['put_' + path] = fn;
    };
    mockRouter.patch = function (path, fn) {
      this.cache['patch_' + path] = fn;
    };
    mockRouter.option = function (path, fn) {
      this.cache['option_' + path] = fn;
    };
    afterEach(function () {
      try {
        // fs.unlinkSync(rfile);
      } catch (e) {
        // nothing to do
      }
      mockRouter.cache = {};
    });
    it('should work fine', function () {
      var options = {
        routerFile: rfile
      };
      testMod.genRouter(path.join(__dirname, 'fixtures/syntax'), options, function (err, result) {
        expect(err).to.be(null);
        require(rfile)(mockRouter);
        expect(typeof mockRouter.cache['get_/test']).to.be('function');
        expect(typeof mockRouter.cache['post_/test']).to.be('function');
        expect(typeof mockRouter.cache['delete_/test']).to.be('function');
        expect(mockRouter.cache['get_/test_module_exports'].toString()).to.match(/test_module_exports/);
      });
    });
  });

  describe('index.genDocument()', function () {
    var docPath = path.join(__dirname, '../docs_test');
    after(function (done) {
      fs.rm(docPath, done);
      // done();
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

    it('should work fine 2', function () {
      var options = {
        docPath: docPath,
        hook: function (doc) {
          doc.api.url = '/hook';
        }
      };
      testMod.genDocument(path.join(__dirname, 'fixtures/syntax'), options, function (err, doc) {
        expect(err).to.be(null);
        expect(doc.length).to.above(0);
        expect(doc[0]).have.keys([
          'api'
        ]);
        expect(doc[0].api.url).to.be('/hook');
      });
    });
  });

  describe('index.genApiList()', function () {
    var apiPath = path.join(__dirname, 'tmp');
    afterEach(function (done) {
      fs.rm(apiPath, done);
      // done();
    });
    it('should work fine', function () {
      var options = {
        apiListPath: apiPath
      };
      testMod.genApiList(path.join(__dirname, 'fixtures/syntax'), options, function (err, apis) {
        expect(err).to.be(null);
        expect(apis.length).to.above(0);
        expect(apis[0]).have.keys([
          'url', 'method', 'name', 'type'
        ]);
      });
    });
  });
});
