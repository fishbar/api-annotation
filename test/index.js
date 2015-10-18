/*!
 * api-annotation: test/index.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-10-19 01:33:37
 * CopyRight 2015 (c) Fish And Other Contributors
 */
var testMod = require('../index');
var expect = require('expect.js');
var path = require('path');

describe('index.js', function () {

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
    it('should work fine', function () {
      testMod.processDir(path.join(__dirname, 'fixtures/syntax'), {
        routerFile: __dirname
      }, function (err, result) {
        expect(err).to.be(null);
        expect(result['./fixtures/syntax/case_001.js']).to.be.an.Array;
      });
    });
  });

});
