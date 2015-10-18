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
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function processDir(fdir, options, callback) {
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
        Object.keys(res).forEach(function (f) {
          result[f] = res[f];
        });
      });
    } else {
      if (!/\.js$/.test(tmp)) {
        return;
      }
      processFile(tmp, options, function (err, res) {
        if (err) {
          errors.push(err);
        }
        Object.keys(res).forEach(function (f) {
          result[f] = res[f];
        });
      });
    }
  });
  callback(errors.length ? errors : null, result);
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

exports.resolvePath = resolvePath;
exports.processDir = processDir;
exports.processFile = processFile;
