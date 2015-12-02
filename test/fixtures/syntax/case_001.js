/*!
 * api-annotation: test/fixtures/syntax/case_001.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-10-19 01:33:37
 * CopyRight 2015 (c) Fish And Other Contributors
 */
/**
 * @api {get} /api/${version}/hello
 * @name Test.apiName
 * @private
 * @query
 *   id {Number}
 *   name {String}
 * @body:json
 *   user
 *     name {String} user name
 *     id {Number} user id
 *   shop
 *     id {Number} shop id
 *   visible {Boolean} true
 *
 * @success:json
 *   {code: 'SUCCESS', data: '1'}
 * @success
 *   {code: 'SUCCESS', data: '2'}
 *
 * @error:json
 *   {code: 'UNKNOWERROR', message: 'error message0'}
 * @failure
 *   {code: 'UNKNOWERROR', message: 'error message1'}
 */
exports.hello = function () {

};
