#!/usr/bin/env node
void (async () => {
  const { Command } = await import('commander');
  const program = new Command();
  program
    .argument('<path>', 'Path of example')
    .name('Example CLI')
    .description('This is an example')
    .action(async (path: string) => {
      console.log(JSON.stringify(path));
    });
  if (process.argv) {
    program.parse(process.argv);
  }
})();
