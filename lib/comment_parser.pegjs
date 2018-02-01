{
  var HTTP_METHODS = {
    get: true,
    post: true,
    delete: true,
    patch: true,
    put: true
  };


  function checkHttpMethod (methods) {
    var errors = [];
    methods.forEach(function (m) {
      if (!HTTP_METHODS[m.toLowerCase()]) {
        errors.push(m);
      }
    });
    if (errors.length) {
      error('http method not allowed: ' + errors.join(''))
    }
  }
}

Expression = desc:$(DESC) ? result:(_? syntax:SYNTAX {return syntax;}) * END {

  desc = (desc||'').trim();
  if (desc && result) {
    var flag = false;
    result.forEach(function (node) {
      if (node.type === 'desc') {
        node.value = desc.trim() + '\n' + node.value;
        flag = true;
      }
    });
    if (!flag) {
      result.push({
        token: 'desc',
        value: desc
      })
    }
  }
  return result;
}

SYNTAX =
  SYNTAX_API /
  SYNTAX_NAME /
  SYNTAX_DESC /
  SYNTAX_QUERY /
  SYNTAX_BODY /
  SYNTAX_PARAMS /
  SYNTAX_SUCCESS /
  SYNTAX_FAILURE /
  SYNTAX_EXAMPLE /
  SYNTAX_JSON /
  SYNTAX_FLAG /
  SYNTAX_UNKNOW

SYNTAX_API "syntax @api"
  = token: TOKEN_API
  	SPACE
    methods: METHODS?
    SPACE?
    url: $INPUT?
    LINE_END?
    desc: $DESC?
    LINE_END
  {
    if (!methods || methods.length === 0) {
      methods = ['get'];
    }

    if (!url) {
      error('api url missing, syntax should be:`@api {$methods} $url`');
    }

    var res = {
      token: token,
      methods: methods,
      url: url,
      desc: desc ? desc.trim() : ''
    };
    if (url.startsWith('~')) {
      res.url = url.substr(1).trim();
      res.regexp = true;
    }

    return res;
  }

SYNTAX_NAME "syntax @name"
  = token: TOKEN_NAME
  	SPACE?
    name: $INPUT?
    LINE_END
  {
    return {
      token: token,
      value: name
    }
  }

SYNTAX_DESC
  = token: TOKEN_DESC
   (LINE_END/SPACE)
   desc: $DESC?
   LINE_END
  {
    return {
      token: token,
      value: desc
    }
  }

SYNTAX_TYPY_ARRAY
  = "["
  	types: (SYNTAX_TYPE+)
    "]"
  {
  	return types;
  }


SYNTAX_TYPY_OBJECT
  = NEW_LINE?
  	"{"
	types: (SYNTAX_TYPE+)
    "}"
    NEW_LINE?
  {
  	return types;
  }

SYNTAX_TYPE
  = NEW_LINE?
  	name: $([^ \t\n\r@:]+)
    format:(":" f: $([a-zA-Z]+) {return f})?
  	SPACE?
    typeFunc: TYPE
    desc: (SPACE input: $INPUT {return input})?
    NEW_LINE
    items: (SYNTAX_TYPY_OBJECT/SYNTAX_TYPY_ARRAY)?
  {
    if(typeFunc){
      return typeFunc({
      	name: name,
        format: format,
        desc: desc,
        items: items
      });
    }else{
      return {
          name: name,
          format: format,
          type: "String",
          desc: desc
      }
    }
  }

SYNTAX_PARAMS
  = token: TOKEN_PARAMS
  	type:(":" f: $([a-zA-Z]+) {return f})?
    desc: $([^@{\n\r]*)?
    params: ((SYNTAX_TYPY_OBJECT+) / $DESC)?
    LINE_END
  {
    return {
      token: token,
      desc: desc,
      type: type,
      value: Object(params) === params? params[0] : params
    }
  }

SYNTAX_QUERY
  = token: TOKEN_QUERY
  	type:(":" f: $([a-zA-Z]+) {return f})?
    desc: $([^@{\n\r]*)?
    query: ((SYNTAX_TYPY_OBJECT+) / $DESC)?
    LINE_END
  {
    return {
      token: token,
      desc: desc,
      type: type,
      value: Object(query) === query? query[0] : query
    }
  }

SYNTAX_BODY
  = token:TOKEN_BODY
    type:(":" f: $([a-zA-Z]+) {return f})?
    desc: $([^@{\n\r]*)?
    body: ((SYNTAX_TYPY_OBJECT+) / $DESC)?
    LINE_END
  {
    return {
      token: token,
      desc: desc,
      type: type,
      value: Object(body) === body? body[0] : body
    }
  }

SYNTAX_JSON
  = token:TOKEN_JSON
    ignore:$DESC
    END
 {
    return {
      token: token,
      value: true
    }
  }

SYNTAX_SUCCESS
  = token:TOKEN_SUCCESS
    type:(":" f: $([a-zA-Z]+) {return f})?
    success: (SYNTAX_TYPE+/$DESC)?
    LINE_END
  {
    return {
      token: token,
      type: type || 'json',
      value: success
    }
  }

SYNTAX_FAILURE
  = token:TOKEN_FAILURE
    type:(":" f: $([a-zA-Z]+) {return f})?
    failure: (SYNTAX_TYPE+/$DESC)?
    LINE_END
  {
    return {
      token: token,
      type: type || 'json',
      value: failure || ''
    }
  }

SYNTAX_EXAMPLE
  = token:TOKEN_EXAMPLE
    example:((SPACE/LINE_END) failure:$DESC {return failure})?
    END
  {
    return {
      token: token,
      value: example
    }
  }

SYNTAX_FLAG
  = token: TOKEN_FLAG LINE_END ? END {
    return {
      token: token,
      value: true
    }
  }

SYNTAX_UNKNOW
  = token:TOKEN_UNKNOW
    info:(LINE_END info:$DESC{return info})?
    END {
    return {
      token: token,
      value: info
    }
  }

TYPES = "String"/"Boolean"/"Integer"/"Number"/"Object"/"Array"/"Null"/"Any"

TYPE
  = "{"
  	type:$(TYPES ("[]")?)
    "}"
 {
 	var isArray = type[type.length -1] === "]";
    if(isArray){
      isArray = type.substr(0, type.length - 2);
      type = "Array";
    }
 	if(type === "Object"){
    	return function(obj){
        	return {
            	name: obj.name,
                type: 'Object',
                format: obj.format,
                desc: obj.desc,
                properties: obj.items
            }
        }
    }else if(type === "Array"){
    	return function(obj){
        	if(isArray && !obj.items){
            	obj.items = {
                	type: isArray
                }
            }
        	return {
            	name: obj.name,
                type: 'Array',
                format: obj.format,
                desc: obj.desc,
                items: obj.items
            }
        }
    }else{
    	return function(obj){
        	return {
            	name: obj.name,
                type: type,
                format: obj.format,
                desc: obj.desc
            }
        }
    }
 }

METHODS "http methods" = "{" methods:("|"? method:$METHOD {return method})* "}" {
  checkHttpMethod(methods);
  methods.forEach(function (m, i, a) {
    a[i] = m.toLowerCase();
  });

  return methods;
}

METHOD "http method" = [a-zA-Z]+
INPUT = [^\r\n]+

DESC = [^@]* ((&"@" !TOKEN_DEFINED "@") [^@]*)*

TOKEN_DEFINED = TOKEN_API / TOKEN_PARAMS / TOKEN_QUERY / TOKEN_BODY / TOKEN_SUCCESS
/ TOKEN_FAILURE / TOKEN_NAME / TOKEN_JSON / TOKEN_DESC / TOKEN_FLAG / TOKEN_EXAMPLE

TOKEN_API = "@api" {return "api"}
TOKEN_PARAMS "token @params" = "@params" {return "params"}
TOKEN_QUERY "token @query" = "@query" {return "query"}
TOKEN_BODY "token @body" = "@body" {return "body"}
TOKEN_SUCCESS "token @success" = "@success" {return "success"}
TOKEN_FAILURE "token @failure/@error" = "@" ("failure"/"error") {return "failure"}
TOKEN_NAME "token @name" = "@name" {return "name"}
TOKEN_DESC "token @desc/@description" = "@" ("description" / "desc")  {return "desc"}
TOKEN_JSON "token @json" = "@json" {return "json"}
TOKEN_EXAMPLE "token @example" = "@example" {return "example"}
TOKEN_FLAG "token FLAG"
  = "@"
    name:(
      "private" /
      "internal" /
      "public" /
      "nowrap"
    ) {return name}

TOKEN_UNKNOW "unknow token" = '@'name:$([a-z]+) {return "unknow:" + name}

SPACE = [ \t]+

LINE_END "new line" = [ \t]*[\n\r] / ''

NEW_LINE = ([ \t]*[\n\r][ \t]*)

END "empty line or the end of the string" = _ / ""

_ "whitespace" = [ \t\n\r]*