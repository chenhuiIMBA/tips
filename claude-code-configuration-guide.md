# Claude Code 配置指南

本文档详细说明了 Claude Code 的各项配置，包括 Agents、Skills、Commands、Rules、Hooks 和 MCP 服务器。

---

## 目录

1. [概述](#概述)
2. [环境配置](#环境配置)
3. [Agents (专业代理)](#agents-专业代理)
4. [Skills (技能库)](#skills-技能库)
5. [Commands (快捷命令)](#commands-快捷命令)
6. [Rules (编码规范)](#rules-编码规范)
7. [Hooks (自动化钩子)](#hooks-自动化钩子)
8. [MCP 服务器](#mcp-服务器)
9. [插件系统](#插件系统)

---

## 概述

Claude Code 配置位于 `~/.claude/` 目录，通过以下组件提供强大的开发辅助能力：

| 组件 | 位置 | 作用 |
|------|------|------|
| Agents | `~/.claude/agents/` | 专业任务代理 |
| Skills | `~/.claude/skills/` | 领域知识库 |
| Commands | `~/.claude/commands/` | 快捷命令 |
| Rules | `~/.claude/rules/` | 编码规范 |
| Hooks | `settings.json` | 自动化钩子 |
| MCP | 配置在 settings.json | 外部服务集成 |

---

## 环境配置

### 当前 API 配置

```json
{
  "ANTHROPIC_AUTH_TOKEN": "<your-api-token>",
  "ANTHROPIC_BASE_URL": "https://open.bigmodel.cn/api/anthropic",
  "API_TIMEOUT_MS": "3000000",
  "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
}
```

**注意**: 当前使用智谱AI代理API，实际运行的是GLM-4.7模型，而非真正的Claude。

**配置位置**: `~/.claude/settings.json` 中的 `env` 字段

### 模型选择

- **默认模型**: `opus[1m]` (Claude Opus 4.6)
- **切换模型**: 使用 `/model` 命令

---

## Agents (专业代理)

Agents 是专门的任务处理代理，各自有不同的职责和工具。

### 可用 Agents 列表

| Agent | 用途 | 使用场景 |
|-------|------|---------|
| **planner** | 实现规划 | 复杂功能、架构变更 |
| **architect** | 系统设计 | 架构决策 |
| **tdd-guide** | 测试驱动开发 | 新功能、Bug修复 |
| **code-reviewer** | 代码审查 | 编写代码后自动调用 |
| **security-reviewer** | 安全分析 | 敏感功能开发前 |
| **build-error-resolver** | 构建错误修复 | 构建失败时 |
| **e2e-runner** | E2E测试 | 关键用户流程 |
| **refactor-cleaner** | 代码清理 | 死代码删除 |
| **doc-updater** | 文档更新 | 更新CODEMAPS |
| **go-build-resolver** | Go构建修复 | Go构建失败 |
| **go-reviewer** | Go代码审查 | Go代码变更 |
| **python-reviewer** | Python代码审查 | Python代码变更 |
| **database-reviewer** | 数据库审查 | 数据库查询优化 |

### Planner Agent (规划专家)

**解决问题**: 避免盲目开始编码，先制定详细计划

**使用方式**: 自动激活或手动调用

```
用户: 我需要添加实时通知功能

Agent (planner):
# 实现计划: 实时市场解析通知

## 需求重述
- 当用户关注的市场解析时发送通知
- 支持多种通知渠道（应用内、邮件、webhook）
- 确保通知可靠送达

## 实现阶段

### 阶段1: 数据库Schema
...
```

### Code-Reviewer Agent (代码审查)

**解决问题**: 保证代码质量、安全性和可维护性

**使用方式**: 编写代码后自动触发

审查检查项:
- 代码简洁可读
- 函数和变量命名良好
- 无重复代码
- 适当的错误处理
- 无暴露的密钥
- 输入验证已实现
- 良好的测试覆盖率
- 性能考虑

### TDD-Guide Agent (测试驱动开发)

**解决问题**: 强制测试先行的开发流程，确保80%+覆盖率

**使用方式**: `/tdd` 命令

```
RED → GREEN → REFACTOR → REPEAT

RED:      编写失败的测试
GREEN:    编写最小实现使测试通过
REFACTOR: 在保持测试通过的同时改进代码
REPEAT:   下一个功能/场景
```

---

## Skills (技能库)

Skills 是按领域组织的专业知识库，提供详细的编码模式和最佳实践。

### 通用技能

| Skill | 描述 |
|-------|------|
| **coding-standards** | 通用编码标准 (TypeScript/JavaScript) |
| **security-review** | 安全检查清单和模式 |
| **security-scan** | 配置安全漏洞扫描 |
| **tdd-workflow** | 测试驱动开发工作流 |

### 前端技能

| Skill | 描述 |
|-------|------|
| **frontend-patterns** | React, Next.js, 状态管理, UI最佳实践 |
| **multi-frontend** | 前端专注开发模式 |

### 后端技能

| Skill | 描述 |
|-------|------|
| **backend-patterns** | Node.js, Express, API设计 |
| **multi-backend** | 后端专注开发模式 |
| **springboot-patterns** | Spring Boot架构模式 |
| **springboot-security** | Spring Security最佳实践 |
| **jpa-patterns** | JPA/Hibernate模式 |
| **django-patterns** | Django架构和DRF |
| **django-security** | Django安全指南 |
| **django-tdd** | Django测试策略 |
| **clickhouse-io** | ClickHouse数据库模式 |

### 语言特定技能

| Skill | 描述 |
|-------|------|
| **python-patterns** | Python惯用法, PEP 8, 类型提示 |
| **python-testing** | pytest测试策略 |
| **golang-patterns** | 惯用Go模式 |
| **golang-testing** | Go测试模式 (表驱动测试) |
| **cpp-testing** | C++测试 (GoogleTest) |

### 其他技能

| Skill | 描述 |
|-------|------|
| **postgres-patterns** | PostgreSQL查询优化 |
| **iterative-retrieval** | 逐步检索优化 |
| **strategic-compact** | 上下文压缩策略 |
| **eval-harness** | 评估驱动开发 |
| **continuous-learning** | 从会话中提取可重用模式 |
| **nutrient-document-processing** | 文档处理API |

### Skills 使用示例

```typescript
// coding-standards 技能提供的模式

// ✅ GOOD: 不可变更新
const updatedUser = {
  ...user,
  name: 'New Name'
}

// ❌ BAD: 直接变异
user.name = 'New Name'
```

```python
# python-patterns 技能提供的模式

# ✅ GOOD: EAFP风格
def get_value(dictionary, key):
    try:
        return dictionary[key]
    except KeyError:
        return default_value

# ❌ BAD: LBYL风格
def get_value(dictionary, key):
    if key in dictionary:
        return dictionary[key]
    else:
        return default_value
```

---

## Commands (快捷命令)

Commands 是预定义的工作流命令，通过 `/命令名` 调用。

### 核心命令

| 命令 | 描述 | 使用场景 |
|------|------|---------|
| `/plan` | 创建实现计划 | 新功能、重构前 |
| `/tdd` | 测试驱动开发 | 新功能、Bug修复 |
| `/code-review` | 代码审查 | 代码编写后 |
| `/build-fix` | 修复构建错误 | 构建失败 |
| `/go-build` | 修复Go构建 | Go构建失败 |
| `/test-coverage` | 检查测试覆盖率 | 验证覆盖率 |
| `/verify` | 验证命令 | 质量检查 |
| `/checkpoint` | 检查点 | 保存进度 |
| `/e2e` | E2E测试 | 端到端测试 |
| `/eval` | 评估命令 | 评估会话 |
| `/sessions` | 会话命令 | 管理会话 |

### 工作流命令

| 命令 | 描述 |
|------|------|
| `/multi-plan` | 多模型协作规划 |
| `/multi-execute` | 多模型协作执行 |
| `/multi-workflow` | 多模型协作工作流 |
| `/multi-frontend` | 前端专注模式 |
| `/multi-backend` | 后端专注模式 |
| `/orchestrate` | 编排命令 |

### Git命令

| 命令 | 描述 |
|------|------|
| `commit-commands:commit` | 创建git提交 |
| `commit-commands:commit-push-pr` | 提交、推送并创建PR |
| `commit-commands:clean_gone` | 清理已删除分支 |

### 学习命令

| 命令 | 描述 |
|------|------|
| `/learn` | 提取可重用模式 |
| `/skill-create` | 从git历史生成技能 |
| `/instinct-export` | 导出instincts |
| `/instinct-import` | 导入instincts |
| `/instinct-status` | 查看instincts |
| `/evolve` | 将instincts聚合成技能 |

### 命令使用示例

```
# 使用 /plan 规划新功能
用户: /plan 添加用户认证功能

Agent:
# 实现计划: 用户认证

## 需求重述
- 实现邮箱/密码登录
- JWT token认证
- 密码重置流程

## 实现阶段
...
等待确认: 是否继续? (yes/no/modify)

# 使用 /tdd 进行测试驱动开发
用户: /tdd 实现用户注册功能

Agent:
# TDD会话: 用户注册

## 步骤1: 定义接口
interface RegisterRequest {
  email: string
  password: string
  name: string
}

## 步骤2: 编写失败的测试
...

## 步骤3: 运行测试 - 确认失败
...
```

---

## Rules (编码规范)

Rules 定义了编码标准和最佳实践，按语言组织。

### 规范结构

```
~/.claude/rules/
├── common/          # 通用原则
├── typescript/      # TypeScript/JavaScript特定
├── python/          # Python特定
└── golang/          # Go特定
```

### Common Rules (通用规范)

| 文件 | 内容 |
|------|------|
| **coding-style.md** | 编码风格原则 |
| **patterns.md** | 设计模式 (Repository, API响应格式) |
| **git-workflow.md** | Git工作流和提交格式 |
| **testing.md** | 测试要求 (80%覆盖率) |
| **security.md** | 安全指南 |
| **performance.md** | 模型选择和上下文管理 |
| **hooks.md** | Hooks系统说明 |
| **agents.md** | Agent编排指南 |

### 语言特定规则

#### TypeScript/JavaScript
- 不可变性: 使用展开运算符
- 错误处理: async/await + try-catch
- 输入验证: 使用 Zod
- 格式化: Prettier自动格式
- 类型检查: TypeScript自动检查

#### Python
- 遵循 PEP 8 规范
- 类型注解必须
- 不可变数据: dataclass(frozen=True), NamedTuple
- 格式化: black, isort, ruff

#### Go
- 格式化: gofmt, goimports (强制)
- 接受接口，返回结构体
- 错误处理: 总是包装错误
- 测试: 表驱动测试

### Rules 核心原则

#### 不可变性 (CRITICAL)

```javascript
// ❌ 错误: 变异
function updateUser(user, name) {
  user.name = name  // 变异!
  return user
}

// ✅ 正确: 不可变
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

#### 文件组织

- **多小文件 > 少大文件**
- 高内聚，低耦合
- 典型200-400行，最多800行
- 按功能/领域组织

#### 错误处理

- 在每个级别显式处理错误
- 提供用户友好的错误消息
- 服务器端记录详细错误上下文
- 永不静默吞没错误

---

## Hooks (自动化钩子)

Hooks 在特定事件时自动执行命令，提供自动化能力。

### Hook 类型

| 类型 | 触发时机 | 用途 |
|------|----------|------|
| **PreToolUse** | 工具执行前 | 验证、参数修改 |
| **PostToolUse** | 工具执行后 | 自动格式化、检查 |
| **PreCompact** | 上下文压缩前 | 保存重要信息 |
| **SessionStart** | 会话开始时 | 初始化 |
| **SessionEnd** | 会话结束时 | 最终验证 |
| **Stop** | 会话停止时 | 检查清单 |

### 当前配置的 Hooks

#### PreToolUse (工具执行前)

1. **开发服务器检查**
   - 阻止直接运行 `npm run dev`
   - 要求在 tmux 中运行以获得日志访问

2. **tmux 提醒**
   - 长时间命令建议使用 tmux

3. **git push 提醒**
   - 推送前提醒审查更改

4. **文档创建限制**
   - 阻止创建不必要的 md/txt 文件
   - 允许: README.md, CLAUDE.md, AGENTS.md, CONTRIBUTING.md

5. **压缩建议**
   - Edit/Write后建议压缩

#### PostToolUse (工具执行后)

1. **PR 创建通知**
   - gh pr create 后显示 PR 链接

2. **Prettier 自动格式化**
   - 编辑 JS/TS 文件后自动运行 prettier

3. **TypeScript 类型检查**
   - 编辑 TS/TSX 文件后运行 tsc

4. **console.log 警告**
   - 检测编辑文件中的 console.log

#### SessionEnd Hooks

1. **console.log 审计**
   - 检查所有修改文件的 console.log

2. **会话评估**
   - 评估会话效果

### Hooks 使用示例

```javascript
// 当前配置示例
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\"",
        "hooks": [{
          "type": "command",
          "command": "npx prettier --write [file]"
        }]
      }
    ]
  }
}
```

---

## MCP 服务器

MCP (Model Context Protocol) 服务器扩展 Claude 的能力。

### 当前启用的 MCP 服务器

| MCP | 功能 | 使用场景 |
|-----|------|---------|
| **context7** | 文档查询 | 获取库的最新文档 |
| **filesystem** | 文件系统操作 | 目录结构、文件操作 |
| **magic** | UI组件库 | 获取Magic UI组件 |
| **sequential-thinking** | 复杂推理 | 多步骤思考 |
| **memory** | 知识图谱 | 存储和检索信息 |
| **zai-mcp-server** | 图像分析 | OCR、UI转换、图表分析 |
| **web-search-prime** | 网络搜索 | 搜索最新信息 |
| **web-reader** | 网页读取 | 获取网页内容 |
| **zread** | GitHub阅读 | 读取仓库代码 |

### Context7 使用示例

```
用户: 如何在 Spring Boot 中使用 @Transactional?

Claude: [使用 context7 查询文档]
[返回 Spring Boot 文档中关于 @Transactional 的详细说明和示例]
```

### Magic UI 组件

可用组件类别:
- **Animations**: blur-fade
- **Backgrounds**: warp-grid, retro-grid, ripple
- **Buttons**: rainbow-button, shimmer-button
- **Components**: marquee, globe, file-tree
- **Special Effects**: border-beam, meteors, confetti
- **Text Animations**: text-animate, aurora-text, morphing-text

### ZAI MCP Server 功能

- **图像分析**: 通用图像理解
- **UI转代码**: 从UI截图生成代码
- **OCR**: 提取截图中的文本
- **错误诊断**: 分析错误截图
- **技术图表**: 理解架构图、流程图
- **数据可视化**: 分析图表和仪表板

---

## 插件系统

### 当前启用的插件

| 插件 | 描述 |
|------|------|
| **context7** | 文档查询插件 |
| **hookify** | Hook配置管理 |
| **ralph-loop** | Ralph循环 |
| **commit-commands** | Git提交命令 |

### 额外的 Marketplace

```json
{
  "extraKnownMarketplaces": {
    "everything-claude-code": {
      "source": {
        "source": "github",
        "repo": "affaan-m/everything-claude-code"
      }
    }
  }
}
```

---

## 权限配置

### 本地权限 (.claude/settings.local.json)

```json
{
  "permissions": {
    "allow": [
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git push:*)",
      "Bash(echo:*)",
      "Bash(source:*)",
      "Bash(alias:*)",
      "Bash(/usr/bin/claude:*)",
      "Bash(bash:*)",
      "Bash(test:*)",
      "Bash(gradle:*)"
    ]
  }
}
```

---

## 最佳实践

### 开发工作流

1. **规划阶段**
   ```
   /plan → 确认计划 → 开始实现
   ```

2. **实现阶段**
   ```
   /tdd → 编写测试 → 实现 → 重构
   ```

3. **审查阶段**
   ```
   /code-review → 修复问题
   ```

4. **提交阶段**
   ```
   git add → commit-push-pr
   ```

### 模型选择策略

| 模型 | 用途 |
|------|------|
| **Haiku** | 轻量级代理、频繁调用 |
| **Sonnet** | 主要开发工作 |
| **Opus** | 复杂架构决策、深度推理 |

### 上下文管理

- 避免使用最后20%的上下文窗口
- 使用 Plan Mode 进行结构化规划
- 启用 Extended Thinking 进行深度推理

---

## 配置文件位置

| 配置 | 路径 |
|------|------|
| 全局设置 | `~/.claude/settings.json` |
| 本地设置 | `.claude/settings.local.json` |
| Agents | `~/.claude/agents/` |
| Skills | `~/.claude/skills/` |
| Commands | `~/.claude/commands/` |
| Rules | `~/.claude/rules/` |

---

## 更新日志

- **2026-02-12**: 初始文档创建，记录所有配置
