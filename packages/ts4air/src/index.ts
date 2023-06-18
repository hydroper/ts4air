import {program} from 'commander';
import {Ts2Abc} from './ts2abc';

program
    .name('ts4air')
    .description('Manages "TypeScript for Adobe AIR" projects')
    .version('1.0.0');

program.command('ts2abc')
    .description('Compiles TypeScript code to SWF')
    .option('-p, --project <projectPath>', 'indicates the project path', '.')
    .action(projectPath => {
        let ts2abc = new Ts2Abc();
        ts2abc.compile(ts2abc.programFromProject(projectPath));
    });

program.command('ts2swf')
    .description('Compiles TypeScript code to SWF')
    .option('-p, --project <projectPath>', 'indicates the project path', '.')
    .action(projectPath => {
        //
    });

program.parse();