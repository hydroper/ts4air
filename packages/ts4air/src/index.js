const { program } = require('commander');

program
    .name('ts4air')
    .description('Manages "TypeScript for Adobe AIR" projects')
    .version('1.0.0');

program.command('toswf')
    .description('Compiles TypeScript code to SWF')
    .action(() => {
        //
    });

program.parse();