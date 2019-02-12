/*!
 * api-annotation: lib/router.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-11-23 18:16:42
 * CopyRight 2015 (c) Fish And Other Contributors
 */
'use strict';
const fs = require('fs');
const path = require('path');
/*
abc.test
def.require

c/a/def
c/d/require
 */
function resolvePath(targetFile, requireFile) {
  targetFile = targetFile.split(path.sep);
  requireFile = requireFile.split(path.sep);

  var len = Math.min(targetFile.length, requireFile.length);
  var i;
  for (i = 0; i < len; i++) {
    if (targetFile[i] !== requireFile[i]) {
      break;
    }
  }
  targetFile.splice(0, i);
  targetFile.pop();
  requireFile.splice(0, i);

  var relPath = [];
  if (targetFile.length) {
    for (i = 0; i < targetFile.length; i++) {
      relPath.push('../');
    }
  } else {
    relPath = ['./'];
  }
  relPath.push(requireFile.join('/'));
  return relPath.join('');
}

function defaultTpl(data) {
  let tpl =
`/** do not modify this file, genaratered by api-annotation **/
'use strict';

/*
function process(fn, type, wrap, config) {
  if (type === 'public') {
    return fn;
  }
  if (wrap) {
    return function (req, callback) {
      fn(req, callback);
    };
  } else {
    return function (req, res, next) {
      fn(req, res, next);
    };
  }
}
*/
function defaultProcess(fn, type, wraped) {
  return fn;
}
const ctrls = {
${data.requires}
};
var config = {};

module.exports = function (router, process) {
  if (!process) {
    process = defaultProcess;
  }
${data.routers}
};
`;

  return tpl;
}

exports.resolvePath = resolvePath;

/**
 * generate router content
 * @param {Object} result   annotation parse result
 * @param {Object} options
 *        tpl
 *        routerFile
 *
 * @return {String} the result router file content
 */
exports.genRouter = function genRouter(data, options) {
  var result = data.result;
  var rPath = options.routerFile;
  var requires = [];
  var routers = [];
  var routersMap = {};
  var files = Object.keys(result);
  if (!options.tpl) {
    options.tpl = defaultTpl;
  }
  files.forEach(function (absFile) {
    var file = resolvePath(rPath, absFile);
    requires.push('  \'' + file + '\': require(\'' + file + '\')');
    var tmp = result[absFile];
    tmp.forEach(function (api) {
      let exportsFn = api.exportsFn;
      let apiPath = api.docInfo.api.url;
      let methods = api.docInfo.api.methods;
      let security;
      let wrap = true;

      if (api.docInfo.nowrap) {
        wrap = false;
      }

      if (api.docInfo.private) {
        security = 'private';
      } else if (api.docInfo.internal) {
        security = 'internal';
      } else {
        security = 'public';
      }
      if (!apiPath) {
        return;
      }
      methods.forEach(function (method) {
        routersMap[apiPath + '_' + method] = `  ${api.docInfo.disable ? '//@disabled ' : ''}router.${method}('${apiPath}', process(ctrls['${file}']${exportsFn ? '.' + exportsFn : ''}, '${security}', ${wrap}), ${wrap});`;
      });
    });
  });

  let sortedRouters = Object.keys(routersMap).sort((a, b) => {
    if (a > b) {
      return -1;
    } else if (a < b) {
      return 1;
    } else {
      return 0;
    }
  });

  sortedRouters.forEach((r) => {
    routers.push(routersMap[r]);
  });

  let routerFileContent = options.tpl({
    requires: requires.join(',\n'),
    routers: routers.join('\n')
  });

  if (rPath) {
    fs.writeFileSync(rPath, routerFileContent);
  }
  return routerFileContent;
};
