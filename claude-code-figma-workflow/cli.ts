#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { DesignSpecGenerator } from './src/generate-design-spec';
import { HTMLPrototypeGenerator } from './src/generate-html-prototype';
import { FigmaTools } from './src/figma-tools';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const program = new Command();

program
  .name('claude-code-figma')
  .description('Claude Code + Figma 工作流工具')
  .version('1.0.0');

// ============================================================================
// 工作流 1: PRD → 设计规范 → Figma 设计稿
// ============================================================================

program
  .command('generate-spec')
  .description('从 PRD 生成设计规范')
  .option('-p, --prd <path>', 'PRD 文件路径', 'prd.md')
  .option('-o, --output <path>', '输出目录', './output')
  .action(async (options) => {
    console.log('🎨 工作流 1: PRD → 设计规范\n');

    const prdPath = path.resolve(options.prd);

    if (!fs.existsSync(prdPath)) {
      console.error(`❌ PRD 文件不存在: ${prdPath}`);
      console.log('\n💡 提示: 使用 prd-template.md 创建 PRD');
      return;
    }

    try {
      // 生成设计规范
      const generator = new DesignSpecGenerator(prdPath);
      const outputPath = path.join(options.output, 'design-spec.json');

      generator.save(outputPath);

      console.log('\n✅ 设计规范生成完成!');
      console.log(`📄 文件位置: ${outputPath}`);
    } catch (error) {
      console.error('❌ 生成失败:', error);
    }
  });

program
  .command('generate-prototype')
  .description('从设计规范生成 HTML/Tailwind 原型')
  .option('-s, --spec <path>', '设计规范文件路径', './output/design-spec.json')
  .option('-o, --output <path>', '输出目录', './output')
  .action(async (options) => {
    console.log('🖥️  工作流 1: 设计规范 → HTML 原型\n');

    const specPath = path.resolve(options.spec);

    if (!fs.existsSync(specPath)) {
      console.error(`❌ 设计规范文件不存在: ${specPath}`);
      console.log('\n💡 提示: 先运行 "claude-code-figma generate-spec" 生成设计规范');
      return;
    }

    try {
      const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
      const generator = new HTMLPrototypeGenerator(spec);
      const outputPath = path.join(options.output, 'prototype.html');

      generator.save(outputPath);

      console.log('\n✅ HTML 原型生成完成!');
      console.log(`📄 文件位置: ${outputPath}`);
      console.log('\n🌐 在浏览器中打开查看原型');
      console.log(`\n   file://${outputPath}`);
    } catch (error) {
      console.error('❌ 生成失败:', error);
    }
  });

program
  .command('create-figma')
  .description('从设计规范创建 Figma 设计格式')
  .option('-s, --spec <path>', '设计规范文件路径', './output/design-spec.json')
  .option('-o, --output <path>', '输出目录', './output')
  .action(async (options) => {
    console.log('📋 工作流 1: 设计规范 → Figma 设计格式\n');

    const specPath = path.resolve(options.spec);

    if (!fs.existsSync(specPath)) {
      console.error(`❌ 设计规范文件不存在: ${specPath}`);
      return;
    }

    try {
      const figmaTools = new FigmaTools(process.env.FIGMA_TOKEN || '');
      await figmaTools.createFigmaDesignFromSpec(specPath);
    } catch (error) {
      console.error('❌ 创建失败:', error);
    }
  });

// ============================================================================
// 工作流 2: Figma 设计稿 → 代码
// ============================================================================

program
  .command('extract-spec')
  .description('从 Figma 提取设计规范')
  .requiredOption('-f, --file <key>', 'Figma 文件 key')
  .option('-o, --output <path>', '输出文件路径', './output/figma-spec.json')
  .action(async (options) => {
    console.log('📥 工作流 2: Figma → 设计规范\n');

    const token = process.env.FIGMA_TOKEN;

    if (!token) {
      console.error('❌ 未找到 FIGMA_TOKEN 环境变量');
      console.log('\n💡 请设置 Figma Personal Access Token:');
      console.log('   1. 访问: https://www.figma.com/settings');
      console.log('   2. 创建 Personal Access Token');
      console.log('   3. 添加到 .env 文件: FIGMA_TOKEN=your_token');
      return;
    }

    try {
      const figmaTools = new FigmaTools(token);
      await figmaTools.extractDesignSpec(options.file, options.output);

      console.log('\n✅ 设计规范提取完成!');
    } catch (error) {
      console.error('❌ 提取失败:', error);
    }
  });

program
  .command('generate-code')
  .description('从 Figma 生成代码')
  .requiredOption('-f, --file <key>', 'Figma 文件 key')
  .option('-o, --output <dir>', '输出目录', './src/components')
  .option('-fw, --framework <name>', '框架 (react/vue/html)', 'react')
  .action(async (options) => {
    console.log('💻 工作流 2: Figma → 代码\n');

    const token = process.env.FIGMA_TOKEN;

    if (!token) {
      console.error('❌ 未找到 FIGMA_TOKEN 环境变量');
      return;
    }

    try {
      const figmaTools = new FigmaTools(token);
      await figmaTools.generateCodeFromFigma(
        options.file,
        options.output,
        options.framework
      );

      console.log('\n✅ 代码生成完成!');
    } catch (error) {
      console.error('❌ 生成失败:', error);
    }
  });

program
  .command('sync')
  .description('双向同步：Figma ↔ 代码')
  .requiredOption('-f, --file <key>', 'Figma 文件 key')
  .option('-o, --output <dir>', '输出目录', './src')
  .action(async (options) => {
    console.log('🔄 工作流: Figma ↔ 代码 双向同步\n');

    const token = process.env.FIGMA_TOKEN;

    if (!token) {
      console.error('❌ 未找到 FIGMA_TOKEN 环境变量');
      return;
    }

    try {
      const figmaTools = new FigmaTools(token);

      // 1. 从 Figma 提取设计规范
      console.log('📥 步骤 1: 从 Figma 提取设计规范');
      const specPath = './output/figma-spec.json';
      await figmaTools.extractDesignSpec(options.file, specPath);

      // 2. 生成代码
      console.log('\n💻 步骤 2: 生成代码');
      await figmaTools.generateCodeFromFigma(
        options.file,
        options.output,
        'react'
      );

      console.log('\n✅ 同步完成!');
    } catch (error) {
      console.error('❌ 同步失败:', error);
    }
  });

// ============================================================================
// 工具命令
// ============================================================================

program
  .command('info')
  .description('获取 Figma 文件信息')
  .requiredOption('-f, --file <key>', 'Figma 文件 key')
  .action(async (options) => {
    const token = process.env.FIGMA_TOKEN;

    if (!token) {
      console.error('❌ 未找到 FIGMA_TOKEN 环境变量');
      return;
    }

    try {
      const figmaTools = new FigmaTools(token);
      const info = await figmaTools.getFileInfo(options.file);

      console.log('\n📋 Figma 文件信息:');
      console.log(`   名称: ${info.name}`);
      console.log(`   Key: ${info.key}`);
      console.log(`   URL: ${info.url}`);
    } catch (error) {
      console.error('❌ 获取失败:', error);
    }
  });

program
  .command('init')
  .description('初始化项目配置')
  .action(() => {
    console.log('🚀 初始化 Claude Code + Figma 工作流\n');

    // 创建 .env 文件
    if (!fs.existsSync('.env')) {
      fs.writeFileSync('.env', fs.readFileSync('.env.example'));
      console.log('✅ 已创建 .env 文件');
    } else {
      console.log('ℹ️  .env 文件已存在');
    }

    // 创建输出目录
    const outputDir = './output';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`✅ 已创建输出目录: ${outputDir}`);
    }

    console.log('\n📝 下一步:');
    console.log('   1. 编辑 .env 文件，添加你的 Figma Token');
    console.log('   2. 创建 PRD 文件 (参考 prd-template.md)');
    console.log('   3. 运行工作流命令开始开发\n');
  });

// ============================================================================
// 完整工作流命令
// ============================================================================

program
  .command('workflow:design')
  .description('完整设计工作流: PRD → 设计规范 → HTML 原型 → Figma 格式')
  .option('-p, --prd <path>', 'PRD 文件路径', 'prd.md')
  .action(async (options) => {
    console.log('🎨 完整设计工作流\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    try {
      // 步骤 1: 生成设计规范
      console.log('📖 步骤 1/3: 从 PRD 生成设计规范');
      const prdPath = path.resolve(options.prd);

      if (!fs.existsSync(prdPath)) {
        console.error(`❌ PRD 文件不存在: ${prdPath}`);
        return;
      }

      const specGenerator = new DesignSpecGenerator(prdPath);
      const specPath = './output/design-spec.json';
      specGenerator.save(specPath);

      // 步骤 2: 生成 HTML 原型
      console.log('\n🖥️  步骤 2/3: 生成 HTML 原型');
      const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
      const htmlGenerator = new HTMLPrototypeGenerator(spec);
      const htmlPath = './output/prototype.html';
      htmlGenerator.save(htmlPath);

      // 步骤 3: 生成 Figma 格式
      console.log('\n📋 步骤 3/3: 生成 Figma 设计格式');
      const figmaTools = new FigmaTools(process.env.FIGMA_TOKEN || '');
      await figmaTools.createFigmaDesignFromSpec(specPath);

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n✅ 完整设计工作流执行完成!\n');
      console.log('📁 生成的文件:');
      console.log(`   - 设计规范: ${specPath}`);
      console.log(`   - HTML 原型: ${htmlPath}`);
      console.log(`   - Figma 格式: ${path.join(path.dirname(specPath), 'figma-design.json')}\n`);
    } catch (error) {
      console.error('\n❌ 工作流执行失败:', error);
    }
  });

program
  .command('workflow:develop')
  .description('完整开发工作流: Figma → 设计规范 → 代码')
  .requiredOption('-f, --file <key>', 'Figma 文件 key')
  .option('-o, --output <dir>', '输出目录', './src')
  .action(async (options) => {
    console.log('💻 完整开发工作流\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const token = process.env.FIGMA_TOKEN;

    if (!token) {
      console.error('❌ 未找到 FIGMA_TOKEN 环境变量');
      return;
    }

    try {
      const figmaTools = new FigmaTools(token);

      // 步骤 1: 提取设计规范
      console.log('📥 步骤 1/2: 从 Figma 提取设计规范');
      const specPath = './output/figma-spec.json';
      await figmaTools.extractDesignSpec(options.file, specPath);

      // 步骤 2: 生成代码
      console.log('\n💻 步骤 2/2: 生成代码');
      await figmaTools.generateCodeFromFigma(
        options.file,
        options.output,
        'react'
      );

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n✅ 完整开发工作流执行完成!\n');
      console.log('📁 生成的文件:');
      console.log(`   - 设计规范: ${specPath}`);
      console.log(`   - 代码目录: ${options.output}\n`);
    } catch (error) {
      console.error('\n❌ 工作流执行失败:', error);
    }
  });

// 解析命令行参数
program.parse(process.argv);

// 显示帮助信息（如果没有参数）
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
