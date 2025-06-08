#!/usr/bin/env node

const { program } = require('commander');
const { createProject } = require('../src/commands/create');

program
  .version('1.0.0')
  .description('A CLI tool for creating JavaScript libraries');

program
  .command('create <project-name>')
  .description('Create a new JavaScript library project')
  .action(async (projectName) => {
    try {
      await createProject(projectName);
    } catch (error) {
      console.error(`Error creating project: ${error.message}`);
    }
  });

program.parse(process.argv);