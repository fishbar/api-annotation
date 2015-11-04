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
            expect(result).eql(require(resultJson));
            done();
          });
        });
      });
    });
  });
});
