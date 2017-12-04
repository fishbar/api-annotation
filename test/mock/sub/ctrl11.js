/**
 * 云市场接入文档
 * http://netmarket.oss-cn-hangzhou.aliyuncs.com/file/%E9%98%BF%E9%87%8C%E4%BA%91%E5%B8%82%E5%9C%BAISV%E6%8E%A5%E5%85%A5%E6%96%87%E6%A1%A3%20%2820170413%29.pdf?spm=5176.doc30501.2.1.eeg5aM&file=%E9%98%BF%E9%87%8C%E4%BA%91%E5%B8%82%E5%9C%BAISV%E6%8E%A5%E5%85%A5%E6%96%87%E6%A1%A3%20%2820170413%29.pdf
 */

//云市场订单回调接口
/*
 * @api {GET} /market/:type
 * @param req
 * @param res
 * @nowrap
 */
exports.run = function (req, res) {
  log.info(req.params, req.query);
  var orderType = req.params.type;
}

let obj = {}
/*
 * @api {GET} /market2/:type
 * @param req
 * @param res
 * @nowrap
 */
exports.run2 = function (req, res) {
  log.info(req.params, req.query);
  var orderType = req.params.type;
}