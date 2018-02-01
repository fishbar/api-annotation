/**
 * @api {POST|GET} /api/${version}/user/:id
 * @name 获取用户信息
 * @description 获取用户信息
 * @params
 *   {
 *    id {String} 用户ID
 *    status {Boolean} 用户状态
 *   }
 * @query
 *  {
 *      limit {Object} se
 *      {
 *        search {String[]} must be urlencoded
 *        search1 {String} must be urlencoded
 *      }
 *    createTime:dataTime {String} must be urlencoded
 *  }
 * 
 * @body:json
 *    name {Object} s
 * 
 * @success:json
 *    search {String[]} must be urlencoded
 * @success
 *    description
 * @failure
 *    description
 * @example
 * @private
 * @public
 * @internal
 */
exports.hello = function (req, res, next) {

};
