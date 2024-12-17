#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const program = new Command();

program
  .version('1.0.0')
  .description('Create a new Next.js project with custom configuration');

program
  .command('create')
  .description('Set up a new Next.js project with custom configuration')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Enter the project name:',
      },
      {
        type: 'list',
        name: 'authMethod',
        message: 'Select the authentication method:',
        choices: ['Auth0', 'Firebase', 'NextAuth'],
      },
    ]);

    const { projectName, authMethod } = answers;

    // Create a new Next.js project
    console.log(`Creating a new Next.js project: ${projectName}`);
    execSync(`npx create-next-app@latest ${projectName}`, { stdio: 'inherit' });

    // Copy the selected authentication setup to the new project
    const sourcePath = path.join(__dirname, 'templates', authMethod.toLowerCase());
    const destinationPath = path.join(process.cwd(), projectName);

    console.log(`Copying ${authMethod} authentication setup to ${projectName}`);
    await fs.copy(sourcePath, destinationPath);

    console.log(`${authMethod} authentication setup added to ${projectName}!`);
  });

program.parse(process.argv);
