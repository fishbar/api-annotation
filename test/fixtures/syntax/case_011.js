/**
 * @api /test_module_exports
 */

module.exports = (req, callback) => {
  callback(null, 'test_module_exports');
};
