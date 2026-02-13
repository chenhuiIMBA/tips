import fs from 'fs';
import path from 'path';
import { DesignSpec } from './generate-design-spec';

/**
 * HTML/Tailwind 原型生成器
 * 根据设计规范生成可转换为 Figma 的 HTML 原型
 */

export class HTMLPrototypeGenerator {
  private spec: DesignSpec;

  constructor(spec: DesignSpec) {
    this.spec = spec;
  }

  /**
   * 生成完整的 HTML 原型
   */
  generate(): string {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.spec.project.name} - Design Prototype</title>
  <script src="https://cdn.tailwindcss.com"></script>
  ${this.generateTailwindConfig()}
  <style>
    ${this.generateCustomStyles()}
  </style>
</head>
<body class="bg-gray-50 font-sans">
  ${this.generateHeader()}
  ${this.generateMainContent()}
  ${this.generateFooter()}
  ${this.generateComponentShowcase()}
</body>
</html>`;
  }

  /**
   * 生成 Tailwind 配置
   */
  private generateTailwindConfig(): string {
    const colors = this.spec.designSystem.colors;

    return `<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '${colors.primary[0]}',
            dark: '${colors.primary[1]}',
            darker: '${colors.primary[2]}',
          },
          secondary: {
            DEFAULT: '${colors.secondary[0]}',
            dark: '${colors.secondary[1]}',
            darker: '${colors.secondary[2]}',
          },
          semantic: {
            success: '${colors.semantic.success}',
            warning: '${colors.semantic.warning}',
            error: '${colors.semantic.error}',
            info: '${colors.semantic.info}',
          },
        },
        fontFamily: {
          sans: [${this.spec.designSystem.typography.fontFamily.primary}],
          serif: [${this.spec.designSystem.typography.fontFamily.secondary}],
          mono: [${this.spec.designSystem.typography.fontFamily.mono}],
        },
      }
    }
  }
</script>`;
  }

  /**
   * 生成自定义样式
   */
  private generateCustomStyles(): string {
    return `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: ${this.spec.designSystem.typography.fontFamily.primary};
  line-height: ${this.spec.designSystem.typography.lineHeight.normal};
}

/* 平滑过渡 */
* {
  transition: all 0.2s ease-in-out;
}

/* 交互状态 */
button:hover,
a:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}
`;
  }

  /**
   * 生成 Header
   */
  private generateHeader(): string {
    return `
<header class="bg-white shadow-sm sticky top-0 z-50">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <div class="flex-shrink-0">
        <h1 class="text-2xl font-bold text-primary">${this.spec.project.name}</h1>
      </div>

      <!-- Navigation -->
      <div class="hidden md:flex space-x-8">
        <a href="#features" class="text-gray-700 hover:text-primary">功能</a>
        <a href="#components" class="text-gray-700 hover:text-primary">组件</a>
        <a href="#screens" class="text-gray-700 hover:text-primary">页面</a>
      </div>

      <!-- CTA -->
      <div class="flex items-center space-x-4">
        <button class="text-gray-700 hover:text-primary">登录</button>
        <button class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
          开始使用
        </button>
      </div>
    </div>
  </nav>
</header>
`;
  }

  /**
   * 生成主要内容
   */
  private generateMainContent(): string {
    return `
<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  ${this.generateHeroSection()}
  ${this.generateFeaturesSection()}
</main>
`;
  }

  /**
   * 生成 Hero 区域
   */
  private generateHeroSection(): string {
    return `
<section id="features" class="text-center py-20">
  <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
    欢迎使用 ${this.spec.project.name}
  </h2>
  <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
    ${this.spec.project.description}
  </p>
  <div class="flex justify-center space-x-4">
    <button class="bg-primary text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary-dark">
      立即开始
    </button>
    <button class="border-2 border-primary text-primary px-8 py-3 rounded-lg text-lg font-medium hover:bg-primary hover:text-white">
      了解更多
    </button>
  </div>
</section>
`;
  }

  /**
   * 生成功能区域
   */
  private generateFeaturesSection(): string {
    return `
<section class="py-16">
  <h3 class="text-3xl font-bold text-center mb-12">核心功能</h3>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    ${this.generateFeatureCard('功能 1', '功能描述文本', '🚀')}
    ${this.generateFeatureCard('功能 2', '功能描述文本', '💡')}
    ${this.generateFeatureCard('功能 3', '功能描述文本', '⚡')}
  </div>
</section>
`;
  }

  /**
   * 生成功能卡片
   */
  private generateFeatureCard(title: string, description: string, icon: string): string {
    return `
<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg">
  <div class="text-4xl mb-4">${icon}</div>
  <h4 class="text-xl font-semibold mb-2">${title}</h4>
  <p class="text-gray-600">${description}</p>
</div>
`;
  }

  /**
   * 生成 Footer
   */
  private generateFooter(): string {
    return `
<footer class="bg-gray-900 text-white py-12 mt-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h5 class="text-lg font-semibold mb-4">${this.spec.project.name}</h5>
        <p class="text-gray-400">${this.spec.project.description}</p>
      </div>
      <div>
        <h5 class="text-lg font-semibold mb-4">产品</h5>
        <ul class="space-y-2">
          <li><a href="#" class="text-gray-400 hover:text-white">功能</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white">定价</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white">更新</a></li>
        </ul>
      </div>
      <div>
        <h5 class="text-lg font-semibold mb-4">资源</h5>
        <ul class="space-y-2">
          <li><a href="#" class="text-gray-400 hover:text-white">文档</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white">API</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white">社区</a></li>
        </ul>
      </div>
      <div>
        <h5 class="text-lg font-semibold mb-4">公司</h5>
        <ul class="space-y-2">
          <li><a href="#" class="text-gray-400 hover:text-white">关于</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white">博客</a></li>
          <li><a href="#" class="text-gray-400 hover:text-white">联系</a></li>
        </ul>
      </div>
    </div>
    <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
      <p>&copy; 2024 ${this.spec.project.name}. All rights reserved.</p>
    </div>
  </div>
</footer>
`;
  }

  /**
   * 生成组件展示区
   */
  private generateComponentShowcase(): string {
    return `
<section id="components" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
  <h2 class="text-3xl font-bold text-center mb-12">组件库</h2>

  <!-- Buttons -->
  <div class="mb-12">
    <h3 class="text-2xl font-semibold mb-6">按钮</h3>
    <div class="flex flex-wrap gap-4">
      ${this.generateButton('Primary Button', 'primary')}
      ${this.generateButton('Secondary Button', 'secondary')}
      ${this.generateButton('Success Button', 'success')}
      ${this.generateButton('Danger Button', 'danger')}
    </div>
  </div>

  <!-- Inputs -->
  <div class="mb-12">
    <h3 class="text-2xl font-semibold mb-6">输入框</h3>
    <div class="max-w-md space-y-4">
      ${this.generateInput('默认输入框', 'placeholder', 'text')}
      ${this.generateInput('带标签', '输入内容', 'email', '邮箱地址')}
      ${this.generateInput('禁用状态', '', 'text', '', true)}
    </div>
  </div>

  <!-- Cards -->
  <div class="mb-12">
    <h3 class="text-2xl font-semibold mb-6">卡片</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      ${this.generateCard('卡片标题', '卡片内容描述文本')}
      ${this.generateCard('功能卡片', '这是另一个卡片的描述')}
      ${this.generateCard('更多信息', '第三个卡片的示例内容')}
    </div>
  </div>
</section>
`;
  }

  /**
   * 生成按钮
   */
  private generateButton(text: string, variant: string): string {
    const variantClasses = {
      primary: 'bg-primary text-white hover:bg-primary-dark',
      secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
      success: 'bg-semantic-success text-white hover:opacity-90',
      danger: 'bg-semantic-error text-white hover:opacity-90',
    };

    return `
<button class="px-6 py-2 rounded-lg font-medium ${variantClasses[variant as keyof typeof variantClasses]}">
  ${text}
</button>
`;
  }

  /**
   * 生成输入框
   */
  private generateInput(
    placeholder: string,
    value: string,
    type: string = 'text',
    label?: string,
    disabled: boolean = false
  ): string {
    const disabledAttr = disabled ? 'disabled' : '';
    const disabledClass = disabled ? 'bg-gray-100 cursor-not-allowed' : '';

    return label ? `
<div>
  <label class="block text-sm font-medium text-gray-700 mb-1">${label}</label>
  <input
    type="${type}"
    placeholder="${placeholder}"
    value="${value}"
    ${disabledAttr}
    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${disabledClass}"
  />
</div>
` : `
<input
  type="${type}"
  placeholder="${placeholder}"
  value="${value}"
  ${disabledAttr}
  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${disabledClass}"
/>
`;
  }

  /**
   * 生成卡片
   */
  private generateCard(title: string, content: string): string {
    return `
<div class="bg-white rounded-lg shadow-md p-6">
  <h4 class="text-lg font-semibold mb-2">${title}</h4>
  <p class="text-gray-600">${content}</p>
</div>
`;
  }

  /**
   * 保存 HTML 原型到文件
   */
  save(outputPath: string): void {
    const html = this.generate();
    const dir = path.dirname(outputPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, html);
    console.log(`✅ HTML 原型已生成: ${outputPath}`);
  }
}
