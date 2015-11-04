/*!
 * api-annotation: index.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-10-19 01:33:37
 * CopyRight 2015 (c) Fish And Other Contributors
 */
var fs = require('fs');
var path = require('path');
var parser = require('./lib/parser');
/**
 * 编译整个目录的文件
 * @param  {String}   fdir    fdir
 * @param  {Object}   options  {routerFile, docFile}
 * @param  {Function} callback
 */
function processDir(fdir, options, callback, ifsub) {
  var files = fs.readdirSync(fdir);
  var errors = [];
  var result = {};
  files.forEach(function (file) {
    var tmp = path.join(fdir, file);
    var stat = fs.statSync(tmp);
    if (stat.isDirectory()) {
      processDir(tmp, options, function (errs, res) {
        if (errs && errs.length) {
          errors = errors.concat(errs);
        }
        res && Object.keys(res).forEach(function (f) {
          result[f] = res[f];
        });
      }, true);
    } else {
      if (!/\.js$/.test(tmp)) {
        return;
      }
      processFile(tmp, options, function (err, res) {
        if (err) {
          errors = errors.concat(err);
        }
        res && Object.keys(res).forEach(function (f) {
          result[f] = res[f];
        });
      });
    }
  });
  if (ifsub) {
    return callback(errors.length ? errors : null, result);
  }
  var routerFile = genRouterFile(result, options.routerFile);
  // genDocFile();
  callback(errors.length ? errors : null, {
    router: routerFile,
    doc: ''
  });
};

/**
 * 编译单个文件
 */
function processFile(file, options, callback) {
  var code = fs.readFileSync(file).toString();
  var routerFile = options.routerFile;
  var relPath = file;
  if (routerFile) {
    relPath = resolvePath(routerFile, file);
  }
  parser.parse(code, relPath, callback);
};

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

function genRouterFile(result, savePath) {
  var requires = [];
  var routers = [];
  var files = Object.keys(result);
  files.forEach(function (file) {
    requires.push('"' + file + '": require("' + file + '")');
    var tmp = result[file];
    tmp.forEach(function (api) {
      var exportsFn = api.exportsFn;
      var apiPath = api.docInfo.api.url;
      var methods = api.docInfo.api.methods;
      if (!apiPath) {
        return;
      }
      methods.forEach(function (method) {
        routers.push(
          'router.' + method + '("' + apiPath + '", ' +
          'ctrls["' + file + '"].' + exportsFn + ');'
        );
      });
    });
  });
  var routerFileCnt = ['// do not modify this file, genaratered by api-annotation'];
  routerFileCnt.push('var ctrls = {');
  routerFileCnt.push(requires.join(',\n'));
  routerFileCnt.push('};');
  routerFileCnt.push('module.exports = function (router) {\n');
  routerFileCnt.push(routers.join('\n'));
  routerFileCnt.push('\n};\n');
  var routerFile = routerFileCnt.join('\n');

  if (savePath) {
    fs.writeFileSync(savePath, routerFile);
  }
  return routerFile;
}

exports.resolvePath = resolvePath;
exports.processDir = processDir;
exports.processFile = processFile;
