/*!
 * api-annotation: test/fixtures/scope/case_003.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-10-19 01:33:37
 * CopyRight 2015 (c) Fish And Other Contributors
 */
/**
 * 非常规注解, module.exports 为一个类实例
 */

function Hello() {

}

Hello.prototype = {
  /**
   * @api {get} /hello
   */
  hello: function () {

  }
};

module.exports = function () {
  return new Hello();
};
