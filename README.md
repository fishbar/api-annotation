# api-annotation
like java annotation, using comments annotation,  generate both router binding script and apidoc

## Syntax

controller file
```js
// controllers/test.js
/**
 * @api {get} /api/user/:id
 * @name User.getUser
 * @desc
 *
 * @param
 *   id
 *
 * @query
 *   limit
 *   sortBy
 *
 * @body:json
 *   {test:hello}
 */
exports.hello = function (req, callback) {

};
```
the file above will generate to parts: routerFile and docFile

routerFile:
```js
var ctrls = {
  "./controllers/test.js": require("./controllers/test.js");
}
module.exports = function (router) {
  router.get('/api/user/:id', ctrls["controllers/test.js"]);
}
```

docFile:
```md
comming soon
```
