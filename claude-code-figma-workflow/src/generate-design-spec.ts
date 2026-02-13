import fs from 'fs';
import path from 'path';

/**
 * 设计规范生成器
 * 根据 PRD 生成 Figma 设计规范
 */

export interface DesignSpec {
  project: {
    name: string;
    version: string;
    description: string;
  };
  designSystem: {
    colors: {
      primary: string[];
      secondary: string[];
      neutral: string[];
      semantic: {
        success: string;
        warning: string;
        error: string;
        info: string;
      };
    };
    typography: {
      fontFamily: {
        primary: string;
        secondary: string;
        mono: string;
      };
      fontSize: {
        xs: string;
        sm: string;
        base: string;
        lg: string;
        xl: string;
        '2xl': string;
        '3xl': string;
        '4xl': string;
      };
      fontWeight: {
        normal: number;
        medium: number;
        semibold: number;
        bold: number;
      };
      lineHeight: {
        tight: number;
        normal: number;
        relaxed: number;
      };
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    borderRadius: {
      none: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
  components: ComponentSpec[];
  screens: ScreenSpec[];
}

export interface ComponentSpec {
  name: string;
  type: 'button' | 'input' | 'card' | 'modal' | 'navigation' | 'other';
  variants: ComponentVariant[];
}

export interface ComponentVariant {
  name: string;
  description: string;
  states: string[];
  props: Record<string, any>;
  style: {
    width?: string;
    height?: string;
    padding?: string;
    backgroundColor?: string;
    color?: string;
    border?: string;
    borderRadius?: string;
    fontSize?: string;
    fontWeight?: number;
    boxShadow?: string;
  };
}

export interface ScreenSpec {
  name: string;
  type: 'mobile' | 'tablet' | 'desktop';
  width: number;
  height: number;
  layout: {
    sections: Section[];
  };
}

export interface Section {
  name: string;
  type: 'header' | 'hero' | 'content' | 'sidebar' | 'footer' | 'other';
  components: string[];
  layout: {
    direction: 'row' | 'column';
    align: 'start' | 'center' | 'end' | 'stretch';
    justify: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
    gap: string;
  };
}

/**
 * 根据项目风格生成设计规范
 */
export class DesignSpecGenerator {
  private prd: any;

  constructor(prdPath: string) {
    const prdContent = fs.readFileSync(prdPath, 'utf-8');
    // TODO: 解析 PRD（支持 Markdown 或 JSON）
    this.prd = this.parsePRD(prdContent);
  }

  private parsePRD(content: string): any {
    // 简单的 PRD 解析逻辑
    // 实际使用时可以用更复杂的解析器
    return {
      projectName: 'My App',
      style: 'modern',
      colorScheme: 'neutral',
    };
  }

  /**
   * 生成设计规范
   */
  generate(): DesignSpec {
    const spec: DesignSpec = {
      project: {
        name: this.prd.projectName || 'My App',
        version: '1.0.0',
        description: 'Design specification for Figma',
      },
      designSystem: this.generateDesignSystem(),
      components: this.generateComponents(),
      screens: this.generateScreens(),
    };

    return spec;
  }

  /**
   * 生成设计系统（颜色、字体、间距等）
   */
  private generateDesignSystem() {
    return {
      colors: {
        primary: ['#3B82F6', '#2563EB', '#1D4ED8'],
        secondary: ['#8B5CF6', '#7C3AED', '#6D28D9'],
        neutral: ['#F9FAFB', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#374151', '#1F2937', '#111827'],
        semantic: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
      },
      typography: {
        fontFamily: {
          primary: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          secondary: 'Georgia, serif',
          mono: 'Monaco, Consolas, monospace',
        },
        fontSize: {
          xs: '0.75rem',    // 12px
          sm: '0.875rem',   // 14px
          base: '1rem',     // 16px
          lg: '1.125rem',   // 18px
          xl: '1.25rem',    // 20px
          '2xl': '1.5rem',  // 24px
          '3xl': '1.875rem', // 30px
          '4xl': '2.25rem',  // 36px
        },
        fontWeight: {
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
        },
        lineHeight: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75,
        },
      },
      spacing: {
        xs: '0.25rem',  // 4px
        sm: '0.5rem',   // 8px
        md: '1rem',     // 16px
        lg: '1.5rem',   // 24px
        xl: '2rem',     // 32px
        '2xl': '3rem',  // 48px
        '3xl': '4rem',  // 64px
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',   // 2px
        md: '0.375rem',   // 6px
        lg: '0.5rem',     // 8px
        xl: '0.75rem',    // 12px
        full: '9999px',
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    };
  }

  /**
   * 生成组件规范
   */
  private generateComponents(): ComponentSpec[] {
    return [
      {
        name: 'Button',
        type: 'button',
        variants: [
          {
            name: 'Primary',
            description: '主要操作按钮',
            states: ['default', 'hover', 'active', 'disabled'],
            props: {
              variant: 'primary',
            },
            style: {
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3B82F6',
              color: '#FFFFFF',
              borderRadius: '0.375rem',
              fontWeight: 500,
              fontSize: '0.875rem',
            },
          },
          {
            name: 'Secondary',
            description: '次要操作按钮',
            states: ['default', 'hover', 'active', 'disabled'],
            props: {
              variant: 'secondary',
            },
            style: {
              padding: '0.75rem 1.5rem',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              border: '1px solid #D1D5DB',
              borderRadius: '0.375rem',
              fontWeight: 500,
              fontSize: '0.875rem',
            },
          },
        ],
      },
      {
        name: 'Input',
        type: 'input',
        variants: [
          {
            name: 'Default',
            description: '默认输入框',
            states: ['default', 'focus', 'error', 'disabled'],
            props: {},
            style: {
              padding: '0.625rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            },
          },
        ],
      },
      {
        name: 'Card',
        type: 'card',
        variants: [
          {
            name: 'Default',
            description: '默认卡片',
            states: ['default', 'hover'],
            props: {},
            style: {
              padding: '1.5rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
          },
        ],
      },
    ];
  }

  /**
   * 生成页面规范
   */
  private generateScreens(): ScreenSpec[] {
    return [
      {
        name: 'Desktop',
        type: 'desktop',
        width: 1440,
        height: 900,
        layout: {
          sections: [
            {
              name: 'Header',
              type: 'header',
              components: ['Logo', 'Navigation', 'UserMenu'],
              layout: {
                direction: 'row',
                align: 'center',
                justify: 'space-between',
                gap: '1rem',
              },
            },
            {
              name: 'Main Content',
              type: 'content',
              components: ['Hero', 'FeatureList', 'CTA'],
              layout: {
                direction: 'column',
                align: 'stretch',
                justify: 'start',
                gap: '2rem',
              },
            },
            {
              name: 'Footer',
              type: 'footer',
              components: ['Links', 'Copyright'],
              layout: {
                direction: 'row',
                align: 'center',
                justify: 'space-between',
                gap: '1rem',
              },
            },
          ],
        },
      },
      {
        name: 'Mobile',
        type: 'mobile',
        width: 375,
        height: 812,
        layout: {
          sections: [
            {
              name: 'Header',
              type: 'header',
              components: ['Logo', 'MenuButton'],
              layout: {
                direction: 'row',
                align: 'center',
                justify: 'space-between',
                gap: '0.5rem',
              },
            },
            {
              name: 'Main Content',
              type: 'content',
              components: ['Hero', 'FeatureList', 'CTA'],
              layout: {
                direction: 'column',
                align: 'stretch',
                justify: 'start',
                gap: '1rem',
              },
            },
            {
              name: 'Footer',
              type: 'footer',
              components: ['Links', 'Copyright'],
              layout: {
                direction: 'column',
                align: 'center',
                justify: 'center',
                gap: '0.5rem',
              },
            },
          ],
        },
      },
    ];
  }

  /**
   * 保存设计规范到文件
   */
  save(outputPath: string): void {
    const spec = this.generate();
    const dir = path.dirname(outputPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));
    console.log(`✅ 设计规范已生成: ${outputPath}`);
  }

  /**
   * 生成 Figma 兼容的格式
   */
  generateForFigma(): any {
    const spec = this.generate();

    // 转换为 Figma Plugin API 格式
    return {
      document: {
        type: 'DOCUMENT',
        children: [
          {
            type: 'CANVAS',
            name: 'Design System',
            children: this.generateFigmaDesignSystem(spec),
          },
          {
            type: 'CANVAS',
            name: 'Screens',
            children: this.generateFigmaScreens(spec),
          },
        ],
      },
    };
  }

  private generateFigmaDesignSystem(spec: DesignSpec): any[] {
    // TODO: 实现转换为 Figma 节点格式
    return [];
  }

  private generateFigmaScreens(spec: DesignSpec): any[] {
    // TODO: 实现转换为 Figma 节点格式
    return [];
  }
}
