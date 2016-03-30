/*!
 * api-annotation: lib/api.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-11-25 14:59:19
 * CopyRight 2015 (c) Fish And Other Contributors
 */
/**
 * gen api.json
 */
var fs = require('xfs');
var doc = require('./doc');
var path = require('path');

exports.genApiList = function (result, options, callback) {
  var files = Object.keys(result);
  var base = options.base;
  var finalResult = [];
  base = /\/$/.test(base) ? base : base + '/';
  files.forEach(function (fname) {
    var eachFile = result[fname];
    eachFile.forEach(function (each) {
      doc.processApiName(each, base);
      var docInfo = each.docInfo;
      var name = docInfo.name;
      var type;
      if (docInfo.private && docInfo.private.value) {
        type = 'private';
      } else if (docInfo.internal && docInfo.internal.value) {
        type = 'internal';
      } else {
        type = 'public';
      }
      if (type === 'private' && !options.keepAll) {
        return ;
      }
      finalResult.push({
        name: name.value,
        method: docInfo.api.methods.join(','),
        url: docInfo.api.url,
        type:  type
      });
    });
  });
  // finalResult.sort
  if (options.apiListPath) {
    fs.sync().save(
      path.join(
        options.apiListPath,
        'api_list' + (options.version ? '_' + options.version : '') + '.json'
      ),
      JSON.stringify(finalResult)
    );
  }
  return finalResult;
};
