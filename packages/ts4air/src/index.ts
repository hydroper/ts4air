import { program } from 'commander';
import { TS2SWF } from './ts2swf';

program
    .name('ts4air')
    .description('Manages "TypeScript for Adobe AIR" projects')
    .version('1.0.0');

program.command('ts2swf')
    .description('Compiles TypeScript code to SWF')
    .option('-p, --project <projectPath>', 'indicates the project path', '.')
    .option('-o, --output <outputPath>', 'indicates the path for the output SWF')
    .action((projectPath, outputPath) => {
        new TS2SWF(projectPath, outputPath);
    });

program.parse();