/*!
 * api-annotation: test/fixtures/scope/case_001.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-10-19 01:33:37
 * CopyRight 2015 (c) Fish And Other Contributors
 */
/**
 * 常规case, exports的属性上挂载 api注解
 */

/**
 * @api {get} /api/hello0
 */
exports.hello0 = function () {

};

/**
 * @api {get} /api/hello1
 */
exports['hello1'] = function () {

}

/**
 * @api {get} /api/hello2
 */
module.exports.hello2 = function () {

}

/**
 * @api {get} /api/hello3
 */
module.exports['hello3'] = function () {

}
