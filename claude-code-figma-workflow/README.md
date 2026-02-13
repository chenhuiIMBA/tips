# Claude Code + Figma 工作流工具

完整的 Claude Code 与 Figma 集成解决方案，实现从 PRD 到设计，再到代码的全流程自动化。

---

## 目录

1. [功能特性](#1-功能特性)
2. [安装](#2-安装)
3. [快速开始](#3-快速开始)
4. [工作流程](#4-工作流程)
5. [命令参考](#5-命令参考)
6. [最佳实践](#6-最佳实践)
7. [常见问题](#7-常见问题)

---

## 1. 功能特性

### 工作流 1: PRD → Figma 设计稿

- ✅ 从 PRD 自动生成设计规范
- ✅ 生成 HTML/Tailwind 原型
- ✅ 导出 Figma 兼容格式

### 工作流 2: Figma 设计稿 → 代码

- ✅ 从 Figma 提取设计规范
- ✅ 自动生成 React/Vue/HTML 代码
- ✅ 双向同步设计变更

---

## 2. 安装

### 2.1 前置要求

- Node.js >= 18
- npm 或 yarn
- Figma 账号

### 2.2 安装依赖

```bash
cd claude-code-figma-workflow
npm install
```

### 2.3 配置 Figma Token

1. 访问 https://www.figma.com/settings
2. 滚动到 "Personal Access Tokens"
3. 点击 "Create new token"
4. 复制 token 并添加到 `.env` 文件:

```bash
cp .env.example .env
```

编辑 `.env`:

```env
FIGMA_TOKEN=your_figma_token_here
```

### 2.4 构建项目

```bash
npm run build
```

---

## 3. 快速开始

### 3.1 初始化项目

```bash
npm run dev init
```

这将创建：
- `.env` 配置文件
- `./output` 输出目录

### 3.2 创建 PRD

参考模板创建 PRD 文件:

```bash
cp prd-template.md my-project-prd.md
# 编辑 my-project-prd.md
```

---

## 4. 工作流程

### 工作流 1: 从 PRD 生成 Figma 设计

```bash
# 完整工作流（推荐）
npm run dev workflow:design -- -p my-project-prd.md

# 或分步执行
npm run dev generate-spec -- -p my-project-prd.md       # 1. 生成设计规范
npm run dev generate-prototype                          # 2. 生成 HTML 原型
npm run dev create-figma                                # 3. 生成 Figma 格式
```

**输出文件**:
- `./output/design-spec.json` - 设计规范
- `./output/prototype.html` - HTML 原型
- `./output/figma-design.json` - Figma 设计格式

**导入 Figma**:
1. 在 Figma 创建新文件
2. 使用插件 "Design Data Importer"
3. 导入 `figma-design.json`

---

### 工作流 2: 从 Figma 生成代码

```bash
# 完整工作流（推荐）
npm run dev workflow:develop -- -f your_figma_file_key

# 或分步执行
npm run dev extract-spec -- -f your_figma_file_key      # 1. 提取设计规范
npm run dev generate-code -- -f your_figma_file_key      # 2. 生成代码
```

**获取 Figma File Key**:
从 URL 中提取: `https://figma.com/file/{FILE_KEY}/...`

**输出文件**:
- `./output/figma-spec.json` - Figma 设计规范
- `./src/components/` - 生成的组件代码

---

## 5. 命令参考

### 5.1 初始化

```bash
npm run dev init
```

初始化项目配置。

---

### 5.2 设计规范生成

```bash
npm run dev generate-spec -p <prd-file> -o <output-dir>
```

**参数**:
- `-p, --prd <path>` - PRD 文件路径 (默认: prd.md)
- `-o, --output <path>` - 输出目录 (默认: ./output)

---

### 5.3 HTML 原型生成

```bash
npm run dev generate-prototype -s <spec-file> -o <output-dir>
```

**参数**:
- `-s, --spec <path>` - 设计规范文件路径 (默认: ./output/design-spec.json)
- `-o, --output <path>` - 输出目录 (默认: ./output)

---

### 5.4 Figma 设计格式生成

```bash
npm run dev create-figma -s <spec-file> -o <output-dir>
```

**参数**:
- `-s, --spec <path>` - 设计规范文件路径
- `-o, --output <path>` - 输出目录

---

### 5.5 从 Figma 提取设计规范

```bash
npm run dev extract-spec -f <file-key> -o <output-file>
```

**参数**:
- `-f, --file <key>` - Figma 文件 key (必需)
- `-o, --output <path>` - 输出文件路径 (默认: ./output/figma-spec.json)

---

### 5.6 从 Figma 生成代码

```bash
npm run dev generate-code -f <file-key> -o <output-dir> -fw <framework>
```

**参数**:
- `-f, --file <key>` - Figma 文件 key (必需)
- `-o, --output <dir>` - 输出目录 (默认: ./src/components)
- `-fw, --framework <name>` - 框架 (react/vue/html, 默认: react)

---

### 5.7 双向同步

```bash
npm run dev sync -f <file-key> -o <output-dir>
```

**参数**:
- `-f, --file <key>` - Figma 文件 key (必需)
- `-o, --output <dir>` - 输出目录 (默认: ./src)

---

### 5.8 获取 Figma 文件信息

```bash
npm run dev info -f <file-key>
```

**参数**:
- `-f, --file <key>` - Figma 文件 key (必需)

---

### 5.9 完整工作流

#### 设计工作流

```bash
npm run dev workflow:design -p <prd-file>
```

**参数**:
- `-p, --prd <path>` - PRD 文件路径 (默认: prd.md)

#### 开发工作流

```bash
npm run dev workflow:develop -f <file-key> -o <output-dir>
```

**参数**:
- `-f, --file <key>` - Figma 文件 key (必需)
- `-o, --output <dir>` - 输出目录 (默认: ./src)

---

## 6. 最佳实践

### 6.1 PRD 编写

1. 使用提供的 `prd-template.md` 模板
2. 详细描述功能需求
3. 明确设计风格要求
4. 提供竞品参考

### 6.2 设计规范管理

1. 将 `design-spec.json` 纳入版本控制
2. 使用语义化版本管理设计变更
3. 定期与 Figma 同步

### 6.3 代码生成

1. 生成代码后进行 Code Review
2. 根据实际需求调整组件
3. 添加必要的业务逻辑

### 6.4 团队协作

1. 设计师使用 Figma 进行设计
2. 开发使用工具生成代码框架
3. 双方通过 Git 协作管理设计规范

---

## 7. 常见问题

### Q1: 如何获取 Figma File Key?

从 URL 中提取:
```
https://figma.com/file/ABCD1234/EFGH5678
                    ↑↑↑↑↑↑↑↑
                    File Key
```

### Q2: Figma Token 无效怎么办?

1. 检查 token 是否过期（有效期 30 天）
2. 重新生成 token
3. 确保 token 有正确的权限

### Q3: 生成的代码需要手动调整吗?

是的，生成的代码提供基础框架，需要：
- 添加业务逻辑
- 优化性能
- 完善错误处理
- 添加测试

### Q4: 如何自定义设计规范?

编辑 `design-spec.json` 文件，调整：
- 颜色系统
- 字体系统
- 间距系统
- 组件规范

---

## 贡献

欢迎提交 Issue 和 Pull Request！

---

## 许可证

ISC

---

## 联系方式

如有问题，请提交 Issue 或联系维护者。

---

**版本**: 1.0.0
**最后更新**: 2024
