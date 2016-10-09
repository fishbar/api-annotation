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
  .command('router <dir>')
  .option('--tpl <value>', 'router文件模板')
  .option('-o --output <value>', 'output router file')
  .action(function (dir, args) {
    let tpl = args.tpl;
    let output = args.output;
    if (tpl) {
      if (!path.isAbsolute(tpl)) {
        tpl = path.join(cwd, tpl);
      }
      try {
        tpl = require(tpl);
      } catch (e) {
        console.log('require tpl file failed:' + e.message);
        process.exit(1);
      }
    }
    if (args.output) {
      if (!path.isAbsolute(output)) {
        output = path.join(cwd, output);
      }
    } else {
      output = path.join(cwd, './auto_router.js');
    }
    if (!path.isAbsolute(dir)) {
      dir = path.join(cwd, dir);
    }
    apiAnnotation.genRouter(dir, {
      tpl: tpl,
      routerFile: output,
      version: pkg.version
    }, function (err) {
      if (err) {
        console.log('ERROR', err);
      } else {
        console.log('SUCCESS');
      }
    });
  });

program.parse(process.argv);
