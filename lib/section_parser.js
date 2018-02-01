/*!
 * SectionParser
 * token段解析器, 不同的token, 不同的实现
 */
'use strict';

const markdown = require('marked');
/**
 * parse param line
 * @param  {String} line
 * @return {Object}
 *         name
 *         type
 *         desc
 * @example
 *   id {Number} userId -> {name: 'id', type: 'Number', desc: 'userId'}
 */
function parseLine(line) {
  var indent = line.match(/^\s*/)[0].length;
  line = line.trim().split(/\s+/);
  return {
    name: line[0],
    type: line[1] ? line[1].substr(1, line[1].length - 2) : 'unknow',
    desc: line.slice(2).join(' ') || '',
    indent: indent
  };
}
/**
 * 通用解析器
 * @param  {String} str
 * @return {Object}
 *
 * @example
 *   input:
 *      user
 *        id {Number:10}
 *        name {String:0,10}
 *
 *   output:
 *     [
 *       {
 *         name: user,
 *         type: object,
 *         sub: [
 *           {name: id, type: number},
 *           {name: name, type: string}
 *         ]
 *       }
 */
function commonParse(str) {
  if(typeof str === 'string'){
    var lines = str.split(/\n/g);
    var res = {name: 'root', type: 'object', indent: -1};
    var last;
    var stack = [res];
    lines.forEach(function (line) {
      if (/^\s*$/.test(line)) {
        return;
      }
      var lineInfo = parseLine(line);
      var indent = lineInfo.indent;
      var last = stack.pop();
      while (last.indent >= indent) {
        last = stack.pop();
      }
      if (!last.sub) {
        last.sub = [];
        last.type = 'Object';
      }
      last.sub.push(lineInfo);
      stack.push(last);
      stack.push(lineInfo);
    });
    return res.sub;
  }else{
    return str;
  }
};

function resultParse(str) {
  if (!str) {
    return '';
  }
  if(typeof str === 'string'){
    str = str.trim();
    var result = '';
    if (str[0] === '{' && str[str.length - 1] === '}') {
      try {
        result = (new Function('str', 'return ' + str))(str);
      } catch (e) {
        result = str;
      }
    }
    return result || str;
  }else{
    return str;
  }
}

function mdParse(str) {
  var renderer = new markdown.Renderer();
  renderer.link = function (href, title, text) {
    return '<a>' + text + '</a>';
  };
  str = str.trim();
  str = str.replace(/\`\`\`([\s\S]*?)\`\`\`/g, function (m0, m1) {
    var tmp = m1.trim();
    if (tmp[0] === '{') {
      try {
        tmp = eval('(' + tmp + ')');
        m0 = '```\n' + JSON.stringify(tmp, null, 4) + '\n```';
      } catch (e) {
        // do nothing
      }
    }
    return m0;
  });
  return markdown(str, {
    renderer: renderer
  });
}

/**
 * markdown parse
 */
exports.example = mdParse;

/**
 * token @params content parser
 */
exports.params = commonParse;
exports.query = commonParse;

/**
 * token @body content parser
 */
exports.body = commonParse;

exports.success = resultParse;
exports.failure = resultParse;
