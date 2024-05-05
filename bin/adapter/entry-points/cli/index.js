#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const program = new commander_1.Command();
program
    .argument('<path>', 'Path of domain entity directory')
    .name('Get entity definitions')
    .description('Get entity definitions and relation definitions from types of TypeScript in src directory')
    .action(async (path) => {
    console.log(JSON.stringify(path));
});
if (process.argv) {
    program.parse(process.argv);
}
//# sourceMappingURL=index.js.map