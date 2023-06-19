import {program} from 'commander';
import {Ts2Swf} from './ts2swf';
import {Ts2SwfError} from './ts2swf/errors';

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
        try {
            new Ts2Swf(projectPath);
        } catch (error) {
            if (!(error instanceof Ts2SwfError)) {
                throw error;
            }
            console.error(error.message);
        }
    });

program.command('validate')
    .description('Validates TypeScript code')
    .option('-p, --project <projectPath>', 'indicates the project path', '.')
    .action(projectPath => {
        try {
            new Ts2Swf(projectPath, false);
        } catch (error) {
            if (!(error instanceof Ts2SwfError)) {
                throw error;
            }
            console.error(error.message);
        }
    });

program.parse();