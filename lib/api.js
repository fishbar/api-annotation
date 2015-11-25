/*!
 * api-annotation: lib/api.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-11-25 14:59:19
 * CopyRight 2015 (c) Fish And Other Contributors
 */
/**
 * gen api.json
 */
var fs = require('fs');
var doc = require('./doc');

exports.genApiList = function (result, options, callback) {
  var files = Object.keys(result);
  var base = options.base;
  var finalResult = [];
  base = /\/$/.test(base) ? base : base + '/';
  files.forEach(function (fname) {
    var eachFile = result[fname];
    eachFile.forEach(function (each) {
      doc.processApiName(each, base);
      var name = each.docInfo.name;
      finalResult.push({
        name: name,
        method: each.docInfo.api.methods.join(','),
        url: each.docInfo.api.url
      });
    });
  });
  // finalResult.sort
  if (options.apiListPath) {
    fs.writeFileSync(options.apiListPath, JSON.stringify(finalResult));
  }
  return finalResult;
};
