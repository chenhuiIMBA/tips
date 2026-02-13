# Claude Code MCP 完全指南

> 面向 AI 初学者的详细教程

---

## 目录

1. [什么是 MCP？](#1-什么是-mcp)
2. [MCP 解决什么问题](#2-mcp-解决什么问题)
3. [工作原理](#3-工作原理)
4. [所有 MCP 服务器详解](#4-所有-mcp-服务器详解)
5. [使用场景](#5-使用场景)
6. [配置位置](#6-配置位置)

---

## 1. 什么是 MCP？

**MCP (Model Context Protocol)** 是让 AI 能够连接外部服务的协议。

### 1.1 形象理解

| 类型            | 类比             |
| ------------- | -------------- |
| **Claude AI** | 你的大脑 - 可以思考和推理 |
| **MCP 服务器**   | 你的感官和工具 - 扩展能力 |
| **MCP 协议**    | 神经连接方式         |

### 1.2 为什么需要 MCP？

1. **访问实时信息** - 不受训练数据截止限制
2. **操作外部系统** - 读写文件、调用 API
3. **扩展能力** - 图像分析、代码执行等
4. **保持安全** - 受控的访问权限

**没有 MCP 的 AI**:

```
你: 今天天气怎么样？
AI: 我的训练数据只到 2025 年...
无法获取最新信息
```

**有 MCP 的 AI**:

```
你: 今天天气怎么样？
AI: [使用 Web Search MCP]
[搜索最新天气]
[获取实时天气数据]
根据搜索结果，今天晴转多云...
```

---

## 2. MCP 解决什么问题

### 2.1 问题 1：无法访问实时信息

**场景**：问最新技术问题

❌ **没有 MCP**:

```
你: React 19 有什么新特性？
AI: 我的训练数据只到 2025 年...
    可能不知道 React 19 的新特性
```

✅ **有 Context7 MCP**:

```
你: React 19 有什么新特性？
Claude: [使用 Context7 MCP]
      [查询 React 最新文档]

      React 19 新特性：
      - 新的 Compiler
      - use() API
      - Server Components 改进
      ...
```

### 2.2 问题 2：无法操作文件系统

**场景**：需要分析项目代码

❌ **没有 MCP**:

```
你: 分析我的项目结构
AI: 我无法直接访问文件
    请你把代码粘贴给我...
```

✅ **有 Filesystem MCP**:

```
你: 分析我的项目结构
Claude: [使用 Filesystem MCP]
      [读取目录结构]

      你的项目结构：
      src/
      ├── components/
      ├── utils/
      └── App.tsx
      ...
```

### 2.3 问题 3：无法分析图片

**场景**：UI 设计稿转代码

❌ **没有 MCP**:

```
你: 这是我的 UI 设计，帮我写代码
AI: 我无法"看"图片
    请你描述一下...
```

✅ **有 ZAI MCP**:

```
你: [上传设计稿]
Claude: [使用 ZAI MCP]
      [分析图片]

      这是一个登录表单，包含：
      - 邮箱输入框（蓝色边框）
      - 密码输入框（带眼睛图标）
      - 登录按钮（圆角 8px）

      生成的代码：
      [React + Tailwind CSS 代码]
```

---

## 3. 工作原理

### 3.1 MCP 架构

```
┌─────────────────────────────────────┐
│                                 │
│   Claude AI (主程序）          │
│                                 │
└─────────────────────────────────────┘
            │
            │ MCP 协议
            │
    ┌───────┴───────┬───────────┬──────────┐ ┌──▼─────┐
    │               │           │          │
┌──▼────┐└───▼────┘ └──▼─────┐ ┌──▼─────┐
│Context7│Filesystem│Memory   │WebSearch│WebReader│ZAI│ ...
└────────┴──────────┴─────────┴────────┴─────┘ └────────┴─────┘ └────────┘
    │               │           │          │
    └──▼──────┘   └──▼──────┘   └──▼──────┘   └──▼──────┘
 文档API   文件系统   知识图谱   搜索    网页     图像
```

### 3.2 MCP 通信流程

```
你需要某个功能
    ↓
Claude 识别需要哪个 MCP
    ↓
[通过 MCP 协议发送请求]
    ↓
MCP 服务器处理请求
    ↓
[返回结果]
    ↓
Claude 整合后回答你
```

---

## 4. 所有 MCP 服务器详解

### 4.1 Context7（文档查询）

**功能**: 获取编程库的最新文档

**解决的问题**:

- AI 训练数据过时
- 不知道最新 API 变化
- 查阅文档要手动

**工作原理**:

```
你问: Spring Boot 怎么用 @Transactional?

Claude: [使用 Context7 MCP]
      [查询 Spring Boot 文档数据库]

      [返回 Spring Boot 文档中关于 @Transactional 的详细说明和示例]
```

**使用场景**:

- 查询框架 API
- 查询库的最新用法
- 学习新功能的文档

---

### 4.2 Filesystem（文件系统）

**功能**: 读写文件、查看目录结构

**可用操作**:

| 操作                 | 说明      | 使用场景    |
| ------------------ | ------- | ------- |
| `read_file`        | 读取文件内容  | 查看配置文件  |
| `write_file`       | 写入文件    | 创建新文件   |
| `create_directory` | 创建目录    | 初始化项目结构 |
| `list_directory`   | 列出目录    | 浏览文件夹   |
| `directory_tree`   | 获取完整目录树 | 了解项目结构  |
| `search_files`     | 搜索文件    | 查找特定文件  |
| `move_file`        | 移动/重命名  | 重组文件    |
| `get_file_info`    | 获取文件元信息 | 查看文件大小等 |

**权限范围**: 只能访问配置的目录，默认是当前工作目录

---

### 4.3 Memory（知识图谱）

**功能**: 存储和检索结构化信息

**解决问题**:

- 长对话忘记上下文
- 需要重复说明背景
- 难以积累项目知识

**存储结构**:

```
实体 (Entity)
    ├── 名称
    ├── 类型
    ├── 观察 (Observations) - 事实信息
    └── 关系 (Relations) - 与其他实体的连接
```

**使用示例**:

```
你: 我的项目用的是 TypeScript + React

Claude: [使用 Memory MCP]
      [存储实体]
      → Entity: project
      → 观测: 技术栈 [TypeScript, React]
      → ...

[后续对话]
你: 帮我添加一个组件...

Claude: [使用 Memory MCP]
      [检索项目信息]
      → 记得你的项目用 TypeScript + React
      → 我会生成符合规范的代码...
```

---

### 4.4 Sequential-Thinking（序列思考）

**功能**: 复杂问题的多步骤推理

**解决问题**:

- 复杂问题直接回答可能错
- 需要展示思考过程
- 可以调整推理深度

**使用场景**:

- 复杂系统设计
- 多步骤问题分析
- 架构决策

---

### 4.5 ZAI MCP Server（图像分析）

**功能**: 多模态图像理解

#### 4.5.1 功能 1: UI 转代码

**输入**: UI 设计稿图片
**输出**: 前端代码

**示例**:

```
输入: 登录页面截图

输出:
- 页面结构分析
- 组件分解
- React + Tailwind CSS 代码
- 样式属性 (颜色、字体、间距)
```

#### 4.5.2 功能 2: 错误截图诊断

**输入**: 错误信息截图
**输出**: 问题分析和修复方案

**示例**:

```
输入: 编译错误截图

输出:
- 错误类型: TypeScript 类型错误
- 错误位置: 文件名:行号
- 根本原因: 模块未找到
- 修复方案: 安装缺失的包
```

#### 4.5.3 功能 3: 技术图表理解

**输入**: 架构图、流程图
**输出**: 结构分析和解释

**示例**:

```
输入: 系统架构图

输出:
- 各组件识别
- 数据流向说明
- 技术栈分析
- 潜在问题点
```

#### 4.5.4 功能 4: 数据可视化分析

**输入**: 图表、仪表板
**输出**: 数据解读和洞察

**示例**:

```
输入: 销售报表图表

输出:
- 图表类型: 折线图
- 趋势分析: 增长、下降
- 异常值: 峰值、低谷
- 关键发现: 季节性因素
```

---

### 4.6 Web-Search-Prime（网络搜索）

**功能**: 搜索最新网络信息

**解决问题**:

- AI 无法访问实时信息
- 最新技术、趋势不知道
- 最新解决方案找不到

**使用场景**:

- 查询最新技术文档
- 搜索错误解决方案
- 了解行业趋势

---

### 4.7 Web-Reader（网页读取）

**功能**: 获取网页的 Markdown 内容

**解决问题**:

- 无法访问特定网页
- 读取在线文档
- 分析网页内容

---

### 4.8 Zread（GitHub 阅读）

**功能**: 读取 GitHub 仓库的代码和文档

**解决问题**:

- 无法访问私有仓库
- 读取开源项目结构
- 搜索特定功能实现

---

## 5. 使用场景

### 5.1 场景 1: 分析现有项目

```
你: 分析我的项目

Claude: [使用 Filesystem MCP]
      [读取目录结构]
      [读取关键文件]

      项目分析：
      ─────────────────────────────────
      项目类型: React + TypeScript
      构建工具: Vite
      状态管理: Zustand
      样式方案: Tailwind CSS
      路由: React Router
      ...
```

### 5.2 场景 2: UI 设计转代码

```
你: [上传设计稿]

Claude: [使用 ZAI MCP - ui_to_artifact]
      [分析设计稿]

      设计分析：
      - 白色卡片容器
      - 蓝色主按钮 (#3B82F6)
      - 圆角 8px

      生成的代码：
      [完整的 React + Tailwind CSS 代码]
```

### 5.3 场景 3: 错误排查

```
你: [上传错误截图]

Claude: [使用 ZAI MCP - diagnose_error]
      [分析错误]

      错误诊断：
      - 类型: Module not found
      - 位置: src/app.ts:15
      - 原因: lodash 包未安装

      修复方案：
      npm install lodash
```

### 5.4 场景 4: 技术调研

```
你: Vue 和 React 哪个更适合新项目？

Claude: [使用 Web Search MCP]
      [搜索对比]

      根据搜索结果：
      - 就业市场: React 更多
      - 学习曲线: Vue 更低
      - 生态系统: React 更大
      ...
```

---

## 6. 配置位置

### 6.1 MCP 配置文件

MCP 服务器配置在 `~/.claude/settings.json` 或 `~/.claude/settings.local.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx -y @modelcontextprotocol/server-filesystem",
      "args": ["/home/user/work"]
    },
    "context7": {
      "command": "npx -y @upstash/context7-mcp"
    },
    "memory": {
      "command": "npx -y @modelcontextprotocol/server-memory"
    },
    "zai-mcp-server": {
      "command": "npx -y @z_ai/mcp-server"
    }
  }
}
```

### 6.2 查看 MCP 状态

```bash
claude mcp list
```

**输出示例**:

```
plugin:context7:context7: npx -y @upstash/context7-mcp - ✓ Connected
filesystem: npx -y @modelcontextprotocol/server-filesystem /home/user/work - ✓ Connected
memory: npx -y @modelcontextprotocol/server-memory - ✓ Connected
zai-mcp-server: npx -y @z_ai/mcp-server - ✓ Connected
web-search-prime: https://open.bigmodel.cn/api/mcp/web_search_prime/mcp (HTTP) - ✓ Connected
```

---

## 7. 总结

| MCP                     | 功能        | 使用场景        |
| ----------------------- | --------- | ----------- |
| **context7**            | 文档查询      | 获取最新 API 文档 |
| **filesystem**          | 文件操作      | 读写文件、分析项目   |
| **memory**              | 知识图谱      | 存储项目上下文     |
| **sequential-thinking** | 复杂推理      | 多步骤思考       |
| **zai-mcp-server**      | 图像分析      | UI转代码、错误诊断  |
| **web-search-prime**    | 网络搜索      | 查询最新信息      |
| **web-reader**          | 网页读取      | 获取在线文档      |
| **zread**               | GitHub 阅读 | 查询开源代码      |
| **magic**               | UI 组件库    | 获取 UI 组件实现  |

---

## 8. 下一步

- [Agents 文档](./01-agents.md) - 了解专业代理
- [Skills 文档](./02-skills.md) - 了解技能库
