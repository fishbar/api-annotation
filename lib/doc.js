/*!
 * api-annotation: lib/doc.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-11-23 18:16:42
 * CopyRight 2015 (c) Fish And Other Contributors
 */
var path = require('path');
var xfs = require('xfs');

function UpcaseFistLetter(str) {
  var first = str[0];
  return first.toUpperCase() + str.substr(1);
}

function dashToCam(str) {
  var tmp = str.split(/_/g);
  tmp.forEach(function (v, i, a) {
    a[i] = UpcaseFistLetter(v);
  });
  return tmp.join('.');
}
/**
 * fill apiname if not given
 */
function processApiName(node, base) {
  if (node.docInfo.name) {
    return;
  }
  var file = node.file;
  var rest = file.substr(base.length).replace(/\.\w+$/, '');
  var tmp = rest.split(/\//);
  tmp.forEach(function (n, i, a) {
    a[i] = dashToCam(n);
  });
  tmp.push(node.exportsFn);
  node.docInfo.name = {
    token: 'name',
    value: tmp.join('.')
  };
}

exports.processApiName = processApiName;
/**
 * [genDocument description]
 * @param  {[type]}   result   [description]
 * @param  {Object}   options
 *         - base {String} controller dir
 *         - docPath {String} output doc dir
 *         - version {String}
 *         - hook {Function} (doc)
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.genDocument = function (result, options, callback) {
  // console.log(JSON.stringify(result, null, 4));
  var files = Object.keys(result);
  var base = options.base;
  var finalResult = [];
  base = /\/$/.test(base) ? base : base + '/';
  files.forEach(function (fname) {
    var eachFile = result[fname];
    eachFile.forEach(function (each) {
      processApiName(each, base);
      options.hook && options.hook(each.docInfo);
      finalResult.push(each.docInfo);
    });
  });
  var docPath = options.docPath;
  var version = options.version || '1.0.0';
  var versions;
  try {
    versions = xfs.readFileSync(path.join(docPath, './version.json'));
    versions = JSON.parse(versions);
    if (typeof versions !== 'object') {
      versions = {};
    }
  } catch (e) {
    versions = {};
  }
  versions[version] = true;

  xfs.sync().save(path.join(docPath, './version.json'), JSON.stringify(versions));
  xfs.sync().save(path.join(docPath, './api_doc_' + version + '.json'), JSON.stringify(finalResult));
  xfs.sync().save(
    path.join(docPath, './index.html'),
    xfs.readFileSync(path.join(__dirname, '../assets/index.html'))
  );
  xfs.sync().save(
    path.join(docPath, './jquery-2.1.4.min.js'),
    xfs.readFileSync(path.join(__dirname, '../assets/jquery-2.1.4.min.js'))
  );
  xfs.sync().save(
    path.join(docPath, './ejs.min.js'),
    xfs.readFileSync(path.join(__dirname, '../assets/ejs.min.js'))
  );
  xfs.sync().save(
    path.join(docPath, './style.css'),
    xfs.readFileSync(path.join(__dirname, '../assets/style.css'))
  );
  xfs.sync().save(
    path.join(docPath, './apidoc.js'),
    xfs.readFileSync(path.join(__dirname, '../assets/apidoc.js'))
  );

  callback(null, finalResult);
};
