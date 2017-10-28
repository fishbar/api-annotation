'use strict';
const expect = require('expect.js');
const testMod = require('../../lib/router.js');

describe('lib/router.js', () => {
  describe('index.resolvePath()', () => {
    it('should work fine', () => {
      var result;
      result = testMod.resolvePath('/a/b/c', '/a/d/e');
      expect(result).to.be('../d/e');
      result = testMod.resolvePath('/a', '/e');
      expect(result).to.be('./e');
    });

    it('should work fine too', () => {
      var result;
      var target = '/Users/jianxun/workspace/api-annotation/test/auto_router_tmp.js';
      var ctrl = '/Users/jianxun/workspace/api-annotation/example/controllers/test.js';
      result = testMod.resolvePath(target, ctrl);
      expect(result).to.be('../example/controllers/test.js');
    });

  });

});