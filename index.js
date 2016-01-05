/*!
 * api-annotation: index.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-10-19 01:33:37
 * CopyRight 2015 (c) Fish And Other Contributors
 */
var fs = require('fs');
var path = require('path');
var parser = require('./lib/parser');
var router = require('./lib/router');
var doc = require('./lib/doc');
var api = require('./lib/api');
/**
 * 编译整个目录的文件
 * @param  {String}   fdir    fdir
 * @param  {Object}   options  {routerFile, docFile}
 * @param  {Function} callback
 */
function processDir(fdir, callback, ifsub) {
  var files = fs.readdirSync(fdir);
  var errors = [];
  var result = {};
  files.forEach(function (file) {
    var tmp = path.join(fdir, file);
    var stat = fs.statSync(tmp);
    if (stat.isDirectory()) {
      processDir(tmp, function (errs, res) {
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
      processFile(tmp, function (err, res) {
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
  // genDocFile();
  callback(errors.length ? errors : null, result);
};

/**
 * 编译单个文件
 */
function processFile(file, callback) {
  var code = fs.readFileSync(file).toString();
  var relPath = file;
  parser.parse(code, relPath, callback);
};

/**
 * 传入控制器路径，解析出API的信息
 * @param  {String}   fpath   文件路径
 * @param  {Function} callback(err, result)
 */
function process(fpath, callback) {
  var stat;
  try {
    stat = fs.statSync(fpath);
  } catch (e) {
    throw new Error('api-annotation try to read path error:' + fpath);
  }
  if (stat.isDirectory()) {
    processDir(fpath, callback);
  } else {
    processFile(fpath, callback);
  }
}

exports.process = process;

/**
 * generate Router file
 * @param  {String|Object}   ctrlPath or process result
 * @param  {Object}   options
 *                       routerFile
 *                       version
 * @param  {Function} callback(err, routerContent)
 */
exports.genRouter = function (ctrlPath, options, callback) {
  var rContent;
  if (typeof ctrlPath === 'object') {
    rContent = router.genRouter(ctrlPath, options, callback);
    callback(null, rContent);
  } else {
    process(ctrlPath, function (err, result) {
      if (err) {
        return callback(err);
      }
      rContent = router.genRouter(result, options, callback);
      callback(null, rContent);
    });
  }
};

/**
 * generate Document
 * @param  {String|Object}   ctrlPath  ctrlPath or process result
 * @param  {Object}   options
 *                       docPath    output doc path
 *                       base       ctrlpath
 *                       version    api version
 *                       hook       api hooks, adjust doc content
 * @param  {Function} callback(err, docObject)
 */
exports.genDocument = function (ctrlPath, options, callback) {
  if (typeof ctrlPath === 'object') {
    if (!options.base) {
      throw new Error('genDocument should set options.base options');
    }
    doc.genDocument(ctrlPath, options, callback);
  } else {
    process(ctrlPath, function (err, result) {
      options.base = ctrlPath;
      doc.genDocument(result, options, callback);
    });
  }
};
/**
 * generate ApiList json
 * @param  {String|Object}   ctrlPath
 * @param  {Object}   options
 *                       apiListPath {String}
 *                       version {String}
 * @param  {Function} callback(err, apiList)
 */
exports.genApiList = function (ctrlPath, options, callback) {
  if (typeof ctrlPath === 'object') {
    if (!options.apiListPath) {
      throw new Error('genDocument should set options.base options');
    }
    var result = api.genApiList(ctrlPath, options);
    callback(null, result);
  } else {
    process(ctrlPath, function (err, result) {
      var result = api.genApiList(result, options);
      callback(null, result);
    });
  }
}
