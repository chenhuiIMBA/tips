# Subagent vs Agent Teams 对比

## 一、总览对比

| 维度 | Subagent（Task tool） | Agent Teams（TeamCreate） |
|------|----------------------|--------------------------|
| 本质 | 派活（一次性任务委托） | 组队（持久协作框架） |
| 核心工具 | `Task` | `TeamCreate` + `SendMessage` + `TaskCreate/Update/List` |
| 成员数量 | 单个子代理 | 多个持久成员 |
| 生命周期 | 任务完成即销毁 | 持久存在，需显式关闭 |

---

## 二、上下文机制

| 维度 | Subagent | Agent Teams |
|------|----------|-------------|
| 上下文来源 | 部分类型可继承主对话完整历史（单向快照）；普通类型仅有 prompt 内容 | 每个成员完全独立的上下文窗口 |
| 能否看到主对话 | 有 "access to current context" 的类型可以 | 不能，只能看到收到的消息 |
| 成员间上下文共享 | 不涉及（各子代理互不感知） | 不共享，必须通过 `SendMessage` 显式传递 |
| prompt 写法 | 有上下文继承时可简短引用；无继承时必须自包含 | 必须自包含所有必要信息 |
| resume 恢复 | 保留自身之前的完整上下文继续工作 | 成员持久存在，天然保持上下文连续 |

---

## 三、通信机制

| 维度 | Subagent | Agent Teams |
|------|----------|-------------|
| 通信方向 | 单向：主代理 → 子代理 → 返回结果 | 多向：成员间可互发消息 |
| 通信方式 | 仅通过 prompt 输入和结果返回 | `SendMessage`（私信、广播、关闭请求、计划审批） |
| 成员间直接通信 | 不支持 | 支持（Teammate 之间可发私信） |
| 主代理可见性 | 只能看到最终返回结果，看不到子代理内部过程 | Team Lead 可看到成员间 DM 的摘要（通过 idle 通知） |
| 消息投递 | 无（同步返回） | 自动投递，无需手动检查收件箱 |

---

## 四、任务管理

| 维度 | Subagent | Agent Teams |
|------|----------|-------------|
| 任务分配 | 通过 prompt 参数直接指定 | 通过 `TaskCreate` + `TaskUpdate`（owner）分配 |
| 任务追踪 | 无内置追踪（靠主代理自行管理） | 共享 `TaskList`，所有成员可查看/更新 |
| 任务依赖 | 不支持 | 支持 `blocks` / `blockedBy` 依赖链 |
| 动态调整 | 不支持（启动后无法改变任务） | 支持（运行时创建新任务、重新分配、调整依赖） |
| 任务状态流转 | 无 | `pending` → `in_progress` → `completed`（或 `deleted`） |

---

## 五、生命周期管理

| 维度 | Subagent | Agent Teams |
|------|----------|-------------|
| 创建 | `Task` 工具直接启动 | `TeamCreate` 创建团队 → `Task`（带 team_name）派生成员 |
| 运行 | 执行完毕自动结束 | 持久运行，每轮结束后进入 idle 等待下一次输入 |
| 恢复 | 通过 `resume` 参数 + agent ID 恢复 | 成员持久存在，发消息即唤醒 |
| 关闭 | 无需（自动结束） | 必须依次 `shutdown_request` → 等待 `shutdown_response` |
| 清理 | 无需 | 所有成员关闭后调用 `TeamDelete` |

---

## 六、执行模式

| 维度 | Subagent | Agent Teams |
|------|----------|-------------|
| 并行执行 | 一条消息中多个 `Task` 调用即可并行 | 多个成员天然并行工作 |
| 后台运行 | `run_in_background: true`，通过 `TaskOutput` 查看 | 成员始终在独立进程中运行 |
| 隔离模式 | `isolation: "worktree"` 创建独立 git worktree | 同样支持 worktree 隔离 |
| 权限控制 | `mode` 参数（plan、acceptEdits 等） | 同样支持，额外支持 `plan_approval_response` 审批流 |
| 模型选择 | `model` 参数（haiku/sonnet/opus） | 同样支持 |

---

## 七、成员感知

| 维度 | Subagent | Agent Teams |
|------|----------|-------------|
| 互相发现 | 不能（各子代理互不知道彼此存在） | 可以（读取 `~/.claude/teams/{name}/config.json`） |
| 知道谁在做什么 | 不能 | 可以（通过 `TaskList` 查看每个任务的 owner 和状态） |
| 协调决策 | 不支持 | 支持（成员可根据他人进展动态调整自己的工作） |

---

## 八、资源开销

| 维度 | Subagent | Agent Teams |
|------|----------|-------------|
| API 消耗 | 较低（一次性调用） | 较高（持久进程 + 消息传递开销） |
| 消息成本 | 无额外消息成本 | 每条 `SendMessage` 消耗 API 资源；广播 = N 倍 |
| 文件系统占用 | 无（或仅 worktree 临时目录） | `~/.claude/teams/` + `~/.claude/tasks/` 目录 |
| 管理复杂度 | 低（启动即用） | 高（需管理团队生命周期、任务依赖、成员关闭） |

---

## 九、适用场景对比

| 场景 | 推荐方案 | 原因 |
|------|----------|------|
| 搜索代码 / 查找文件 | Subagent | 独立任务，无需协调 |
| 单文件分析 / 审查 | Subagent | 一次性完成，直接返回结果 |
| 运行测试 / 构建 | Subagent | 命令执行类，不需要交互 |
| 多角度并行分析（安全 + 性能 + 质量） | Subagent | 各分析独立，最终汇总即可 |
| 全栈功能开发（前端 + 后端 + 测试） | Agent Teams | 需要根据彼此进展协调 |
| 大规模重构（多模块联动） | Agent Teams | 需要依赖管理和动态任务调整 |
| 长时间多阶段项目 | Agent Teams | 需要持久成员和状态延续 |
| 需要审批流的开发流程 | Agent Teams | 支持 Plan Approval 机制 |

---

## 十、决策流程图

```
需要多个 Agent 协作？
├── 否 → 单个 Subagent
└── 是
    ├── 任务之间独立，无需中间协调？
    │   └── 是 → 并行 Subagent（一条消息多个 Task 调用）
    └── 任务之间有依赖，需要动态协调？
        └── 是 → Agent Teams
```
