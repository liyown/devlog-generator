#!/usr/bin/env node

// 抑制 punycode 警告
process.removeAllListeners('warning');

import { program } from 'commander';
import { generate } from './commands/generate';
import { init } from './commands/init';
import { showConfig } from './commands/config';
import { validate } from './commands/validate';
import { clean } from './commands/clean';
import { version } from '../package.json';
import { batchGenerate } from './commands/batch';

program
  .name('devlog')
  .description(
    'A tool to automatically generate development logs from Git commits'
  )
  .version(version);

program
  .command('init')
  .description('Initialize configuration file')
  .action(init);

program
  .command('config')
  .description('Show current configuration')
  .action(showConfig);

program
  .command('generate')
  .description('Generate development logs from Git commits')
  .option('-f, --format <type>', 'output format (markdown, json, html)')
  .option('-o, --output-dir <dir>', 'output directory')
  .option('-m, --max-commits <number>', 'maximum number of commits')
  .option('-t, --include-tags', 'include Git tags')
  .action(generate);

program
  .command('validate')
  .description('Validate configuration file')
  .action(validate);

program
  .command('clean')
  .description('Clean generated log files')
  .option('-a, --all', 'clean all log files')
  .option('-f, --format <type>', 'clean specific format (markdown, json, html)')
  .option('-b, --before <date>', 'clean files before date (YYYY-MM-DD)')
  .action(clean);

program
  .command('batch')
  .description('Generate logs for multiple commits based on criteria')
  .option('-s, --start-date <date>', 'start date (YYYY-MM-DD)')
  .option('-e, --end-date <date>', 'end date (YYYY-MM-DD)')
  .option('-t, --tags <tags...>', 'filter by tags')
  .option('-f, --format <type>', 'output format (markdown, json, html)')
  .option('-o, --output-dir <dir>', 'output directory')
  .action(batchGenerate);

program.parse();
