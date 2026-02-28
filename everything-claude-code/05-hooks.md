# Claude Code Hooks 完全指南

> 面向 AI 初学者的详细教程

---

## 目录

1. [什么是 Hooks？](#1-什么是-hooks)
2. [Hooks 解决什么问题](#2-hooks-解决什么问题)
3. [工作原理](#3-工作原理)
4. [所有 Hooks 详解](#4-所有-hooks-详解)
5. [使用场景](#5-使用场景)
6. [配置位置](#6-配置位置)

---

## 1. 什么是 Hooks？

**Hooks（钩子）** 是在特定事件发生时自动执行的脚本。

### 1.1 形象理解

| 类型          | 类比          |
| ----------- | ----------- |
| **Hooks**   | 工厂流水线的自动检测器 |
| **事件**      | 产品经过流水线     |
| **Hook 脚本** | 自动检测、自动处理   |

### 1.2 为什么需要 Hooks？

1. **自动化** - 不用手动执行重复任务
2. **即时反馈** - 立即得到提示
3. **强制规范** - 防止违规操作
4. **节省时间** - 自动化琐事

---

## 2. Hooks 解决什么问题

### 2.1 问题 1：忘记格式化代码

**场景**：写完代码直接提交

#### 2.1.1 没有 Hook

```
1. 写代码
2. git add
3. git commit
4. 推送
5. CI 报错：格式不正确
6. 修复、重新提交
```

#### 2.1.2 有 Hook

```
1. 写代码
2. [自动] Prettier 格式化
3. git add
4. git commit
5. 一次通过 ✅
```

### 2.2 问题 2：忘记删除 console.log

**场景**：调试时加了 console.log，忘记删除

#### 2.2.1 没有 Hook

```
1. 加 console.log 调试
2. 忘记删除
3. 提交代码
4. 生产环境有日志输出 😱
```

#### 2.2.2 有 Hook

```
1. 加 console.log 调试
2. [自动] 编辑后警告
3. 会话结束前检查
4. 必须删除才能结束
```

### 2.3 问题 3：dev 服务器管理混乱

**场景**：在后台运行 dev server

#### 2.3.1 没有 Hook

```
1. npm run dev（后台运行）
2. 关闭终端
3. 进程变成孤儿
4. 端口被占用
5. 找不到进程在哪杀
```

#### 2.3.2 有 Hook

```
1. npm run dev
2. [Hook 检测]
3. [自动] 阻止运行
4. 提示：请用 tmux
5. 正确启动 ✅
```

---

## 3. 工作原理

### 3.1 Hook 类型

| 类型               | 触发时机   | 用途        |
| ---------------- | ------ | --------- |
| **PreToolUse**   | 工具执行前  | 验证、阻止、修改  |
| **PostToolUse**  | 工具执行后  | 格式化、检查、提示 |
| **PreCompact**   | 上下文压缩前 | 保存重要信息    |
| **SessionStart** | 会话开始时  | 初始化、欢迎    |
| **SessionEnd**   | 会话结束时  | 最终检查、清理   |
| **Stop**         | 会话停止时  | 检查清单      |

### 3.2 Hook 执行流程

```
你操作 → [事件触发] → [Hook 匹配] → [执行脚本]
              ↓
           检查是否需要处理
              ↓
           是否匹配规则？
              ↓
          是 → 执行 Hook 脚本
              ↓
           脚本结果返回
              ↓
           可能阻止/修改/警告
```

---

## 4. 所有 Hooks 详解

### 4.1 PreToolUse Hooks（工具执行前）

在工具执行之前触发，可以**阻止**操作执行。

#### 4.1.1 Hook 1: Dev Server 检查

**问题**: 直接运行 dev server 导致日志管理困难

**配置**:

```json
{
  "PreToolUse": [
    {
      "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
      "hooks": [
        {
          "type": "command",
          "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux');process.exit(1)\""
        }
      ]
    }
  ]
}
```

**执行效果**:

```
你: npm run dev

Claude: [触发 PreToolUse Hook]
      [匹配到 npm run dev]

[Hook 执行]
[Hook] BLOCKED: Dev server must run in tmux
[Hook] Use: tmux new-session -d -s dev \"npm run dev\"
[Hook] Then: tmux attach -t dev

操作被阻止 ❌

你: tmux new-session -d -s dev "npm run dev"
你: tmux attach -t dev

✅ 正确启动，Dev Server 在 tmux 中运行
```

**为什么需要 tmux？**

| 不用 tmux     | 用 tmux       |
| ----------- | ------------ |
| 关闭终端进程丢失    | 进程继续运行       |
| 日志难以查看      | 随时 attach 查看 |
| Ctrl+C 停止困难 | 正常 attach 停止 |

#### 4.1.2 Hook 2: 文档创建限制

**问题**: 随意创建文档文件

**配置**:

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\.md|CLAUDE\\.md|AGENTS\\.md|CONTRIBUTING\\.md\")"
}
```

**执行效果**:

```
你: 创建一个 notes.md 文件

Claude: [触发 PreToolUse Hook]
      [匹配到 .md 文件创建]
      [但不是 README.md]

[Hook 执行]
[Hook] BLOCKED: Unnecessary documentation file creation
[Hook] File: notes.md
[Hook] Use README.md for documentation instead

操作被阻止 ❌

你: 请创建 README.md

Claude: [触发 PreToolUse Hook]
      [匹配到 README.md - 允许的文件]

✅ 操作允许
```

#### 4.1.3 Hook 3: 压缩建议

**问题**: 上下文快满了才压缩

**配置**:

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }]
}
```

**执行效果**:

```
你: [编辑很多文件后...]

Claude: [触发 PreToolUse Hook]
      [检测到上下文使用 75%]

[Hook 执行]
[Hook] Suggestion: Consider compacting context
[Hook] Context usage: 75%
[Hook] Use /compact to preserve important info

⚠️ 提示但不阻止
```

#### 4.1.4 Hook 4: Tmux 提醒（长时间运行的命令）

**问题**: 长时间运行的命令（测试、构建）应该在 tmux 中运行

**配置**:

```json
{
  "matcher": "Bash",
  "hooks": [{
    "type": "command",
    "command": "node -e \"...\""
  }]
}
```

**执行效果**:

```
你: npm test

Claude: [触发 PreToolUse Hook]
      [检测到不在 tmux 中]
      [检测到长时间运行的命令]

[Hook 执行]
[Hook] Consider running in tmux for session persistence
[Hook] tmux new -s dev  |  tmux attach -t dev

⚠️ 提醒但不阻止
```

**适用命令**:

- `npm install` / `pnpm install` / `yarn install` - 依赖安装可能很长
- `npm test` / `pytest` / `vitest` - 测试套件执行
- `cargo build` / `make` - 编译构建
- `docker build` - 镜像构建
- `playwright` - E2E 测试

#### 4.1.5 Hook 5: Git Push 审查提醒

**问题**: 推送前忘记审查代码

**配置**:

```json
{
  "matcher": "Bash",
  "hooks": [{
    "type": "command",
    "command": "node -e \"...if(/git push/.test(cmd)){console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')}...\""
  }]
}
```

**执行效果**:

```
你: git push

Claude: [触发 PreToolUse Hook]
      [检测到 git push 命令]

[Hook 执行]
[Hook] Review changes before push...
[Hook] Continuing with push (remove this hook to add interactive review)

⚠️ 提醒但继续执行
```

---

### 4.2 PostToolUse Hooks（工具执行后）

在工具执行之后触发，用于处理结果。

#### 4.2.1 Hook 4: Prettier 自动格式化

**问题**: 代码格式不统一

**配置**:

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "command": "node -e \"const{execFileSync}=require('child_process');const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){try{execFileSync('npx',['prettier','--write',p],{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
  }]
}
```

**执行效果**:

```
你: 写一个组件

Claude: [编写代码]
[Edit tool 执行]

[触发 PostToolUse Hook]
[匹配到 .tsx 文件编辑]

[Hook 执行]
→ npx prettier --write src/components/Button.tsx
→ Formatting complete...

你: 看到已格式化的代码 ✅
```

**对比**:

```typescript
// 你写的（格式化前）
function Button({label,onClick}:{label:string,onClick:()=>void}){return<button onClick={onClick}>{label}</button>}

// Prettier 格式化后
function Button({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return <button onClick={onClick}>{label}</button>;
}
```

#### 4.2.2 Hook 5: TypeScript 类型检查

**问题**: 类型错误积累

**配置**:

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\.(ts|tsx)$\"",
  "hooks": [{
    "command": "node -e \"const{execSync}=require('child_process');...execSync('npx tsc --noEmit ...')\""
  }]
}
```

**执行效果**:

```
你: 编辑 TypeScript 文件

Claude: [编辑完成]

[触发 PostToolUse Hook]
[执行 TypeScript 检查]

[Hook 输出]
src/User.ts:15:3 - error TS2322: Type 'string' is not assignable to type 'number'

⚠️ 类型错误：
第 15 行，期望 number 但收到 string

你: 修复类型错误 ✅
```

#### 4.2.3 Hook 6: console.log 警告

**问题**: 调试代码忘记删除

**配置**:

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "command": "node -e \"const fs=require('fs');...if(/console\\.log/.test(c)){console.error('[Hook] WARNING: console.log found...')}\""
  }]
}
```

**执行效果**:

```
你: 编辑文件添加调试

Claude: [编辑完成]

[触发 PostToolUse Hook]
[检测文件内容]

[Hook 输出]
[Hook] WARNING: console.log found in src/utils/calculate.ts
[Hook] 23:   console.log('Debug: value =', value)
[Hook] 45:   console.log(result)
[Hook] Remove console.log before committing

⚠️ 提醒你删除调试代码
```

#### 4.2.4 Hook 7: PR 创建通知

**问题**: 不知道 PR 是否创建成功

**配置**:

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [{
    "command": "node -e \"...if(/gh pr create/.test(cmd)){const m=out.match(/https:\\/\\/github\\.com\\/[^/]+\\/[^/]+\\/pull\\/\\d+/);if(m){console.error('[Hook] PR created: '+m[0])}...\""
  }]
}
```

**执行效果**:

```
你: gh pr create

Claude: [Bash 执行完成]

[触发 PostToolUse Hook]
[解析输出]

[Hook 输出]
[Hook] PR created: https://github.com/owner/repo/pull/123
[Hook] To review: gh pr review 123 --repo owner/repo

✅ PR 已创建！可以点击链接查看
```

#### 4.2.5 Hook 8: 异步构建分析

**问题**: 构建完成后的分析不应该阻塞工作流

**配置**:

```json
{
  "matcher": "Bash",
  "hooks": [{
    "type": "command",
    "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const cmd=i.tool_input?.command||'';if(/(npm run build|pnpm build|yarn build)/.test(cmd)){console.error('[Hook] Build completed - async analysis running in background')}console.log(d)})\"",
    "async": true,
    "timeout": 30
  }]
}
```

**执行效果**:

```
你: npm run build

Claude: [Bash tool 执行构建]
      [构建完成]

[触发 PostToolUse Hook]
[Hook 执行]
[Hook] Build completed - async analysis running in background

你: [继续其他工作，不等待分析完成]

[后台运行分析...]
30 秒后分析完成
[Hook] Analysis complete: Found 3 optimization opportunities
```

**异步 Hook 特性**:

| 特性          | 说明               |
| ----------- | ---------------- |
| **async**   | 后台运行，不阻塞主流程      |
| **timeout** | 限制最大执行时间（秒）      |
| **非阻塞**     | 可以继续其他工作，分析完成后通知 |

**适用场景**:

- 大型项目构建分析
- 依赖安全扫描
- 性能分析
- 代码复杂度计算

---

### 4.3 SessionEnd Hooks（会话结束时）

#### 4.3.1 Hook 8: Console.log 最终审计

**问题**: 会话结束前还有调试代码

**配置**:

```json
{
  "Stop": [
    {
      "matcher": "*",
      "hooks": [{
        "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/check-console-log.js\""
      }]
    }
  ]
}
```

**执行效果**:

```
你: 我要结束会话了

Claude: [触发 Stop Hook]
      [扫描所有修改的文件]

[Hook 输出]
=== Console.log Audit ===

Files with console.log:
  - src/user/service.ts (2 occurrences)
  - src/components/Header.tsx (1 occurrence)

⚠️ 请在结束前清理这些调试代码！

你: 好的，我来清理
```

#### 4.3.2 Hook 9: 持久化会话状态

**问题**: 会话结束时的状态丢失

**配置**:

```json
{
  "SessionEnd": [
    {
      "matcher": "*",
      "hooks": [{
        "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
      }]
    }
  ]
}
```

**执行效果**:

```
你: 我要结束会话了

Claude: [触发 SessionEnd Hook]

[Hook 执行]
💾 Persisting session state...
- Current task: 实现用户注册
- Files modified: 5
- Commands used: 12
- Session duration: 2h 15m

✅ Session state saved to ~/.claude/session-state.json
```

**持久化的内容包括**:

- 当前任务进度
- 修改的文件列表
- 使用的命令
- 学到的模式
- 错误和解决方案

#### 4.3.3 Hook 10: 评估会话模式

**问题**: 会话中有价值的模式没有被提取

**配置**:

```json
{
  "SessionEnd": [
    {
      "matcher": "*",
      "hooks": [{
        "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
      }]
    }
  ]
}
```

**执行效果**:

```
Claude: [触发 SessionEnd Hook]

[Hook 执行]
🔍 Evaluating session for extractable patterns...

Found 3 reusable patterns:
1. "React Context with Compound Components"
   - Used in: Tabs, Accordion, Dropdown
   - Confidence: High

2. "Type-safe API response handling"
   - Used in: 5 API endpoints
   - Confidence: Medium

3. "Zod schema validation pattern"
   - Used in: All user input forms
   - Confidence: High

💡 Consider extracting these patterns with /learn command
```

**自动识别的模式类型**:

- 代码模式（设计模式、惯用法）
- 配置模式
- 工作流模式
- 错误处理模式

---

### 4.4 SessionStart Hooks（会话开始时）

#### 4.4.1 Hook 9: 会话初始化

**配置**:

```json
{
  "SessionStart": [
    {
      "matcher": "*",
      "hooks": [{
        "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
      }]
    }
  ]
}
```

**执行效果**:

```
[会话开始]

[触发 SessionStart Hook]

[Hook 输出]
👋 Welcome! Session started at 2026-02-12 20:30:00
📁 Working directory: /home/user/project
🌿 Git branch: feature/user-auth
📦 Last commit: feat: add login page

Ready to assist!
```

### 4.5 PreCompact Hooks（上下文压缩前）

#### 4.5.1 Hook 10: 保存重要信息

**问题**: 压缩时丢失重要信息

**配置**:

```json
{
  "PreCompact": [
    {
      "matcher": "*",
      "hooks": [{
        "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
      }]
    }
  ]
}
```

**执行效果**:

```
[上下文即将满]

[触发 PreCompact Hook]

[Hook 输出]
💾 Saving important context...
- Current task: 实现用户注册
- Decisions made: 使用 JWT 认证
- Files modified: 5
- Next steps: 编写测试

Context compressed but key info preserved ✅
```

---

## 5. 使用场景

### 5.1 场景 1: 完整的开发流程

```
1. 开始会话
   → [SessionStart Hook] 欢迎信息

2. 启动 dev server
   → [PreToolUse Hook] 阻止直接运行
   → 提示使用 tmux
   → 正确启动

3. 编写代码
   → [PostToolUse Hook] Prettier 自动格式化
   → [PostToolUse Hook] TypeScript 检查
   → [PostToolUse Hook] console.log 警告

4. 会话结束
   → [Stop Hook] 最终审计
   → 检查所有调试代码
   → 确认清理
```

### 5.2 场景 2: 创建文件

```
你: 创建临时笔记.md

Claude: [PreToolUse Hook]
      [检测到 .md 文件]
      [不是允许的文件名]

[Hook 阻止]
只能创建这些文档文件：
- README.md
- CLAUDE.md
- AGENTS.md
- CONTRIBUTING.md

请改用 README.md 或删除 .md 后缀
```

### 5.3 场景 3: Git 操作

```
你: git push

Claude: [PreToolUse Hook]
      [检测到 git push]

[Hook 警告]
⚠️ Review changes before push...
正在继续...

[Bash 执行]

[PostToolUse Hook]
[如果创建 PR]
✅ PR 已创建: https://github.com/...
```

---

## 6. 配置位置

### 6.1 配置文件

Hooks 配置在 `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      // 工具执行前的 hooks
    ],
    "PostToolUse": [
      // 工具执行后的 hooks
    ],
    "PreCompact": [
      // 压缩前的 hooks
    ],
    "SessionStart": [
      // 会话开始时的 hooks
    ],
    "SessionEnd": [
      // 会话结束时的 hooks
    ],
    "Stop": [
      // 停止时的 hooks
    ]
  }
}
```

### 6.2 Hook 匹配器语法

```json
{
  "matcher": "匹配表达式"
}
```

**匹配表达式**:

| 表达式                                                           | 说明     | 示例           |
| ------------------------------------------------------------- | ------ | ------------ |
| `"*"`                                                         | 匹配所有   | 所有事件都触发      |
| `tool == \"Bash\"`                                            | 匹配特定工具 | 只在 Bash 时触发  |
| `tool == \"Edit\" && tool_input.file_path matches \"\\.ts$\"` | 组合条件   | 编辑 .ts 文件时触发 |

### 6.3 Hook 命令格式

```json
{
  "type": "command",
  "command": "要执行的脚本"
}
```

**可用变量**:

- `${CLAUDE_PLUGIN_ROOT}` - 插件目录
- `tool_input` - 工具输入
- `tool_output` - 工具输出

---

## 7. 总结

| Hook 类型          | 触发时机  | 典型用途      | 是否可阻止 |
| ---------------- | ----- | --------- | ----- |
| **PreToolUse**   | 工具执行前 | 验证、阻止、修改  | ✅ 是   |
| **PostToolUse**  | 工具执行后 | 格式化、检查、提示 | ❌ 否   |
| **PreCompact**   | 压缩前   | 保存信息      | ❌ 否   |
| **SessionStart** | 会话开始  | 初始化、欢迎    | ❌ 否   |
| **SessionEnd**   | 会话结束  | 最终检查      | ❌ 否   |
| **Stop**         | 停止时   | 清理检查      | ❌ 否   |

---

## 8. 下一步

- [Agents 文档](./01-agents.md) - 了解专业代理
- [Skills 文档](./02-skills.md) - 了解技能库
