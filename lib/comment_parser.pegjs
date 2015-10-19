{

  function info(location) {
    var line = location.start.line;
    var column = location.start.column;
    // return 'Line ' + line + ', Column ' + column + ':';
    return 'Line ' + line + ': ';
  }
  var TOKENS = {
    api: true,
    params: true,
    query: true,
    name: true,
    description: true,
    body: true,
    success: true,
    failure: true,
    json: true
  };
  function checkToken (token) {
    if (!TOKENS[token]) {
      return 'token undefined: `' + token + '`';
    }
    return null;
  }

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
      error(info(location()) + 'http method not allowed: ' + errors.join(''))
    }
  }
}

Expression = result:(_? syntax:SYNTAX {return syntax;}) * END {
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
  SYNTAX_JSON /
  SYNTAX_UNKNOW

SYNTAX_API "syntax @api"
  = token:TOKEN_API
    methods:(SPACE methods:METHODS {return methods})?
    url:(SPACE url:$URL {return url})?
    LINE_END
  {
    if (!methods || methods.length === 0) {
      methods = ['get'];
    }

    if (!url) {
      error(info(location()) + 'api url missing, syntax should be:`@api {$methods} $url`');
    }

    return {
      token: token,
      methods: methods,
      url: url
    }
  }

SYNTAX_NAME "syntax @name"
  = token:TOKEN_NAME
    name:(SPACE name:$([^@\n\r]+){return name})? LINE_END
  {
    return {
      token: token,
      value: name
    }
  }

SYNTAX_DESC
  = token:TOKEN_DESC
    desc:$(LINE_END desc:$DESC{return desc})?
    END
  {
    return {
      token: token,
      value: desc
    }
  }

SYNTAX_PARAMS
  = token: TOKEN_PARAMS
    params:(LINE_END params:$DESC {return params})
    END
  {
    return {
      token: token,
      value: params
    }
  }

SYNTAX_QUERY
  = token:TOKEN_QUERY
    query:((SPACE/LINE_END) query:$DESC {return query})?
    END
  {
    return {
      token: token,
      value: query
    }
  }

SYNTAX_BODY
  = token:TOKEN_BODY
    type:(":" type:$([a-z]+){return type})?
    body:((SPACE/LINE_END) body:$DESC {return body})? END
  {
    return {
      token: token,
      type: type,
      value: body
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
    type:(":" type:$([a-z]+){return type})?
    success:((SPACE/LINE_END) success:$DESC {return success})?
    END
  {
    return {
      token: token,
      type: type,
      value: success
    }
  }

SYNTAX_FAILURE
  = token:TOKEN_FAILURE
    type:(":" type:$([a-z]+){return type})?
    failure:((SPACE/LINE_END) failure:$DESC {return failure})?
    END
  {
    return {
      token: token,
      type: type,
      value: failure
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


METHODS "http methods" = "{" methods:("|"? method:$METHOD {return method})* "}" {
  checkHttpMethod(methods);
  methods.forEach(function (m, i, a) {
    a[i] = m.toLowerCase();
  });

  return methods;
}

METHOD "http method" = [a-zA-Z]+
URL = [^\r\n]+

DESC = [^@]* ((&"@" !TOKEN_DEFINED "@") [^@]*)*

TOKEN_DEFINED = TOKEN_API / TOKEN_PARAMS / TOKEN_QUERY / TOKEN_BODY / TOKEN_SUCCESS
/ TOKEN_FAILURE / TOKEN_NAME / TOKEN_JSON / TOKEN_DESC

TOKEN_API = "@api" {return "api"}
TOKEN_PARAMS "token @params" = "@params" {return "params"}
TOKEN_QUERY "token @query" = "@query" {return "query"}
TOKEN_BODY "token @body" = "@body" {return "body"}
TOKEN_SUCCESS "token @success" = "@success" {return "success"}
TOKEN_FAILURE "token @failure/@error" = "@" ("failure"/"error") {return "failure"}
TOKEN_NAME "token @name" = "@name" {return "name"}
TOKEN_JSON "token @json" = "@json" {return "json"}
TOKEN_DESC "token @desc/@description" = "@" ("description" / "desc") {return "desc"}
TOKEN_UNKNOW "token undefined" = '@'name:$([a-z]+) {return "unknow:" + name}

SPACE = [ \t]+

LINE_END "new line" = [ \t]*[\n] / ''

END "empty line or the end of the string" = _ / ""

_ "whitespace" = [ \t\n\r]*