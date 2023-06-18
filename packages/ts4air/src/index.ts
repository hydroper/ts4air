import {program} from 'commander';
import {} from './ts2abc';

program
    .name('ts4air')
    .description('Manages "TypeScript for Adobe AIR" projects')
    .version('1.0.0');

program.command('ts2abc')
    .description('Compiles TypeScript code to SWF')
    .option('-p, --project <projectPath>', 'indicates the project path', '.')
    .action(projectPath => {
        //
    });

program.command('ts2swf')
    .description('Compiles TypeScript code to SWF')
    .option('-p, --project <projectPath>', 'indicates the project path', '.')
    .action(projectPath => {
        //
    });

program.parse();