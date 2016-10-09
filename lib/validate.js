/*!
 * api-annotation: lib/api.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-11-25 14:59:19
 * CopyRight 2015 (c) Fish And Other Contributors
 */
'use strict';
/**
 * gen api.json
 */
var fs = require('xfs');
var doc = require('./doc');
var path = require('path');

/**
 * validate api
 * @param  {Object}   result   [description]
 * @param  {Object}   options
 *         camel {Boolean}
 *         snake {Boolean} default
 * @param  {Function} callback(errs)
 */
exports.validateApi = function (result, options, callback) {
  var files = Object.keys(result);
  var base = options.base;
  base = /\/$/.test(base) ? base : base + '/';
  files.forEach(function (fname) {
    var eachFile = result[fname];
    eachFile.forEach(function (each) {
      var doc = each.docInfo;
      var api = doc.api.url;

      finalResult.push({
        name: name.value,
        method: each.docInfo.api.methods.join(','),
        url: each.docInfo.api.url
      });
    });
  });
  return finalResult;
};
