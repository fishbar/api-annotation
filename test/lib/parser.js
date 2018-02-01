/*!
 * api-annotation: test/lib/parser.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-10-19 01:33:37
 * CopyRight 2015 (c) Fish And Other Contributors
 */
var fs = require('fs');
var path = require('path');
var testMod = require('../../lib/parser');
var expect = require('expect.js');

describe('lib/parser', function () {
  describe('#parse()', function () {
    var dirs = fs.readdirSync(path.join(__dirname, '../fixtures'));
    dirs.forEach(function (category) {
      // if (category !== 'syntax') return;
      var list = fs.readdirSync(path.join(__dirname, '../fixtures', category));
      list.sort();
      list.forEach(function (file) {
        if (/\.json/.test(file)) {
          return;
        }
        var caseFile = path.join(__dirname, '../fixtures', category, file);
        var resultJson = caseFile.replace(/\.js$/, '.json');
        it('case ' + category + '/' + file + ' should work fine', function (done) {
          var caseCode = fs.readFileSync(caseFile).toString();
          testMod.parse(caseCode, category + '/' + file, function (err, result) {
            expect(err).to.be(null);
            expect(result).eql(require(resultJson));
            done();
          });
        });
      });
    });

    it('should get error when parser syntax error', function (done) {
      var caseCode = `
        /**
         * @api {post /test
         */
        exports.test = function () {};
      `;
      testMod.parse(caseCode, '/test.js', function (err, result) {
        if(err){
          expect(err.length).to.be(1);
          expect(err[0].name).to.be('SyntaxError');
          expect(err[0].file).to.be('/test.js');
          expect(err[0].line).to.be(3);
          expect(err[0].column).to.be(12);
        }
        
        done();
      });
    });

    it('should get error when parser custom error', function (done) {
      var caseCode = `
        /**
         * @api {pos} /test
         */
        exports.test = function () {};
      `;
      testMod.parse(caseCode, '/test.js', function (err, result) {
        expect(err.length).to.be(1);
        expect(err[0].name).to.be('SyntaxError');
        expect(err[0].file).to.be('/test.js');
        expect(err[0].line).to.be(3);
        expect(err[0].column).to.be(6);
        done();
      });
    });

    it('shoud work fine', function (done) {
      var caseCode = `
/**
 * @api {get} /api/test
 * @desc
 *   hahaha
 * @private
 */
exports.test = function() {}
      `;
      testMod.parse(caseCode, '/test_001.js', function (err, result) {
        expect(err).to.be(null);
        var apis = result['/test_001.js'];
        expect(apis.length).to.be(1);
        expect(apis[0].docInfo.private.value).to.be(true);
        expect(apis[0].docInfo.desc.value.trim()).to.be('hahaha');
        done();
      });
    });
  });

});
