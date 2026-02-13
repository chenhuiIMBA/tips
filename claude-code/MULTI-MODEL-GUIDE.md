# Multi-Model 命令完整使用指南

> Claude Code 多模型协作系统配置与使用

---

## 目录

1. [系统概述](#1-系统概述)
2. [多模型切换机制](#2-多模型切换机制)
3. [环境搭建](#3-环境搭建)
4. [配置步骤](#4-配置步骤)
5. [使用指南](#5-使用指南)
6. [工作流程详解](#6-工作流程详解)
7. [故障排查](#7-故障排查)
8. [最佳实践](#8-最佳实践)

---

## 1. 系统概述

### 1.1 什么是 Multi-Model 命令

`/multi*` 命令是一套**多模型协作系统**，通过调用外部 AI 模型（Codex 和 Gemini）来增强 Claude Code 的能力。

### 1.2 核心架构

```
┌──────────────────────────────────────────────────────────────┐
│                        Claude Code                            │
│                    (协调者 Orchestrator)                        │
│                                                                  │
│  职责：                                                            │
│  - 任务调度和分发                                                  │
│  - 文件系统写入管理（唯一写入权限）                                 │
│  - 多模型协调和上下文管理                                          │
│  - 最终代码重构和质量控制                                          │
└────────────────────┬─────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │  codeagent-wrapper     │  (模型调用工具)
         └───────┬───────┬───────┘
                 │       │
         ┌───────▼┐  ┌─▼──────────┐
         │ Codex │  │  Gemini   │
         │(后端) │  │  (前端)   │
         └───────┘  └───────────┘
```

### 1.3 可用命令

| 命令                | 功能说明   | 适用场景                |
| ----------------- | ------ | ------------------- |
| `/multi-frontend` | 前端专注模式 | UI 组件、React/Next.js |
| `/multi-backend`  | 后端专注模式 | API、数据库、业务逻辑        |
| `/multi-plan`     | 多模型规划  | 复杂功能设计              |
| `/multi-execute`  | 执行计划   | 实现生成的计划             |
| `/multi-workflow` | 通用工作流  | 自定义代理序列             |

---

## 2. 多模型切换机制

### 2.1 模型分工

| 模型         | 擅长领域                 | 权威性  |
| ---------- | -------------------- | ---- |
| **Codex**  | 后端逻辑、算法实现、API 设计、数据库 | 后端权威 |
| **Gemini** | 前端 UI/UX、组件设计、交互体验   | 前端权威 |

### 2.2 切换规则

```
任务类型检测
    │
    ├─ Frontend 任务 → Gemini
    │   (页面、组件、样式、布局)
    │
    ├─ Backend 任务 → Codex
    │   (API、接口、数据库、算法)
    │
    └─ Fullstack 任务 → Codex ∥ Gemini 并行
        (前后端同时开发)
```

### 2.3 信任规则

```
Frontend 开发：
  - Gemini 的前端意见 → 信任 ✅
  - Codex 的前端意见 → 仅参考 ⚠️

Backend 开发：
  - Codex 的后端意见 → 信任 ✅
  - Gemini 的后端意见 → 仅参考 ⚠️
```

### 2.4 Session 复用机制

```
第一次调用
    ↓
codeagent-wrapper --backend gemini - "$PWD"
    ↓
返回: SESSION_ID: abc123
    ↓
后续调用（复用上下文）
    ↓
codeagent-wrapper --backend gemini resume abc123 - "$PWD"
```

---

## 3. 环境搭建

### 3.1 系统要求

| 要求项             | 说明                                     |
| --------------- | -------------------------------------- |
| **操作系统**        | Windows / macOS / Linux                |
| **Claude Code** | 最新版本                                   |
| **Node.js**     | v18+ (用于运行 codeagent-wrapper)          |
| **Python**      | v3.8+ (可选，用于某些工具)                      |
| **API Keys**    | OpenAI API (Codex)、Google API (Gemini) |

### 3.2 安装 codeagent-wrapper

> ⚠️ **注意**: `codeagent-wrapper` 不是 everything-claude-code 插件自带的，需要单独安装。

#### 选项 1: 从源码安装

```bash
# 克隆仓库（示例，实际仓库地址可能不同）
git clone https://github.com/your-repo/codeagent-wrapper.git
cd codeagent-wrapper

# 安装依赖
npm install

# 链接到全局
npm link
# 或复制到 Claude bin 目录
cp codeagent-wrapper ~/.claude/bin/

# 赋予执行权限
chmod +x ~/.claude/bin/codeagent-wrapper
```

#### 选项 2: 使用 npm 全局安装（如果可用）

```bash
npm install -g codeagent-wrapper
```

### 3.3 配置 API Keys

#### OpenAI API (Codex)

```bash
# 设置环境变量
echo 'export OPENAI_API_KEY="sk-proj-xxxxx"' >> ~/.bashrc
echo 'export OPENAI_API_KEY="sk-proj-xxxxx"' >> ~/.zshrc
source ~/.bashrc  # 或 source ~/.zshrc
```

#### Google API (Gemini)

```bash
# 设置环境变量
echo 'export GOOGLE_API_KEY="AIzaSyxxxxx"' >> ~/.bashrc
echo 'export GOOGLE_API_KEY="AIzaSyxxxxx"' >> ~/.zshrc
source ~/.bashrc
```

### 3.4 安装 Role Prompts

Role Prompts 定义了各模型在不同阶段的角色和行为。

```bash
# 创建 prompts 目录
mkdir -p ~/.claude/.ccg/prompts/{codex,gemini}

# 下载或创建 Role Prompts
# 这些文件通常由 codeagent-wrapper 项目提供
# 示例路径：
# ~/.claude/.ccg/prompts/codex/analyzer.md
# ~/.claude/.ccg/prompts/codex/architect.md
# ~/.claude/.ccg/prompts/codex/reviewer.md
# ~/.claude/.ccg/prompts/gemini/analyzer.md
# ~/.claude/.ccg/prompts/gemini/architect.md
# ~/.claude/.ccg/prompts/gemini/reviewer.md
# ~/.claude/.ccg/prompts/gemini/frontend.md
```

---

## 4. 配置步骤

### 4.1 安装 everything-claude-code 插件

```bash
# 在 Claude Code 中执行
/plugin marketplace add affaan-m/everything-claude-code
/plugin install everything-claude-code@everything-claude-code
```

### 4.2 安装 Rules（必需）

```bash
# 克隆仓库
git clone https://github.com/affaan-m/everything-claude-code.git
cd everything-claude-code

# 安装规则（选择你需要的语言）
./install.sh typescript
./install.sh python
./install.sh golang
```

### 4.3 验证安装

```bash
# 检查命令是否可用
ls ~/.claude/commands/multi-*

# 检查 codeagent-wrapper
which codeagent-wrapper
codeagent-wrapper --version 2>/dev/null || echo "需要安装 codeagent-wrapper"

# 检查 API Keys
echo $OPENAI_API_KEY
echo $GOOGLE_API_KEY

# 检查 Role Prompts
ls ~/.claude/.ccg/prompts/codex/
ls ~/.claude/.ccg/prompts/gemini/
```

### 4.4 测试多模型连接

```bash
# 测试 Codex 连接
codeagent-wrapper --backend codex - "$PWD" <<'EOF'
测试连接
EOF

# 测试 Gemini 连接
codeagent-wrapper --backend gemini --gemini-model gemini-3-pro-preview - "$PWD" <<'EOF'
测试连接
EOF
```

---

## 5. 使用指南

### 5.1 基础用法

#### `/multi-frontend` - 前端开发

```
用户: /multi-frontend 设计一个响应式商品卡片组件

Claude: [Mode: Research]
      正在检索项目上下文...
      找到现有组件：Button, Badge, RatingStars

      [Mode: Ideation]
      调用 Gemini 分析设计方案...

      Gemini 提供了 2 个方案：
      1. 垂直卡片（适合移动端）
      2. 水平卡片（适合桌面端）

      请选择方案:
      [1] 垂直卡片
      [2] 水平卡片

用户: 选择方案 1

Claude: [Mode: Plan]
      调用 Gemini 生成组件结构...

      组件结构：
      ProductCard/
      ├── ProductCard.tsx
      ├── ProductImage.tsx
      ├── ProductInfo.tsx
      ├── ProductPrice.tsx
      └── index.ts

      [Mode: Execute]
      正在编写代码...

      ✅ 组件创建完成

      [Mode: Optimize]
      Gemini 审查建议：
      - 添加 alt 属性
      - 提高对比度

      应用优化...

      ✅ 完成
```

#### `/multi-backend` - 后端开发

```
用户: /multi-backend 实现用户认证 API

Claude: [Mode: Research]
      正在检索 API 和数据模型...

      [Mode: Ideation]
      调用 Codex 分析技术方案...

      Codex 提供了 2 个方案：
      1. JWT Token 认证
      2. Session Cookie 认证

      请选择方案:
      [1] JWT Token
      [2] Session Cookie

用户: 选择方案 1

Claude: [Mode: Plan]
      调用 Codex 设计 API 结构...

      API 设计：
      POST /api/auth/register
      POST /api/auth/login
      POST /api/auth/logout
      GET  /api/auth/me

      [Mode: Execute]
      正在编写代码...

      ✅ API 实现完成

      [Mode: Optimize]
      Codex 审查建议：
      - 添加速率限制
      - 使用 bcrypt 加密密码

      应用优化...

      ✅ 完成
```

### 5.2 高级用法

#### `/multi-plan` + `/multi-execute` 组合使用

```
# 步骤 1: 规划
用户: /multi-plan 实现用户评论功能

Claude: [Phase 1] 上下文检索...
      [Phase 2] 多模型分析...

      ├─ Codex 分析后端：
      │  - 数据库表设计 (comments, comment_replies)
      │  - API 端点 (POST /api/comments, GET /api/products/:id/comments)
      │  - 风险评估 (SQL 注入、XSS)
      │
      └─ Gemini 分析前端：
         - 评论列表组件 (分页加载)
         - 评论表单 (星级选择)
         - 图片上传预览

      [Phase 3] 生成分步计划
      保存到: .claude/plan/user-comments.md

      SESSION_ID:
      - CODEX_SESSION: xyz123
      - GEMINI_SESSION: abc456

      ✅ 计划已生成，请审查后执行

# 步骤 2: 执行
用户: /multi-execute .claude/plan/user-comments.md

Claude: [Phase 1] 快速上下文检索...
      [Phase 2] 获取原型...

      并行调用：
      ├─ Codex: 生成后端代码 Diff
      └─ Gemini: 生成前端代码 Diff

      [Phase 3] 代码实现
      应用 Diff 并重构为生产级代码...

      [Phase 4] 审查
      并行审查：
      ├─ Codex: 后端代码通过 ✅
      └─ Gemini: 前端代码通过 ✅

      ✅ 功能实现完成
```

---

## 6. 工作流程详解

### 6.1 `/multi-frontend` 完整流程

```
1. [Mode: Prepare] - 提示增强（可选）
   └─ mcp__ace-tool__enhance_prompt

2. [Mode: Research] - 上下文检索
   └─ mcp__ace-tool__search_context
   └─ 检索现有组件、样式、设计系统

3. [Mode: Ideation] - 方案分析
   ├─ 调用 Gemini (ROLE: analyzer.md)
   ├─ 输出至少 2 个解决方案
   └─ 保存 GEMINI_SESSION

4. [Mode: Plan] - 方案规划
   ├─ 调用 Gemini (ROLE: architect.md, resume SESSION)
   ├─ 生成组件结构和 UI 流程
   └─ 保存计划到 .claude/plan/

5. [Mode: Execute] - 代码实现
   ├─ Claude 编写代码
   └─ 遵循项目设计系统和代码标准

6. [Mode: Optimize] - 代码优化
   ├─ 调用 Gemini (ROLE: reviewer.md)
   ├─ 审查可访问性、响应式、性能
   └─ 应用优化

7. [Mode: Review] - 最终评估
   └─ 检查完成度、响应式、可访问性
```

### 6.2 Session 生命周期

```
┌─────────────────────────────────────────────┐
│ Session 创建                                │
│                                              │
│  codeagent-wrapper --backend gemini \      │
│    --gemini-model gemini-3-pro-preview \   │
│    - "$PWD" <<'EOF'                       │
│  ROLE: analyzer                            │
│  TASK: ...                                  │
│  EOF                                         │
│                                              │
│  返回: SESSION_ID: abc123                   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ Session 复用                                │
│                                              │
│  codeagent-wrapper --backend gemini \      │
│    resume abc123 \                          │
│    - "$PWD" <<'EOF'                       │
│  ROLE: architect                           │
│  TASK: ...                                  │
│  EOF                                         │
└─────────────────────────────────────────────┘
```

---

## 7. 故障排查

### 7.1 常见问题

#### 问题 1: codeagent-wrapper 未找到

```
错误: bash: codeagent-wrapper: command not found
```

**解决方案**:

```bash
# 检查是否安装
which codeagent-wrapper

# 如果未安装，按照 3.2 节安装
# 或添加到 PATH
export PATH="$PATH:$HOME/.claude/bin"
```

#### 问题 2: API Key 未配置

```
错误: OPENAI_API_KEY not set
```

**解决方案**:

```bash
# 设置环境变量
export OPENAI_API_KEY="sk-proj-xxxxx"
export GOOGLE_API_KEY="AIzaSyxxxxx"

# 永久设置（添加到 ~/.bashrc 或 ~/.zshrc）
echo 'export OPENAI_API_KEY="sk-proj-xxxxx"' >> ~/.bashrc
source ~/.bashrc
```

#### 问题 3: Role Prompts 缺失

```
错误: ROLE_FILE not found: ~/.claude/.ccg/prompts/codex/analyzer.md
```

**解决方案**:

```bash
# 创建目录
mkdir -p ~/.claude/.ccg/prompts/{codex,gemini}

# 从 codeagent-wrapper 项目复制 Role Prompts
# 或手动创建基础版本
```

#### 问题 4: 模型调用超时

```
错误: Request timeout after 30000ms
```

**解决方案**:

```bash
# 在命令中增加超时时间（毫秒）
codeagent-wrapper --backend gemini - "$PWD" \
  --timeout 600000
```

### 7.2 调试技巧

#### 启用详细日志

```bash
# 设置环境变量启用调试
export CODEAGENT_DEBUG=true
export VERBOSE=1
```

#### 验证模型连接

```bash
# 测试 Codex
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# 测试 Gemini
curl "https://generativelanguage.googleapis.com/v1/models/gemini-3-pro-preview:generateContent?key=$GOOGLE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"test"}]}]}'
```

---

## 8. 最佳实践

### 8.1 任务类型选择

| 你的任务     | 推荐命令                             | 理由           |
| -------- | -------------------------------- | ------------ |
| 设计 UI 组件 | `/multi-frontend`                | Gemini 是前端权威 |
| 实现 API   | `/multi-backend`                 | Codex 是后端权威  |
| 全栈功能     | `/multi-plan` + `/multi-execute` | 两者协作         |
| 快速原型     | 直接使用 Claude Code                 | 避免额外开销       |

### 8.2 性能优化

| 优化项            | 说明                               |
| -------------- | -------------------------------- |
| **Session 复用** | 减少 token 消耗，提高响应速度               |
| **并行调用**       | Fullstack 任务时同时调用 Codex 和 Gemini |
| **上下文限制**      | 单次调用限制在 32k tokens 以内            |
| **增量更新**       | 优先复用已有 session，避免频繁创建            |

### 8.3 代码质量保证

1. **Code Sovereignty**: 外部模型只有建议权，所有代码由 Claude 写入
2. **Dirty Prototype Refactoring**: 外部输出视为草稿，Claude 重构为生产代码
3. **Mandatory Audit**: 代码变更后必须经过多模型审查
4. **Trust Rules**: 后端信 Codex，前端信 Gemini

### 8.4 成本控制

| 策略                   | 说明                |
| -------------------- | ----------------- |
| **优先使用 Claude Code** | 基础任务无需多模型         |
| **Session 复用**       | 避免重复传递上下文         |
| **按需调用**             | 只在需要专业领域知识时调用外部模型 |
| **批量处理**             | 多个小任务合并为一个，减少调用次数 |

---

## 9. 总结

### 9.1 核心概念

- **Claude Code** 是协调者，拥有文件系统写入权限
- **Codex/Gemini** 是外部专家模型，零写入权限
- **codeagent-wrapper** 是模型调用工具
- **Session 复用** 保持上下文一致性

### 9.2 使用决策树

```
是否需要多模型？
    │
    ├─ 否 → 使用 Claude Code 单独完成
    │
    └─ 是 → 任务类型？
           │
           ├─ Frontend → /multi-frontend
           ├─ Backend → /multi-backend
           └─ Fullstack → /multi-plan + /multi-execute
```

### 9.3 相关资源

- **everything-claude-code 插件**: https://github.com/affaan-m/everything-claude-code
- **Claude Code 文档**: https://docs.anthropic.com
- **多模型工作流指南**: https://x.com/affaanmustafa/status/2014040193557471352

---

## 附录 A: 快速参考

### A.1 命令速查表

```bash
# 前端开发
/multi-frontend <UI 任务描述>

# 后端开发
/multi-backend <后端任务描述>

# 规划
/multi-plan <功能描述>

# 执行
/multi-execute .claude/plan/<feature-name>.md

# 工作流
/multi-workflow feature <功能描述>
/multi-workflow bugfix <Bug 描述>
```

### A.2 环境变量速查

```bash
# API Keys
export OPENAI_API_KEY="sk-proj-xxxxx"
export GOOGLE_API_KEY="AIzaSyxxxxx"

# 调试
export CODEAGENT_DEBUG=true
export VERBOSE=1

# 包管理器
export CLAUDE_PACKAGE_MANAGER=pnpm
```

### A.3 目录结构

```
~/.claude/
├── bin/
│   └── codeagent-wrapper    # 模型调用工具
├── .ccg/
│   └── prompts/
│       ├── codex/
│       │   ├── analyzer.md
│       │   ├── architect.md
│       │   └── reviewer.md
│       └── gemini/
│           ├── analyzer.md
│           ├── architect.md
│           ├── reviewer.md
│           └── frontend.md
├── commands/
│   ├── multi-frontend.md
│   ├── multi-backend.md
│   ├── multi-plan.md
│   └── multi-execute.md
└── plan/
    └── <feature-name>.md     # 生成的计划文件
```

---

**文档版本**: v1.0
**最后更新**: 2025-02-13
**维护者**: Claude Code 用户社区
