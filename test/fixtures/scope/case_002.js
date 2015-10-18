/*!
 * api-annotation: test/fixtures/scope/case_002.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-10-19 01:33:37
 * CopyRight 2015 (c) Fish And Other Contributors
 */
/**
 * 常规注解， module.exports导出整个对象的情况，在对象申明上注解
 */

module.exports = {
  /**
   * @api {get} /api/hello
   */
  hello: function () {

  }
};
