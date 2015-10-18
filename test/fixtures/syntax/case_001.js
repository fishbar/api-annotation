/*!
 * api-annotation: test/fixtures/syntax/case_001.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-10-19 01:33:37
 * CopyRight 2015 (c) Fish And Other Contributors
 */
/**
 * @api {get} /api/${version}/hello
 * @query
 *   id {Object}
 *   name
 *
 * @body:json
 *
 * @success:json
 *   {}
 * @failure:json
 *   {error: ''}
 */
exports.hello = function () {

};
