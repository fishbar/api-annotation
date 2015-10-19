/*!
 * api-annotation: test/mock/ctrl0.js
 * Authors  : fish <zhengxinlin@gmail.com> (https://github.com/fishbar)
 * Create   : 2015-10-19 12:13:13
 * CopyRight 2015 (c) Fish And Other Contributors
 */
/**
 * @api {get} /abc
 * @body:json
 *  {name: 'fish', test: true}
 *
 * @success:json
 *   {}
 */
exports.abc = function() {}