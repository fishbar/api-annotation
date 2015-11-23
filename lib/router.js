/*!
 * api-annotation: lib/router.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-11-23 18:16:42
 * CopyRight 2015 (c) Fish And Other Contributors
 */
'use strict';
var fs = require('fs');
var path = require('path');
/*
abc.test
def.require

c/a/def
c/d/require
 */
function resolvePath(targetFile, requireFile) {
  targetFile = targetFile.split(/\/|\\/g);
  requireFile = requireFile.split(/\/|\\/g);

  var len = Math.min(targetFile.length, requireFile.length)
  var i;
  for (i = 0; i < len; i++) {
    if (targetFile[i] !== requireFile[i]) {
      break;
    }
  }
  targetFile.splice(0, i)
  targetFile.pop();
  requireFile.splice(0, i);

  var relPath = [];
  if (targetFile.length) {
    for (i = 0; i <= targetFile.length; i++) {
      relPath.push('../');
    }
  } else {
    relPath = ['./'];
  }
  relPath.push(requireFile.join('/'));
  return relPath.join('');
}

/**
 * generate router content
 * @param  {String} routerPath file path
 * @param  {Object} result   annotation parse result
 * @return {String} the result router file content
 */
exports.genRouter = function genRouter(result, options) {
  var rPath = options.routerFile;
  var requires = [];
  var routers = [];
  var files = Object.keys(result);
  files.forEach(function (absFile) {
    var file = resolvePath(rPath, absFile);
    requires.push('  \'' + file + '\': require(\'' + file + '\')');
    var tmp = result[absFile];
    tmp.forEach(function (api) {
      var exportsFn = api.exportsFn;
      var apiPath = api.docInfo.api.url;
      var methods = api.docInfo.api.methods;
      if (!apiPath) {
        return;
      }
      methods.forEach(function (method) {
        routers.push(
          '  router.' + method + '(\'' + apiPath + '\', ' +
          '  ctrls[\'' + file + '\'].' + exportsFn + ');'
        );
      });
    });
  });
  var routerFileCnt = ['\'use strict\';\n', '// do not modify this file, genaratered by api-annotation'];
  routerFileCnt.push('var ctrls = {');
  routerFileCnt.push(requires.join(',\n'));
  routerFileCnt.push('};\n');
  routerFileCnt.push('module.exports = function (router) {');
  routerFileCnt.push(routers.join('\n'));
  routerFileCnt.push('};\n');
  var routerFile = routerFileCnt.join('\n');

  if (rPath) {
    fs.writeFileSync(rPath, routerFile);
  }
  return routerFile;
};
