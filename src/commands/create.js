const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const Handlebars = require('handlebars');
const { githubDownload } = require('./utils');
const { exec } = require('child_process');
const { log } = require('console');
async function createProject(projectName) {
  // 获取用户输入
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'description',
      message: 'Project description',
      default: 'A new JavaScript library'
    },
    // {
    //   type: 'list',
    //   name: 'TemplateType',
    //   message: 'Select Template type',
    //   choices: ['JavaScript', 'TypeScript',]
    // },
    // {
    //   type: 'checkbox',
    //   name: 'projectConfig',
    //   message: 'checkbox',
    //   choices: [
    //     { name: 'eslint + prettier', value: 1 },
    //     { name: 'vitest', value: 2 },
    //     { name: '.husky+commitlint+git-cz', value: 3 },
    //     { name: 'github action', value: 4 },
    //   ]
    // }
  ]);
  // console.log('answers', answers);
  // 选择模板
  const templatePath = path.join(__dirname, '../templates');
  const targetDir = path.join(process.cwd(), projectName);
  log(`✨  Creating project in ${chalk.yellow(targetDir)}.`)

  if (fs.existsSync(targetDir)) {
    console.error(`Project ${projectName} already exists.`);
    return;
  }
  // https://github.com/CNLHB/vue2-vite-demo.git
  // 复制模板文件
  const spinner = ora(`download project ${answers.TemplateType || 'JavaScript'} template...`).start();
  // await fs.copy(templatePath, targetDir);
  const downloadRes = await githubDownload({
    templateUrl: "1github:CNLHB/vue2-vite-demo",// "https://github.com/CNLHB/vue2-vite-demo.git", // 指定要下载的 Git 仓库，这里是 GitHub 上的 `username/repository`
    projectName: targetDir, // 指定下载的目标目录，这里将下载到当前目录下的 `my-repo` 目录
    // 回调函数，当下载完成时会被调用，如果发生错误，`err` 不为 `null`，否则 `err` 为 `null`，表示下载成功
  }
  )
  if (downloadRes.ret) {
    console.log('\n github download error: ', chalk.red(`${downloadRes.msg}...`));
    spinner.stop()
    return
  }

  spinner.succeed(`Project ${projectName} created successfully!`);


  // 替换模板中的占位符
  // const files = await fs.readdir(targetDir);
  // for (const file of files) {
  //   const filePath = path.join(targetDir, file);
  //   const content = await fs.readFile(filePath, 'utf8');
  //   const compiled = Handlebars.compile(content);
  //   const newContent = compiled({
  //     projectName,
  //     description: answers.description,
  //     moduleType: answers.moduleType
  //   });
  //   await fs.writeFile(filePath, newContent);
  // }

  // 初始化项目
  process.chdir(targetDir);
  await exec('pnpm install');

}

module.exports = { createProject };