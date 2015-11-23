# api-annotation
like java annotation, using comments annotation,  generate both router binding script and apidoc

## programmable

```
var apiAnn = require('api-annotation');

var result = apiAnn.process();

apiAnn.genRouter('./auto_router.js', result);
apiAnn.genDoc('./documents/api/v1.0/', result);
```

## Syntax

controller file
```js
// controllers/test.js
/**
 * @api {get} /api/user/:id
 * @name User.getUser
 * @desc
 *
 * @params
 *   id
 *
 * @query
 *   limit {Number} maxRow in result
 *   sortBy {String} sort field
 *
 * @body:json
 *   user {Object} D+的用户对象
 *     name {String}
 *     id {Number}
 */
exports.hello = function (req, callback) {

};
```

### @api [required]

define the api path and support method
```
// full pattern
@api {method} /url

// in short, default method is `GET`
@api /url
```

### @name [optional]

name and group the api, just for display in apidoc
```
@name groupName.apiName
@name group0.group1.groupXXXX.apiName
```

### @description / @desc

you can either using `@desc` or `@description`
```
@desc
  your desc here

@description
  your desc here
```

besides, the content before `@api` will merge into desc
for example:
```
this is a desc too
@api /test

@desc
  this is a test api
```
the finally desc will be :
```
this is a test api
this is a desc too
```

### @query [optional]

the query object from url's queryString
```
@query
  username {String} the target username
  resourceId {Number} the resource id
```
* each properties takes a line
* each line contains: propertyName, propertyType, description

### @body [optional]

`@body` is same as query

take a look at more complicate example
```
@body:json
  user {Object} Class User
    name {String} user nick
    id {Number} user id
  group
    groupName {String} group name
    groupId {Number} group idins
```
the code below means:
* body is a json string, you need add mime `content-type` when query this api
* pay attension to the indention, it means sub properties

## test

```sh
# run test
npm test

# create syntax case
make syntaxCase case=00x
```

## Appendix: all annotation token

```
@api
@name
@json
@description
@desc
@params
@query
@body
@success
@success
@failure
@error
@private
@internal
@public
```

