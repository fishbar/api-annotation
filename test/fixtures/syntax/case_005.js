/*!
 * api-annotation: test/fixtures/syntax/case_004.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-11-23 18:16:42
 * CopyRight 2015 (c) Fish And Other Contributors
 */

/**
 * end_with_flag
 * @api {GET|POST|PUT|PATCH|DELETE} /test
 * @private
 * @example
 *
 * ```
 *  curl ${server}/test
 * ```
 *
 * success:
 * ```
 * {
 *   code: 'SUCCESS',
 *   data: 'hello'
 * }
 * ```
 */
exports.hello = function () {

};
