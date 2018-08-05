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
  .option('--api-version <version>', 'app version')
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
    console.error('require tpl file failed:' + e.message); // eslint-disable-line
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

apiAnnotation.process(dir, function (errs, data) {
  /**
   * 产生路由
   */
  let routerOptions = {
    tpl: tpl,
    routerFile: output,
    version: version
  };

  if (errs) {
    errs.forEach((err, index) => {
      console.error('ERROR' + (index + 1), 'file:', err.file, 'line:', err.loc.line, ',', err.loc.column);
      console.error(err.message);
    });
    return process.exit(1);
  }

  apiAnnotation.genRouter(data, routerOptions, (err) => {
    if (err) {
      console.error('ERROR', err); // eslint-disable-line
      process.exit(1);
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
    apiAnnotation.genDocument(data, docOptions, (err) => {
      if (err) {
        console.error('ERROR', err); // eslint-disable-line
        process.exit(1);
      } else {
        console.log('SUCCESS'); // eslint-disable-line
      }
    });
  }
});
