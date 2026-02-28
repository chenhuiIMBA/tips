# Agent Teams 分步操作指南

以下每一步都提供可直接使用的 prompt，按顺序执行即可完成完整的 Agent Teams 工作流。

---

## 前置说明

- 所有操作都在 Claude Code 主对话中执行
- 你（用户）对 Claude 说的话就是 prompt
- Claude 作为 Team Lead 执行工具调用
- 以「实现一个 Near 场景登录功能」为示例任务

---

## 第一步：创建团队

**你的 prompt：**

```
创建一个 Agent Teams 团队，名称为 near-login，描述为「实现 Near 场景登录功能」
```

**Claude 会执行：**
```
TeamCreate:
  team_name: "near-login"
  description: "实现 Near 场景登录功能"
```

**验证：** Claude 会返回团队创建成功的信息，包含团队配置文件路径。

---

## 第二步：规划并创建任务

**你的 prompt：**

```
为 near-login 团队创建以下任务：

任务1：分析现有登录框架
- 描述：阅读 AbstractLoginHandler、AbstractLoginChecker 和相关 Checker 链，梳理登录流程的扩展点和模式
- 无依赖

任务2：实现 NearLoginChecker
- 描述：参考现有 Checker 实现，创建 Near 登录的签名验证 Checker，包含车辆证书链验证逻辑
- 依赖任务1

任务3：实现 NearLoginController
- 描述：创建 Near 登录的 HTTP 端点，接收请求并调用登录处理链
- 依赖任务2

任务4：编写单元测试
- 描述：为 NearLoginChecker 和 NearLoginController 编写完整的单元测试
- 依赖任务2（可与任务3并行）
```

**Claude 会执行：**
```
TaskCreate × 4（创建 4 个任务）
TaskUpdate（设置依赖关系）:
  任务2 blockedBy [1]
  任务3 blockedBy [2]
  任务4 blockedBy [2]
```

---

## 第三步：查看任务列表

**你的 prompt：**

```
列出 near-login 团队的所有任务，显示状态和依赖关系
```

**Claude 会执行：**
```
TaskList
```

**预期输出示例：**
```
ID | Subject              | Status  | Owner | BlockedBy
1  | 分析现有登录框架       | pending | -     | -
2  | 实现 NearLoginChecker | pending | -     | [1]
3  | 实现 NearLoginController | pending | -  | [2]
4  | 编写单元测试           | pending | -     | [2]
```

---

## 第四步：派生 Teammate 并分配任务

### 4a. 派生研究型 Agent（只读）

**你的 prompt：**

```
为 near-login 团队派生一个研究型 Agent：
- 名称：researcher
- 类型：Explore
- 任务：认领任务1（分析现有登录框架），阅读 passport-login-biz 中的 AbstractLoginHandler、AbstractLoginChecker 和已有的 Checker 实现，输出框架分析报告
- 将任务1分配给 researcher 并设为 in_progress
```

**Claude 会执行：**
```
Task:
  subagent_type: "Explore"
  team_name: "near-login"
  name: "researcher"
  prompt: "你是 near-login 团队的研究员。请认领任务1，分析 passport-login-biz 中的登录框架..."

TaskUpdate:
  taskId: "1"
  owner: "researcher"
  status: "in_progress"
```

### 4b. 派生开发型 Agent（可编辑）

**你的 prompt：**

```
为 near-login 团队派生一个开发型 Agent：
- 名称：developer
- 类型：general-purpose
- 说明：你是后端开发者，负责实现 Near 登录功能。启动后先查看 TaskList，等待任务1完成后认领任务2开始编码
```

**Claude 会执行：**
```
Task:
  subagent_type: "general-purpose"
  team_name: "near-login"
  name: "developer"
  prompt: "你是 near-login 团队的后端开发者。请查看 TaskList，当前任务2依赖任务1..."
```

### 4c. 派生测试型 Agent

**你的 prompt：**

```
为 near-login 团队派生一个测试型 Agent：
- 名称：tester
- 类型：tdd-guide
- 说明：你是测试工程师，负责编写 Near 登录相关的单元测试。启动后查看 TaskList，等待任务2完成后认领任务4
```

**Claude 会执行：**
```
Task:
  subagent_type: "tdd-guide"
  team_name: "near-login"
  name: "tester"
  prompt: "你是 near-login 团队的测试工程师。请查看 TaskList，等待任务2完成后认领任务4..."
```

> **提示：** 4b 和 4c 可以在同一条 prompt 中一起说，Claude 会并行派生两个 Agent。

---

## 第五步：协调 —— 传递研究成果

当 researcher 完成任务1返回分析结果后：

**你的 prompt：**

```
researcher 已完成框架分析。请：
1. 将任务1标记为 completed
2. 把分析结果发送给 developer，告诉他可以开始任务2了
3. 将任务2分配给 developer 并设为 in_progress
```

**Claude 会执行：**
```
TaskUpdate:
  taskId: "1"
  status: "completed"

SendMessage:
  type: "message"
  recipient: "developer"
  content: "框架分析完成。扩展点在 AbstractLoginHandler.registerCheckers()，你需要创建..."
  summary: "Framework analysis results for task 2"

TaskUpdate:
  taskId: "2"
  owner: "developer"
  status: "in_progress"
```

---

## 第六步：协调 —— 解除阻塞并行推进

当 developer 完成任务2后：

**你的 prompt：**

```
developer 已完成 NearLoginChecker 的实现。请：
1. 将任务2标记为 completed
2. 通知 developer 继续认领任务3（NearLoginController）
3. 通知 tester 可以开始任务4（编写测试）了
4. 分别将任务3和任务4设为 in_progress
```

**Claude 会执行：**
```
TaskUpdate: { taskId: "2", status: "completed" }

SendMessage: { type: "message", recipient: "developer", content: "任务2完成，请开始任务3..." }
SendMessage: { type: "message", recipient: "tester", content: "任务2完成，请开始任务4..." }

TaskUpdate: { taskId: "3", owner: "developer", status: "in_progress" }
TaskUpdate: { taskId: "4", owner: "tester", status: "in_progress" }
```

> 此时 developer 和 tester 并行工作：一个写 Controller，一个写测试。

---

## 第七步：检查进度

**你的 prompt：**

```
查看 near-login 团队当前所有任务的状态
```

**Claude 会执行：**
```
TaskList
```

**预期输出示例：**
```
ID | Subject                    | Status      | Owner     | BlockedBy
1  | 分析现有登录框架             | completed   | researcher | -
2  | 实现 NearLoginChecker       | completed   | developer  | -
3  | 实现 NearLoginController    | in_progress | developer  | -
4  | 编写单元测试                 | in_progress | tester     | -
```

---

## 第八步：动态追加任务（可选）

工作过程中发现需要新增任务：

**你的 prompt：**

```
为 near-login 团队追加一个任务：
- 任务5：编写集成测试
- 描述：编写 NearLoginController 的集成测试，模拟完整的 HTTP 请求流程
- 依赖任务3和任务4
- 分配给 tester
```

**Claude 会执行：**
```
TaskCreate:
  subject: "编写集成测试"
  description: "编写 NearLoginController 的集成测试..."
  activeForm: "Writing integration tests"

TaskUpdate:
  taskId: "5"
  addBlockedBy: ["3", "4"]
  owner: "tester"
```

---

## 第九步：关闭团队成员

所有任务完成后：

**你的 prompt：**

```
near-login 团队所有任务已完成。请依次向 researcher、developer、tester 发送关闭请求
```

**Claude 会执行：**
```
SendMessage: { type: "shutdown_request", recipient: "researcher", content: "所有任务已完成，请关闭" }
SendMessage: { type: "shutdown_request", recipient: "developer", content: "所有任务已完成，请关闭" }
SendMessage: { type: "shutdown_request", recipient: "tester", content: "所有任务已完成，请关闭" }
```

每个 Teammate 会回复 `shutdown_response`（approve: true），确认关闭。

---

## 第十步：删除团队

所有成员确认关闭后：

**你的 prompt：**

```
所有成员已关闭，删除 near-login 团队
```

**Claude 会执行：**
```
TeamDelete:
  team_name: "near-login"
```

---

## 常用 prompt 模板速查

| 操作 | prompt 模板 |
|------|------------|
| 创建团队 | `创建一个 Agent Teams 团队，名称为 {name}，描述为「{desc}」` |
| 创建任务 | `为 {team} 团队创建任务：{subject}，描述：{desc}，依赖任务{ids}` |
| 查看任务 | `列出 {team} 团队的所有任务` |
| 派生成员 | `为 {team} 团队派生一个 {type} 类型的 Agent，名称 {name}，负责 {task}` |
| 分配任务 | `将任务{id}分配给 {agent}，状态设为 in_progress` |
| 传递信息 | `把 {info} 发送给 {agent}` |
| 完成任务 | `将任务{id}标记为 completed` |
| 追加任务 | `为 {team} 团队追加任务：{subject}，依赖任务{ids}` |
| 关闭成员 | `向 {agent} 发送关闭请求` |
| 删除团队 | `删除 {team} 团队` |
| 并行派生 | `同时为 {team} 团队派生以下 Agent：{agent1}、{agent2}、{agent3}` |

---

## 注意事项

1. **派生多个成员时尽量写在一条 prompt 中**，Claude 会并行启动
2. **任务描述要详细**，因为 Teammate 有独立上下文，看不到主对话历史
3. **信息必须显式传递**，A 的分析结果不会自动出现在 B 的上下文中
4. **先关闭成员再删团队**，否则 TeamDelete 会失败
5. **Teammate 空闲是正常的**，发消息会自动唤醒
