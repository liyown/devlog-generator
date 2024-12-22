#!/usr/bin/env node

// 抑制 punycode 警告
process.removeAllListeners('warning');

import { program } from 'commander';
import { generate } from './commands/generate';
import { init } from './commands/init';
import { showConfig } from './commands/config';
import { validate } from './commands/validate';
import { version } from '../package.json';

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
  .action(generate);

program
  .command('validate')
  .description('Validate configuration file')
  .action(validate);

program.parse();
