/** do not modify this file, genaratered by api-annotation **/
'use strict';
function process(fn, type, wrap, config) {
  if (type === 'public') {
    return fn;
  }
  if (wrap) {
    return function (req, callback) {
      fn(req, callback);
    };
  } else {
    return function (req, res, next) {
      fn(req, res, next);
    };
  }
}
const ctrls = {
  './fixtures/syntax/case_001.js': require('./fixtures/syntax/case_001.js'),
  './fixtures/syntax/case_003.js': require('./fixtures/syntax/case_003.js'),
  './fixtures/syntax/case_004.js': require('./fixtures/syntax/case_004.js'),
  './fixtures/syntax/case_005.js': require('./fixtures/syntax/case_005.js'),
  './fixtures/syntax/case_006.js': require('./fixtures/syntax/case_006.js')
};
var config = {};

module.exports = function (router) {
  router.get('/api/${version}/hello', process(ctrls['./fixtures/syntax/case_001.js'].hello, 'private', true, config), true);
  router.get('/api/${version}/hello', process(ctrls['./fixtures/syntax/case_003.js'].hello, 'public', true, config), true);
  router.get('/end_with_flag', process(ctrls['./fixtures/syntax/case_004.js'].hello, 'private', true, config), true);
  router.post('/end_with_flag', process(ctrls['./fixtures/syntax/case_004.js'].hello, 'private', true, config), true);
  router.put('/end_with_flag', process(ctrls['./fixtures/syntax/case_004.js'].hello, 'private', true, config), true);
  router.patch('/end_with_flag', process(ctrls['./fixtures/syntax/case_004.js'].hello, 'private', true, config), true);
  router.delete('/end_with_flag', process(ctrls['./fixtures/syntax/case_004.js'].hello, 'private', true, config), true);
  router.patch('/end_with_success', process(ctrls['./fixtures/syntax/case_004.js'].hello, 'public', true, config), true);
  router.delete('/end_with_json', process(ctrls['./fixtures/syntax/case_004.js'].hello, 'public', true, config), true);
  router.post('/end_with_error', process(ctrls['./fixtures/syntax/case_004.js'].hello, 'public', true, config), true);
  router.get('/end_with_name', process(ctrls['./fixtures/syntax/case_004.js'].hello, 'public', true, config), true);
  router.get('/test', process(ctrls['./fixtures/syntax/case_005.js'].hello, 'private', true, config), true);
  router.post('/test', process(ctrls['./fixtures/syntax/case_005.js'].hello, 'private', true, config), true);
  router.put('/test', process(ctrls['./fixtures/syntax/case_005.js'].hello, 'private', true, config), true);
  router.patch('/test', process(ctrls['./fixtures/syntax/case_005.js'].hello, 'private', true, config), true);
  router.delete('/test', process(ctrls['./fixtures/syntax/case_005.js'].hello, 'private', true, config), true);
  router.get('/test_security_setting', process(ctrls['./fixtures/syntax/case_006.js'].test, 'internal', true, config), true);
};
