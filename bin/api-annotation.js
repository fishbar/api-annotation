#!/usr/bin/env node
'use strict';
const apiAnnotation = require('../index');
const program = require('commander');
const pkg = require('../package.json');
const path = require('path');
const cwd = process.cwd();

program
  .version(pkg.version);

program
  .option('--tpl [value]', 'router文件模板')
  .option('-o --output <value>', 'output router file')
  .option('--doc <path>', 'gen doc to path')
  .option('-api-version <version>', 'app version')
  .parse(process.argv);

let tpl = program.tpl;
let output = program.output;
let doc = program.doc;
let version = program.apiVersion;
let dir = program.args[0];

if (tpl) {
  if (!path.isAbsolute(tpl)) {
    tpl = path.join(cwd, tpl);
  }
  try {
    tpl = require(tpl);
  } catch (e) {
    console.log('require tpl file failed:' + e.message); // eslint-disable-line
    process.exit(1);
  }
}
if (output) {
  if (!path.isAbsolute(output)) {
    output = path.join(cwd, output);
  }
} else {
  output = path.join(cwd, './auto_router.js');
}

if (!path.isAbsolute(dir)) {
  dir = path.join(cwd, dir);
}

apiAnnotation.process(dir, function (err, data) {
  /**
   * 产生路由
   */
  let routerOptions = {
    tpl: tpl,
    routerFile: output,
    version: version
  };

  apiAnnotation.genRouter(data.result, routerOptions, (err) => {
    if (err) {
      console.log('ERROR', err); // eslint-disable-line
    } else {
      console.log('SUCCESS'); // eslint-disable-line
    }
  });

  if (doc) {
    let docOptions = {
      ctrlPath: dir,
      docPath: doc,
      version: version
    };
    apiAnnotation.genDocument(data.result, docOptions, (err) => {
      if (err) {
        console.log('ERROR', err); // eslint-disable-line
      } else {
        console.log('SUCCESS'); // eslint-disable-line
      }
    });
  }
});
