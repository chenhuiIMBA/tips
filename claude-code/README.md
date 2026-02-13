# Claude Code 配置文档索引

> 面向 AI 初学者的完整指南

---

## 文档列表

| 文档 | 描述 |
|------|------|
| [01-agents.md](./01-agents.md) | 专业代理详解 |
| [02-skills.md](./02-skills.md) | 技能库详解 |
| [03-commands.md](./03-commands.md) | 快捷命令详解 |
| [04-rules.md](./04-rules.md) | 编码规范详解 |
| [05-hooks.md](./05-hooks.md) | 自动化钩子详解 |
| [06-mcp.md](./06-mcp.md) | MCP 服务器详解 |

---

## 快速导航

### 我想了解...

#### 学习基础知识
→ [阅读本文档](../claude-code-configuration-guide.md)

#### 了解各个模块
→ [Agents](./01-agents.md) - 专业代理如何工作
→ [Skills](./02-skills.md) - 专业知识库
→ [Commands](./03-commands.md) - 快捷命令使用
→ [Rules](./04-rules.md) - 编码规范遵守
→ [Hooks](./05-hooks.md) - 自动化钩子
→ [MCP](./06-mcp.md) - 外部服务集成

#### 解决具体问题

| 问题 | 查看文档 |
|------|---------|
| 如何规划复杂功能？ | [Agents - Planner](./01-agents.md#1-planner-agent规划专家) |
| 如何保证代码质量？ | [Agents - Code-Reviewer](./01-agents.md#2-code-reviewer-agent代码审查专家) |
| 如何做测试驱动开发？ | [Agents - TDD-Guide](./01-agents.md#3-tdd-guide-agent测试驱动开发专家) |
| 代码写完自动格式化？ | [Hooks - Prettier](./05-hooks.md#hook-4-prettier-自动格式化) |
| 忘记删除 console.log？ | [Hooks - Console.log 检测](./05-hooks.md#hook-6-consolelog-警告) |
| 如何分析错误截图？ | [MCP - ZAI](./06-mcp.md#五zai-mcp-server图像分析) |
| 如何获取最新文档？ | [MCP - Context7](./06-mcp.md#一context7文档查询) |

---

## 模块关系图

```
┌─────────────────────────────────────────────────────────┐
│                                                  │
│                   Claude Code                       │
│                 (配置系统)                          │
│                                                  │
└─────────────────────────────────────────────────────────┘
           │           │           │           │
           │           │           │           │
    ┌──────▼────┐ ┌──▼────┐ ┌──▼────┐ ┌──▼────┐
    │   Agents   │ │ Skills │ │Commands│ │ Rules  │
    │  (主动执行） │ │(被动知识）│ │(快捷操作）│ │(强制规范）│
    └────────────┘ └────────┘ └────────┘ └────────┘
           │
           │
    ┌──────▼───────────────┐
    │       Hooks          │
    │   (自动化触发）        │
    └───────────────────────┘
           │
           │
    ┌──────▼───────────────┐
    │        MCP          │
    │   (外部服务扩展）       │
    └───────────────────────┘
```

---

## 学习路径

### 路径 1：新手入门

```
1. 先读本文档概要
   ↓
2. 阅读 [Commands 文档](./03-commands.md)
   了解基础命令：/plan, /tdd, /code-review
   ↓
3. 阅读 [Rules 文档](./04-rules.md)
   了解编码规范
   ↓
4. 开始使用！
```

### 路径 2：进阶使用

```
1. 熟练使用 Commands
   ↓
2. 阅读 [Agents 文档](./01-agents.md)
   了解专业代理的能力
   ↓
3. 阅读 [Skills 文档](./02-skills.md)
   了解可用的专业知识
   ↓
4. 组合使用，提效
```

### 路径 3：高级定制

```
1. 理解 [Hooks](./05-hooks.md)
   配置自动化工作流
   ↓
2. 理解 [MCP](./06-mcp.md)
   集成外部服务
   ↓
3. 自定义配置
```

---

## 常见场景速查

### 场景：开始新功能

```
1. /plan 制定计划
2. /tdd 测试驱动实现
3. /code-review 审查代码
4. /pr 提交代码
```

### 场景：修复 Bug

```
1. 分析错误（可用 MCP 分析截图）
2. /tdd 写测试复现
3. 修复并验证
4. /commit 提交修复
```

### 场景：代码审查

```
1. /code-review 自动审查
2. 查看问题报告
3. 修复问题
4. 再次验证
```

### 场景：学习新技术

```
1. 使用 Context7 MCP 查询文档
2. 使用 Skills 了解最佳实践
3. /plan 规划实现
4. 开始开发
```

---

## 配置文件位置

所有配置文件位于 `~/.claude/`：

```
~/.claude/
├── settings.json           # 主配置文件
├── settings.local.json    # 本地配置（权限等）
├── agents/               # 专业代理
│   ├── planner.md
│   ├── code-reviewer.md
│   └── ...
├── skills/               # 技能库
│   ├── coding-standards/
│   ├── python-patterns/
│   └── ...
├── commands/             # 快捷命令
│   ├── plan.md
│   ├── tdd.md
│   └── ...
├── rules/               # 编码规范
│   ├── common/
│   ├── typescript/
│   ├── python/
│   └── golang/
└── mcp-servers.json      # MCP 配置（可能在 settings.json 中）
```

---

## 获取帮助

### 查看所有命令

```
/help
```

### 查看 MCP 状态

```bash
claude mcp list
```

### 查看配置

```bash
cat ~/.claude/settings.json
```

---

## 更新日志

- **2026-02-12**: 创建完整文档集
  - Agents 详解
  - Skills 详解
  - Commands 详解
  - Rules 详解
  - Hooks 详解
  - MCP 详解

---

## 反馈

如果文档有不清晰或有错误的地方，欢迎反馈改进！
