# Claude Code Agent Teams 使用说明

## 目录

- [概述](#概述)
- [核心概念](#核心概念)
- [快速开始](#快速开始)
- [团队生命周期](#团队生命周期)
- [任务管理系统](#任务管理系统)
- [消息通信机制](#消息通信机制)
- [Agent 类型参考](#agent-类型参考)
- [完整工作流示例](#完整工作流示例)
- [高级用法](#高级用法)
- [最佳实践](#最佳实践)
- [常见问题](#常见问题)

---

## 概述

Agent Teams 是 Claude Code 中的多智能体协作框架，允许一个主 Agent（Team Lead）创建并协调多个子 Agent（Teammates）并行处理复杂任务。每个 Teammate 在独立的进程中运行，拥有各自的工具集和上下文，通过共享任务列表和消息机制进行协作。

### 适用场景

| 场景 | 说明 |
|------|------|
| 全栈功能开发 | 前端和后端工作并行进行 |
| 大规模重构 | 多个模块同时修改，保持测试通过 |
| 多步骤项目 | 研究、规划、编码阶段协作完成 |
| 代码审查 + 测试 | 审查和测试并行执行 |
| 复杂调试 | 多个角度同时排查问题 |

---

## 核心概念

### 1. Team（团队）

团队是协作的顶层单元，包含：
- **Team Lead**：创建团队的主 Agent，负责任务分配和协调
- **Teammates**：被 Team Lead 派生的子 Agent，执行具体任务
- **Task List**：团队共享的任务列表
- **Team Config**：团队配置文件，记录成员信息

文件结构：
```
~/.claude/teams/{team-name}/config.json   # 团队配置
~/.claude/tasks/{team-name}/              # 任务列表目录
```

### 2. Task（任务）

任务是工作的最小分配单元，具有以下属性：

| 属性 | 说明 |
|------|------|
| `id` | 唯一标识符 |
| `subject` | 简短标题（祈使句） |
| `description` | 详细描述，包含上下文和验收标准 |
| `activeForm` | 进行中时显示的动名词形式（如 "Running tests"） |
| `status` | `pending` → `in_progress` → `completed`（或 `deleted`） |
| `owner` | 负责人（Agent 名称） |
| `blocks` | 被本任务阻塞的任务 ID 列表 |
| `blockedBy` | 阻塞本任务的任务 ID 列表 |

### 3. Message（消息）

Agent 之间通过消息工具通信，支持：
- **Direct Message（私信）**：发给指定 Teammate
- **Broadcast（广播）**：发给所有 Teammate（慎用）
- **Shutdown Request/Response**：优雅关闭请求和响应
- **Plan Approval**：计划审批请求和响应

---

## 快速开始

### 第一步：创建团队

```
使用 TeamCreate 工具：
{
  "team_name": "my-feature",
  "description": "实现用户认证功能"
}
```

这会同时创建团队文件和对应的任务列表目录。

### 第二步：创建任务

```
使用 TaskCreate 工具：
{
  "subject": "实现登录 API 端点",
  "description": "创建 POST /api/login 端点，接受 email 和 password，返回 JWT token",
  "activeForm": "Implementing login API endpoint"
}
```

### 第三步：派生 Teammate 并分配任务

```
使用 Task 工具派生 Agent：
{
  "subagent_type": "general-purpose",
  "team_name": "my-feature",
  "name": "backend-dev",
  "prompt": "你是后端开发者，请查看任务列表并开始工作"
}
```

然后用 TaskUpdate 分配任务：
```
{
  "taskId": "1",
  "owner": "backend-dev",
  "status": "in_progress"
}
```

### 第四步：监控和协调

- Teammate 完成任务后会自动发送通知
- Team Lead 检查任务列表，分配新任务
- 所有工作完成后关闭团队

---

## 团队生命周期

```
┌─────────────┐
│ TeamCreate  │  创建团队和任务列表
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ TaskCreate  │  创建任务（可多次）
│ (多个)      │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Task (spawn agents) │  派生 Teammate
│ + TaskUpdate(owner) │  分配任务
└──────┬──────────────┘
       │
       ▼
┌──────────────────────────┐
│ 协作循环                  │
│  ├─ Teammate 执行任务     │
│  ├─ SendMessage 通信      │
│  ├─ TaskUpdate 更新状态    │
│  ├─ TaskList 检查进度      │
│  └─ 分配新任务 (循环)     │
└──────┬───────────────────┘
       │
       ▼
┌───────────────────────────┐
│ SendMessage(shutdown)     │  请求所有 Teammate 关闭
└──────┬────────────────────┘
       │
       ▼
┌─────────────┐
│ TeamDelete  │  清理团队资源
└─────────────┘
```

### 关键规则

1. **TeamDelete 前必须先关闭所有 Teammate**，否则会失败
2. **Teammate 空闲是正常状态**——发送消息后等待回复时会自动进入空闲
3. **消息自动投递**——不需要手动检查收件箱

---

## 任务管理系统

### TaskCreate —— 创建任务

```json
{
  "subject": "Run integration tests",
  "description": "运行 passport-http 模块的集成测试，确保所有测试通过",
  "activeForm": "Running integration tests"
}
```

**命名约定**：
- `subject`：祈使句（如 "Fix authentication bug"）
- `activeForm`：现在进行时（如 "Fixing authentication bug"）

### TaskList —— 查看所有任务

返回每个任务的摘要：id、subject、status、owner、blockedBy。

使用场景：
- 查看可领取的任务（status=pending, 无 owner, blockedBy 为空）
- 检查整体进度
- 完成当前任务后查找下一个任务

### TaskGet —— 获取任务详情

```json
{
  "taskId": "3"
}
```

返回完整信息，包括 description 和依赖关系。

### TaskUpdate —— 更新任务

```json
// 认领任务并开始工作
{ "taskId": "1", "owner": "backend-dev", "status": "in_progress" }

// 完成任务
{ "taskId": "1", "status": "completed" }

// 设置依赖：任务2必须等任务1完成
{ "taskId": "2", "addBlockedBy": ["1"] }

// 删除任务
{ "taskId": "3", "status": "deleted" }
```

### 任务依赖管理

```
任务1: 设计数据库 Schema
    ↓ blocks
任务2: 实现 DAO 层        (blockedBy: [1])
    ↓ blocks
任务3: 实现 Service 层    (blockedBy: [2])
    ↓ blocks
任务4: 实现 Controller 层 (blockedBy: [3])

任务5: 编写前端页面       (无依赖，可并行)
```

设置方式：
```json
// 任务1 阻塞 任务2
{ "taskId": "1", "addBlocks": ["2"] }

// 或者反向设置
{ "taskId": "2", "addBlockedBy": ["1"] }
```

---

## 消息通信机制

### Direct Message（私信）

发送给指定 Teammate，最常用的通信方式：

```json
{
  "type": "message",
  "recipient": "backend-dev",
  "content": "登录 API 完成后请通知我，我需要在此基础上集成前端",
  "summary": "Request login API completion notification"
}
```

### Broadcast（广播）

发送给所有 Teammate，**务必谨慎使用**（N 个成员 = N 次消息投递）：

```json
{
  "type": "broadcast",
  "content": "发现阻塞性 bug，所有人暂停当前工作",
  "summary": "Critical blocking bug found"
}
```

**仅在以下情况使用广播**：
- 发现阻塞性问题，需要全员知晓
- 重大公告，影响所有人的工作

**其他所有情况都应使用私信。**

### Shutdown Request（关闭请求）

请求 Teammate 优雅关闭：

```json
{
  "type": "shutdown_request",
  "recipient": "backend-dev",
  "content": "所有任务已完成，请关闭"
}
```

Teammate 收到后通过 shutdown_response 回复：

```json
// 同意关闭
{
  "type": "shutdown_response",
  "request_id": "abc-123",
  "approve": true
}

// 拒绝关闭（仍有工作）
{
  "type": "shutdown_response",
  "request_id": "abc-123",
  "approve": false,
  "content": "任务3还在进行中，需要再等待"
}
```

### Plan Approval（计划审批）

当 Teammate 使用 Plan Mode 时，Team Lead 可以审批或拒绝：

```json
// 批准计划
{
  "type": "plan_approval_response",
  "request_id": "abc-123",
  "recipient": "backend-dev",
  "approve": true
}

// 拒绝并给出反馈
{
  "type": "plan_approval_response",
  "request_id": "abc-123",
  "recipient": "backend-dev",
  "approve": false,
  "content": "请增加错误处理的说明"
}
```

### Teammate 空闲状态

Teammate 每次 turn 结束后会自动进入空闲状态。这是**完全正常**的行为：

- 空闲 ≠ 完成或不可用
- 空闲的 Teammate 可以接收消息，发送消息会自动唤醒
- 系统会自动发送空闲通知给 Team Lead
- 不需要对空闲通知做出反应，除非要分配新工作

---

## Agent 类型参考

通过 Task 工具的 `subagent_type` 参数选择 Agent 类型：

### 全能型

| 类型 | 工具集 | 适用场景 |
|------|--------|----------|
| `general-purpose` | 全部工具 | 编码、调试、全栈开发等 |
| `Bash` | 仅 Bash | Git 操作、命令执行 |

### 只读型（不能编辑文件）

| 类型 | 工具集 | 适用场景 |
|------|--------|----------|
| `Explore` | 读取、搜索 | 代码探索、快速查找 |
| `Plan` | 读取、搜索 | 架构设计、实现规划 |
| `planner` | 读取、搜索 | 复杂功能规划 |
| `architect` | 读取、搜索 | 系统设计、架构决策 |

### 专项型

| 类型 | 工具集 | 适用场景 |
|------|--------|----------|
| `code-reviewer` | 读取、Bash | 代码审查 |
| `go-reviewer` | 读取、Bash | Go 代码审查 |
| `security-reviewer` | 读取、编辑、Bash | 安全漏洞检测 |
| `tdd-guide` | 读取、编辑、Bash | 测试驱动开发 |
| `e2e-runner` | 读取、编辑、Bash | 端到端测试 |
| `build-error-resolver` | 读取、编辑、Bash | 构建错误修复 |
| `go-build-resolver` | 读取、编辑、Bash | Go 构建错误修复 |
| `refactor-cleaner` | 读取、编辑、Bash | 死代码清理 |
| `doc-updater` | 读取、编辑、Bash | 文档更新 |
| `database-reviewer` | 读取、编辑、Bash | PostgreSQL 优化 |

### 模型选择

通过 `model` 参数可以指定 Agent 使用的模型：

| 模型 | 适用场景 |
|------|----------|
| `haiku` | 轻量任务，高频调用，节省成本 |
| `sonnet` | 常规编码任务（默认） |
| `opus` | 复杂推理、架构决策 |

---

## 完整工作流示例

### 示例：实现一个新的登录方式

```
# === 第1步：创建团队 ===

TeamCreate:
  team_name: "near-login"
  description: "实现 Near 场景登录功能"

# === 第2步：规划任务 ===

TaskCreate:
  subject: "分析现有登录框架"
  description: "阅读 AbstractLoginHandler 和相关 Checker 链，理解扩展点"
  activeForm: "Analyzing login framework"

TaskCreate:
  subject: "实现 NearLoginChecker"
  description: "创建 Near 登录的签名验证 Checker"
  activeForm: "Implementing NearLoginChecker"

TaskCreate:
  subject: "实现 NearLoginController"
  description: "创建 Near 登录的 HTTP 端点"
  activeForm: "Implementing NearLoginController"

TaskCreate:
  subject: "编写单元测试"
  description: "为 Near 登录流程编写完整的测试用例"
  activeForm: "Writing unit tests"

# 设置依赖
TaskUpdate: { taskId: "2", addBlockedBy: ["1"] }
TaskUpdate: { taskId: "3", addBlockedBy: ["2"] }
TaskUpdate: { taskId: "4", addBlockedBy: ["2"] }   # 测试可以和 Controller 并行

# === 第3步：派生 Agent 并分配任务 ===

# 派生研究 Agent（只读，用于分析）
Task:
  subagent_type: "Explore"
  team_name: "near-login"
  name: "researcher"
  prompt: "分析 passport-login-biz 中的登录框架..."

TaskUpdate: { taskId: "1", owner: "researcher" }

# 派生开发 Agent（可编辑）
Task:
  subagent_type: "general-purpose"
  team_name: "near-login"
  name: "developer"
  prompt: "你是后端开发者，负责实现 Near 登录功能..."

# 派生测试 Agent
Task:
  subagent_type: "tdd-guide"
  team_name: "near-login"
  name: "tester"
  prompt: "你是测试工程师，负责编写 Near 登录的测试..."

# === 第4步：协调工作 ===

# researcher 完成分析后，将结果发送给 developer
SendMessage:
  type: "message"
  recipient: "developer"
  content: "框架分析完成。扩展点在 AbstractLoginHandler，你需要..."
  summary: "Framework analysis complete"

# 分配编码任务给 developer
TaskUpdate: { taskId: "2", owner: "developer", status: "in_progress" }

# developer 完成后，分配测试任务
TaskUpdate: { taskId: "4", owner: "tester", status: "in_progress" }

# === 第5步：关闭团队 ===

# 所有任务完成后
SendMessage:
  type: "shutdown_request"
  recipient: "researcher"
  content: "工作完成，请关闭"

SendMessage:
  type: "shutdown_request"
  recipient: "developer"
  content: "工作完成，请关闭"

SendMessage:
  type: "shutdown_request"
  recipient: "tester"
  content: "工作完成，请关闭"

# 等待所有 Teammate 确认关闭后
TeamDelete
```

### 示例：并行代码审查

```
# 创建团队
TeamCreate:
  team_name: "code-review"
  description: "多角度代码审查"

# 并行派生多个审查 Agent（在同一消息中）
Task: { subagent_type: "code-reviewer", name: "quality-reviewer", ... }
Task: { subagent_type: "security-reviewer", name: "security-reviewer", ... }
Task: { subagent_type: "go-reviewer", name: "perf-reviewer", ... }

# 三个审查者同时工作，完成后汇总结果
```

---

## 高级用法

### Worktree 隔离

使用 `isolation: "worktree"` 让 Agent 在独立的 git worktree 中工作，避免文件冲突：

```json
{
  "subagent_type": "general-purpose",
  "team_name": "my-team",
  "name": "feature-dev",
  "isolation": "worktree",
  "prompt": "在独立分支上实现新功能..."
}
```

适用于：
- 多个 Agent 需要同时修改代码
- 需要在不同分支上并行开发
- 防止 Agent 之间的文件修改冲突

### 后台运行

使用 `run_in_background: true` 让 Agent 在后台运行：

```json
{
  "subagent_type": "general-purpose",
  "name": "background-builder",
  "run_in_background": true,
  "prompt": "构建项目并运行测试..."
}
```

后台 Agent 不会阻塞主流程，可以通过 TaskOutput 检查输出。

### Plan Mode 协作

设置 `mode: "plan"` 要求 Teammate 提交计划等待审批：

```json
{
  "subagent_type": "general-purpose",
  "team_name": "my-team",
  "name": "cautious-dev",
  "mode": "plan",
  "prompt": "规划实现方案，提交审批后再编码..."
}
```

Team Lead 通过 `plan_approval_response` 审批或拒绝计划。

### 发现团队成员

Teammate 可以通过读取团队配置发现其他成员：

```
读取文件: ~/.claude/teams/{team-name}/config.json
```

配置中包含 `members` 数组，每个成员有：
- `name`：名称（**始终使用此字段进行通信和任务分配**）
- `agentId`：唯一标识符（仅供参考）
- `agentType`：角色类型

---

## 最佳实践

### 1. 任务粒度

- 每个任务应该是**明确、可独立完成**的工作单元
- description 中包含足够的上下文，让 Teammate 无需额外沟通即可开始
- 避免过于笼统的任务（如 "完成所有开发"）

### 2. 并行优先

- 独立任务应该并行分配给不同 Teammate
- 使用依赖关系（blocks/blockedBy）管理执行顺序
- 在一条消息中同时派生多个 Agent

### 3. 通信效率

- **默认使用私信**，避免广播
- 消息内容具体明确，减少来回沟通
- summary 字段简洁概括（5-10 词）
- 不要发送结构化 JSON 状态消息，用自然语言沟通

### 4. Agent 类型选择

- 只需要搜索/阅读代码 → 使用只读型（Explore, Plan）
- 需要编辑代码 → 使用 general-purpose 或对应专项型
- 简单快速任务 → 使用 `model: "haiku"` 节省成本
- 复杂推理任务 → 使用 `model: "opus"`

### 5. 资源管理

- 工作完成后及时发送 shutdown_request
- 等所有 Teammate 确认关闭后再 TeamDelete
- 避免创建过多 Teammate（每个都消耗 API 资源）

### 6. 任务领取规范（Teammate 视角）

- 完成任务后立即调用 TaskList 查找下一个可用任务
- **优先领取 ID 较小的任务**（低 ID 通常为高 ID 提供基础）
- 领取前确认任务无 blockedBy 依赖
- 使用 TaskUpdate 设置 owner 并标记 in_progress

### 7. 错误处理

- 任务遇到阻塞时保持 in_progress 状态，不要标记 completed
- 创建新任务描述需要解决的阻塞问题
- 通过消息通知 Team Lead 或相关 Teammate

---

## 常见问题

### Q: TeamDelete 失败怎么办？

A: TeamDelete 要求所有 Teammate 已关闭。先向每个活跃的 Teammate 发送 shutdown_request，等待确认后再 TeamDelete。

### Q: Teammate 一直空闲怎么办？

A: 空闲是正常状态。Teammate 发送消息后就会进入空闲，等待下一次输入。发送消息给空闲的 Teammate 会自动唤醒它。只有当空闲影响到实际工作进度时才需要关注。

### Q: 如何让两个 Teammate 直接通信？

A: Teammate 之间可以通过 SendMessage 直接发送私信。Team Lead 会在空闲通知中看到 peer DM 的简要摘要，无需干预。

### Q: 任务依赖如何自动解除？

A: 当一个任务标记为 completed 后，依赖于它的任务的 blockedBy 列表会自动更新。Teammate 可以通过 TaskList 发现新解除阻塞的任务。

### Q: 可以动态添加 Teammate 吗？

A: 可以。在团队运行过程中随时通过 Task 工具派生新的 Teammate，指定相同的 team_name 即可加入团队。

### Q: 如何查看 Teammate 的详细输出？

A: 对于后台运行的 Agent，使用 TaskOutput 工具查看输出。前台 Agent 的结果会直接返回给 Team Lead。

---

## 工具速查表

| 工具 | 用途 | 调用方 |
|------|------|--------|
| `TeamCreate` | 创建团队 | Team Lead |
| `TeamDelete` | 删除团队 | Team Lead |
| `TaskCreate` | 创建任务 | Team Lead / Teammate |
| `TaskList` | 查看任务列表 | 所有成员 |
| `TaskGet` | 获取任务详情 | 所有成员 |
| `TaskUpdate` | 更新任务状态/分配 | 所有成员 |
| `Task` | 派生 Teammate | Team Lead |
| `SendMessage` | 发送消息 | 所有成员 |
| `TaskOutput` | 查看后台 Agent 输出 | Team Lead |
| `TaskStop` | 停止后台任务 | Team Lead |
