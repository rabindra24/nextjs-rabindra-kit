#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const program = new Command();

program
  .version('1.0.0')
  .description('CLI to create a Next.js project with custom configurations');

program
  .command('create')
  .description('Set up a new Next.js project with custom configuration')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'authMethod',
        message: 'Which authentication method would you like to use?',
        choices: ['None', 'JWT', 'OAuth'],
      },
    ]);

    const { authMethod } = answers;
    const projectName = 'my-next-app';

    // Create the Next.js project
    console.log(`Creating a new Next.js project named ${projectName}...`);
    execSync(`npx create-next-app@latest ${projectName}`, { stdio: 'inherit' });

    let templatePath;
    switch (authMethod) {
      case 'auth0':
        templatePath = path.join(__dirname, 'templates', 'auth0');
        break;
      case 'firebase':
        templatePath = path.join(__dirname, 'templates', 'firebase');
        break;
      case 'nextauth':
        templatePath = path.join(__dirname, 'templates', 'nextauth');
        break;
      default:
        console.error('Invalid choice');
        process.exit(1);
    }

    const targetPath = path.join(process.cwd(), projectName);

    // Copy the chosen template files to the project directory
    fs.copy(templatePath, targetPath)
      .then(() => console.log(`Project created at ${targetPath}`))
      .catch(err => console.error(err));
  });

program.parse(process.argv);
