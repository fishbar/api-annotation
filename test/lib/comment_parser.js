/*!
 * api-annotation: test/lib/comment_parser.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-10-19 01:33:37
 * CopyRight 2015 (c) Fish And Other Contributors
 */
var testMod = require('../../lib/comment_parser');
var expect = require('expect.js');

describe('lib/comment_parser', function () {

  describe('commentParser.parse', function () {

    it('should work fine with all tokens', function () {
      var str = `
        @api /test
        @name
        @json
        @desc
        @params
        @body
        @query
        @success
        @failure
      `;
      var result = testMod.parse(str);
      expect(result.length).to.be(9);
    });

    it('should work fine with all tokens and empty lines', function () {
      var str = `
        @api test ` + `

        @name
                  ` + `

        @json
                  ` + `
        @desc
                  ` + `
        @params
                  ` + `
        @body
                  ` + `
        @query
                  ` + `
        @success
                  ` + `
        @failure
                  `;
      var result = testMod.parse(str);
      expect(result.length).to.be(9);
    });
  });

  describe('token @api', function () {
    it('should work fine with full syntax', function () {
      var str = `
        @api {get} /api/test
      `;
      var result = testMod.parse(str);
      expect(result.length).to.be(1);
      expect(result[0].token).to.be('api');
      expect(result[0].methods).to.eql(['get']);
      expect(result[0].url).to.be('/api/test');
    });

    it('should work fine without methods, using default [get]', function () {
      var str = `
        @api /api/test
      `;
      var result = testMod.parse(str);
      expect(result.length).to.be(1);
      expect(result[0].token).to.be('api');
      expect(result[0].methods).to.eql(['get']);
      expect(result[0].url).to.be('/api/test');
    });

    it('should throw error without url', function () {
      var str = `
        @api {post}
      `;
      expect(function () {
        testMod.parse(str);
      }).to.throwException(function (e) {
        expect(e.name).to.be('SyntaxError');
        expect(e.message).to.match(/api url missing/);
      });
    });
  });

  describe('token @name', function () {
    it('should work fine', function () {
      var str = `
        @name test
        @name test.abc
        @name
      `;
      var result = testMod.parse(str);
      expect(result.length).to.be(3);
      expect(result[0].token).to.be('name');
      expect(result[0].value).to.be('test');
      expect(result[1].value).to.be('test.abc');
      expect(result[2].value).to.be('');
    });
  });

  describe('token @desc', function () {
    it('should work fine', function () {
      var str = `
        @desc test
        @description test.abc@test
        @a
        @@
        @
        @desc
      `;
      var result = testMod.parse(str);
      expect(result.length).to.be(3);
      expect(result[1].token).to.be('desc');
      expect(result[0].value.trim()).to.be('test');
      expect(result[1].value.trim()).to.match(/@@/);
      expect(result[2].value.trim()).to.be('');
    });
  });

  describe('token @params', function () {
    it('should work fine', function () {
      var str = `
        @params test
        @params
      `;
      var result = testMod.parse(str);
      expect(result.length).to.be(2);
      expect(result[0].token).to.be('params');
      expect(result[0].desc.trim()).to.be('test');
      expect(result[1].value.trim()).to.be('');
    });
  });

  describe('token @query', function () {
    it('should work fine', function () {
      var str = `
        @query test
        @query
      `;
      var result = testMod.parse(str);
      expect(result.length).to.be(2);
      expect(result[0].token).to.be('query');
      expect(result[0].desc.trim()).to.be('test');
      expect(result[1].value.trim()).to.be('');
    });
  });

  describe('token @body', function () {
    it('should work fine', function () {
      var str = `
        @body:json test
        @body
      `;
      var result = testMod.parse(str);
      expect(result.length).to.be(2);
      expect(result[0].token).to.be('body');
      expect(result[0].type).to.be('json');
      expect(result[0].desc.trim()).to.be('test');
      expect(result[1].value.trim()).to.be('');
    });
  });

  describe('token @json', function () {
    it('should work fine', function () {
      var str = `
        @json
        @json asdfasd
        @json @@@
      `;
      var result = testMod.parse(str);
      expect(result.length).to.be(3);
      expect(result[0].token).to.be('json');
      expect(result[0].value).to.be(true);
      expect(result[1].value).to.be(true);
      expect(result[2].value).to.be(true);
    });
  });

  describe('token @success', function () {
    it('should work fine', function () {
      var str = `
        @success:json test
        @success
        @@
        @
        @success
      `;
      var result = testMod.parse(str);
      expect(result.length).to.be(3);
      expect(result[0].token).to.be('success');
      expect(result[0].type).to.be('json');
      expect(result[0].value.trim()).to.be('test');
      expect(result[1].value.trim()).to.match(/@@/);
      expect(result[2].value.trim()).to.be('');
    });
  });

  describe('token @failure', function () {
    it('should work fine', function () {
      var str = `
        @failure:xml test
        @failure
        @@
        @
        @failure
      `;
      var result = testMod.parse(str);
      expect(result.length).to.be(3);
      expect(result[0].token).to.be('failure');
      expect(result[0].type).to.be('xml');
      expect(result[0].value.trim()).to.be('test');
      expect(result[1].value.trim()).to.match(/@@/);
      expect(result[2].value.trim()).to.be('');
    });
    it('should work fine', function () {
      var str = `
        @error:xml test
        @error
        @@
        @
        @error
      `;
      var result = testMod.parse(str);
      expect(result.length).to.be(3);
      expect(result[0].token).to.be('failure');
      expect(result[0].type).to.be('xml');
      expect(result[0].value.trim()).to.be('test');
      expect(result[1].value.trim()).to.match(/@@/);
      expect(result[2].value.trim()).to.be('');
    });
  });
});
