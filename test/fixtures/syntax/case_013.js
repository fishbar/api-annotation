/**
 * 解构
 * @api /case_13
 */
exports.abc = function (req, callback) {
  let {a, b} = req.body;
  let c = {...req.query};
  callback(null);
};
