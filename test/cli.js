'use strict';

const cp = require('child_process');
const path = require('path');
const xfs = require('xfs');
const exec = process.execPath + ' ' + path.join(__dirname, '../bin/api-annotation.js');

describe('cli', function () {
  describe('api-annotation cli', function () {
    let tmpRouter = path.join(__dirname, './auto_router_tmp.js');
    let tmpDoc = path.join(__dirname, './tmpdoc');
    let targetDir = path.join(__dirname, '../example/controllers');
    it('should work fine', function () {
      let cmd = `${exec} -o ${tmpRouter} --doc ${tmpDoc} --api-version 0.0.1 ${targetDir}`;
      let result = cp.execSync(cmd);
      xfs.readFileSync(tmpRouter).toString().match(/\/\/@disabled router/);
      xfs.sync().rm(tmpRouter);
      xfs.sync().rm(tmpDoc);
    });
  });
});
