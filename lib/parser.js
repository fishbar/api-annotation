/*!
 * api-annotation: lib/parser.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-10-19 01:33:37
 * CopyRight 2015 (c) Fish And Other Contributors
 */
'use strict';
const esprima = require('esprima');
// var estraverse = require('estraverse');
// var escope = require('escope');
const debug = require('debug')('api-annotation');

const commentParser = require('./comment_parser');
const sectionParser = require('./section_parser');

const syntax = esprima.Syntax;
/**
 * parse code
 * @param  {String} code     [string]
 * @param  {String} fileName [optional]
 * @return {Object} parsed object
 */
exports.parse = function (code, fileName, callback) {
  var ast;
  try {
    ast = esprima.parse(code, {
      comment: true,
      attachComment: true,
      loc: true
    });
  } catch (e) {
    e.file = fileName;
    e.message += ' file:' + fileName;
    return callback(e);
  }

  // var scope = escope.analyze(ast);
  // var globalScope = scope.acquire(ast);

  if (!ast.body.length) {
    return [];
  }
  var result = [];
  var errors = [];
  ast.body.forEach(function (node) {
    // check if has leading comments
    if (!node.leadingComments || !node.leadingComments.length) {
      return;
    }
    let doc;
    let offsetLine;
    let flag = false;
    node.leadingComments.forEach(function (n) {
      if (n.type !== 'Block') {
        return;
      }
      if (/@api\s/.test(n.value)) {
        offsetLine = n.loc.start.line;
        doc = trimLeadingAsterisk(n.value);

        if (node.type !== syntax.ExpressionStatement) {
          return;
        }
        var expression = node.expression;
        if (expression.type !== syntax.AssignmentExpression) {
          return;
        }
        if (expression.left.type !== syntax.MemberExpression) {
          return;
        }
        var left = expression.left;
        if (left.object.type === syntax.MemberExpression) {
          if (left.object.object.name !== 'module' || left.object.property.name !== 'exports') {
            return;
          }
        } else if (left.object.name !== 'exports') {
          return;
        }

        var exportFn;
        if (left.property.type === syntax.Literal) {
          exportFn = left.property.value;
        } else if (left.property.type === syntax.Identifier) {
          exportFn = left.property.name;
        }

        var docInfo;
        try {
          docInfo = parseComment(doc, offsetLine);
        } catch (e) {
          e.doc = doc;
          e.file = fileName;
          if (e.name === 'SyntaxError') {
            e.line = e.location.start.line;
            e.column = e.location.start.column;
          }
          errors.push(e);
          return;
        }
        result.push({
          file: fileName,
          exportsFn: exportFn,
          // docSrc: doc,
          docInfo: docInfo
        });
      }
    });
  });
  var finalResult = {};

  result.forEach(function (n) {
    if (!finalResult[n.file]) {
      finalResult[n.file] = [];
    }
    finalResult[n.file].push(n);
  });
  callback(errors.length ? errors : null, finalResult);
};

/**
 * 分析带@api 注释的节点，找出其全局引用，以备导出
 * @param  {[type]} node [description]
 * @return {[type]}      [description]
 */
function processNode(node) {
  if (node.type !== 'ExpressionStatement') {
    return;
  }
  var expression = node.expression;
  if (expression.type !== 'AssignmentExpression') {
    return;
  }
  if (expression.operator !== '=') {
    return null;
  }
  var left = node.left;
  if (left.type !== 'MemberExpression') {
    return null;
  }
  var obj = left.object;
  var prop = left.property;
}

/**
 * 注释内容解析
 * @param  {String} comment
 *
 * @return
 *  {
 *    api: 'api path',
 *    method: ['get', 'post'],
 *    params: [],
 *    query: {},
 *    body: {},
 *    success: [{}],
 *    failure: [{}]
 *  }
 */
function parseComment(comment, offsetLine) {
  var prefix = [];
  if (offsetLine) {
    for (var i = 1; i < offsetLine; i++) {
      prefix.push('\n');
    }
  }
  comment = prefix.join('') + comment;
  var result;
  var finalResult = {};
  result = commentParser.parse(comment);
  result.forEach(function (node) {
    var token = node.token;
    var tmp;
    if (sectionParser[token]) {
      node.value = sectionParser[token](node.value);
    }
    switch (token) {
      case 'success':
      case 'failure':
      case 'example':
        if (!finalResult[token]) {
          finalResult[token] = [];
        }
        tmp = finalResult[token];
        tmp.push(node);
        break;
      default:
        finalResult[token] = node;
    }
  });
  return finalResult;
}
/** 去除开头星号 */
function trimLeadingAsterisk(comment) {
  var lines = comment.split('\n');
  lines.forEach(function (line, i, a) {
    a[i] = line.replace(/^\s*\* ?/, '');
  });
  return lines.join('\n');
}

/**
 * test code
 */

// exports.parse('/*@api abc */exports.hello=function(){}', 'test.js', function (err, result) {
//  console.log(JSON.stringify(result));
// });
