import { Api } from 'figma-api';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Figma 工具集
 * 用于与 Figma API 交互
 */

export class FigmaTools {
  private client: Api;
  private token: string;

  constructor(token: string) {
    this.token = token;
    this.client = new Api({ personalAccessToken: token });
  }

  /**
   * 工作流 1: 从设计规范创建 Figma 文件
   */
  async createFigmaDesignFromSpec(specPath: string): Promise<string> {
    console.log('📖 读取设计规范...');
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));

    console.log('🎨 创建 Figma 设计文件...');
    // 注意: Figma API 不支持直接创建文件，需要使用 Figma Plugin
    // 这里我们生成一个可以被 Figma Plugin 读取的格式

    const figmaDesign = this.convertToFigmaFormat(spec);
    const outputPath = path.join(
      path.dirname(specPath),
      'figma-design.json'
    );

    fs.writeFileSync(outputPath, JSON.stringify(figmaDesign, null, 2));
    console.log(`✅ Figma 设计格式已生成: ${outputPath}`);
    console.log('');
    console.log('📋 下一步操作:');
    console.log('1. 在 Figma 中创建新文件');
    console.log('2. 安装 Figma Plugin: "Design Data Importer"');
    console.log('3. 导入生成的 figma-design.json 文件');

    return outputPath;
  }

  /**
   * 将设计规范转换为 Figma 格式
   */
  private convertToFigmaFormat(spec: any): any {
    return {
      version: '1.0',
      meta: {
        name: spec.project.name,
        description: spec.project.description,
      },
      designSystem: {
        colors: this.createColorVariables(spec.designSystem.colors),
        typography: this.createTypographyStyles(spec.designSystem.typography),
        effects: this.createEffectStyles(spec.designSystem),
      },
      components: this.createComponentNodes(spec.components),
      screens: this.createScreenNodes(spec.screens),
    };
  }

  /**
   * 创建颜色变量
   */
  private createColorVariables(colors: any): any[] {
    const variables: any[] = [];

    // Primary colors
    colors.primary.forEach((color: string, index: number) => {
      variables.push({
        name: `color/primary/${index === 0 ? 'base' : index * 100}`,
        type: 'COLOR',
        value: this.hexToRgb(color),
      });
    });

    // Secondary colors
    colors.secondary.forEach((color: string, index: number) => {
      variables.push({
        name: `color/secondary/${index === 0 ? 'base' : index * 100}`,
        type: 'COLOR',
        value: this.hexToRgb(color),
      });
    });

    // Semantic colors
    Object.entries(colors.semantic).forEach(([name, color]) => {
      variables.push({
        name: `color/semantic/${name}`,
        type: 'COLOR',
        value: this.hexToRgb(color as string),
      });
    });

    return variables;
  }

  /**
   * 创建文本样式
   */
  private createTypographyStyles(typography: any): any[] {
    const styles: any[] = [];

    Object.entries(typography.fontSize).forEach(([name, size]) => {
      styles.push({
        name: `typography/${name}`,
        type: 'TEXT',
        value: {
          fontFamily: typography.fontFamily.primary,
          fontSize: parseFloat(String(size)) * 16, // rem to px
          fontWeight: typography.fontWeight.medium,
          lineHeight: {
            value: typography.lineHeight.normal * 100,
            unit: 'PERCENT',
          },
        },
      });
    });

    return styles;
  }

  /**
   * 创建效果样式
   */
  private createEffectStyles(designSystem: any): any[] {
    return Object.entries(designSystem.shadows).map(([name, shadow]) => ({
      name: `effect/shadow/${name}`,
      type: 'EFFECT',
      value: [
        {
          type: 'DROP_SHADOW',
          color: { r: 0, g: 0, b: 0, a: 0.1 },
          offset: { x: 0, y: parseInt(String(shadow).split(' ')[1] || '4') },
          radius: parseInt(String(shadow).split(' ')[3] || '10'),
        },
      ],
    }));
  }

  /**
   * 创建组件节点
   */
  private createComponentNodes(components: any[]): any[] {
    return components.map((component) => ({
      type: 'COMPONENT',
      name: component.name,
      description: `${component.type} component`,
      children: component.variants.map((variant: any) => ({
        type: 'COMPONENT_SET',
        name: variant.name,
        description: variant.description,
        properties: variant.props,
        style: variant.style,
      })),
    }));
  }

  /**
   * 创建页面节点
   */
  private createScreenNodes(screens: any[]): any[] {
    return screens.map((screen) => ({
      type: 'FRAME',
      name: screen.name,
      width: screen.width,
      height: screen.height,
      layout: screen.layout,
      children: screen.layout.sections.map((section: any) => ({
        type: 'FRAME',
        name: section.name,
        layout: section.layout,
      })),
    }));
  }

  /**
   * 工作流 2: 从 Figma 提取设计规范
   */
  async extractDesignSpec(fileKey: string, outputPath: string): Promise<any> {
    console.log('📥 从 Figma 获取文件信息...');

    try {
      const file = await this.client.getFile({ file_key: fileKey });

      console.log(`✅ 成功获取文件: ${file.name}`);

      const designSpec = {
        project: {
          name: file.name,
          version: file.version,
          lastModified: file.lastModified,
        },
        designSystem: await this.extractDesignSystem(file),
        components: await this.extractComponents(file),
        screens: await this.extractScreens(file),
      };

      fs.writeFileSync(outputPath, JSON.stringify(designSpec, null, 2));
      console.log(`✅ 设计规范已提取: ${outputPath}`);

      return designSpec;
    } catch (error) {
      console.error('❌ 提取失败:', error);
      throw error;
    }
  }

  /**
   * 从 Figma 文件提取设计系统
   */
  private async extractDesignSystem(file: any): Promise<any> {
    // TODO: 实现从 Figma 文件节点中提取设计系统
    return {
      colors: {},
      typography: {},
      spacing: {},
    };
  }

  /**
   * 从 Figma 文件提取组件
   */
  private async extractComponents(file: any): Promise<any[]> {
    // TODO: 实现从 Figma 文件节点中提取组件
    return [];
  }

  /**
   * 从 Figma 文件提取页面
   */
  private async extractScreens(file: any): Promise<any[]> {
    // TODO: 实现从 Figma 文件节点中提取页面
    return [];
  }

  /**
   * 工作流 2: 从 Figma 生成代码
   */
  async generateCodeFromFigma(
    fileKey: string,
    outputDir: string,
    framework: 'react' | 'vue' | 'html' = 'react'
  ): Promise<void> {
    console.log('📥 从 Figma 获取设计...');

    try {
      const file = await this.client.getFile({ file_key: fileKey });

      console.log(`✅ 成功获取文件: ${file.name}`);

      // 提取组件并生成代码
      const components = this.extractComponentCode(file, framework);

      // 保存到输出目录
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      components.forEach((component) => {
        const filePath = path.join(outputDir, component.fileName);
        fs.writeFileSync(filePath, component.code);
        console.log(`✅ 已生成: ${filePath}`);
      });

      console.log(`\n✅ 代码生成完成! 共 ${components.length} 个文件`);
    } catch (error) {
      console.error('❌ 代码生成失败:', error);
      throw error;
    }
  }

  /**
   * 从 Figma 文件提取组件代码
   */
  private extractComponentCode(file: any, framework: string): any[] {
    // TODO: 实现根据框架生成不同的代码
    const components: any[] = [];

    // 遍历 Figma 节点，提取组件
    if (file.document) {
      this.traverseNodes(file.document, (node) => {
        if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
          const code = this.generateComponentCode(node, framework);
          components.push({
            fileName: `${this.kebabCase(node.name)}.tsx`,
            code: code,
          });
        }
      });
    }

    return components;
  }

  /**
   * 生成组件代码
   */
  private generateComponentCode(node: any, framework: string): string {
    if (framework === 'react') {
      return this.generateReactComponent(node);
    } else if (framework === 'vue') {
      return this.generateVueComponent(node);
    } else {
      return this.generateHTMLComponent(node);
    }
  }

  /**
   * 生成 React 组件
   */
  private generateReactComponent(node: any): string {
    // 简化的 React 组件生成
    return `import React from 'react';

interface ${this.pascalCase(node.name)}Props {
  // TODO: 从 Figma 提取 props
}

export const ${this.pascalCase(node.name)}: React.FC<${this.pascalCase(node.name)}Props> = (props) => {
  return (
    <div>
      {/* TODO: 从 Figma 节点生成 JSX */}
    </div>
  );
};
`;
  }

  /**
   * 生成 Vue 组件
   */
  private generateVueComponent(node: any): string {
    return `<template>
  <div>
    <!-- TODO: 从 Figma 节点生成 template -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: '${this.pascalCase(node.name)}',
  // TODO: 从 Figma 提取 props
});
</script>
`;
  }

  /**
   * 生成 HTML 组件
   */
  private generateHTMLComponent(node: any): string {
    return `<!-- ${node.name} -->
<div class="${this.kebabCase(node.name)}">
  <!-- TODO: 从 Figma 节点生成 HTML -->
</div>
`;
  }

  /**
   * 遍历 Figma 节点
   */
  private traverseNodes(node: any, callback: (node: any) => void): void {
    callback(node);

    if (node.children) {
      node.children.forEach((child: any) => {
        this.traverseNodes(child, callback);
      });
    }
  }

  /**
   * 工具函数
   */

  /**
   * Hex 转 RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number; a: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: 1,
        }
      : { r: 0, g: 0, b: 0, a: 1 };
  }

  /**
   * Pascal Case
   */
  private pascalCase(str: string): string {
    return str
      .split(/[-\s]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  /**
   * Kebab Case
   */
  private kebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  /**
   * 获取文件信息
   */
  async getFileInfo(fileKey: string): Promise<any> {
    const file = await this.client.getFile({ file_key: fileKey });
    return {
      name: file.name,
      key: fileKey,
      url: `https://www.figma.com/file/${fileKey}`,
    };
  }
}
