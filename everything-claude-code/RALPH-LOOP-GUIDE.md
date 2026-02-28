# Ralph Loop 完全使用指南

> 自引用迭代开发循环系统

---

## 目录

1. [系统概述](#1-系统概述)
2. [核心概念](#2-核心概念)
3. [安装与配置](#3-安装与配置)
4. [使用指南](#4-使用指南)
5. [工作原理](#5-工作原理)
6. [使用场景](#6-使用场景)
7. [最佳实践](#7-最佳实践)
8. [故障排查](#8-故障排查)
9. [高级技巧](#9-高级技巧)

---

## 1. 系统概述

### 1.1 什么是 Ralph Loop

**Ralph Loop** 是一个**自引用迭代开发系统**，通过创建持续循环来驱动 AI 不断改进同一个任务。

### 1.2 形象理解

| 类型       | 传统开发    | Ralph Loop  |
| -------- | ------- | ----------- |
| **工作方式** | 一次性完成任务 | 持续迭代改进      |
| **输出质量** | 单次输出的结果 | 多次迭代优化的结果   |
| **停止机制** | 任务完成即停止 | 达成承诺或达到迭代次数 |
| **上下文**  | 每次独立    | 继承之前的工作     |

### 1.3 核心特性

```
┌─────────────────────────────────────────────────────────────┐
│                     Ralph Loop 工作流                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  初始任务: "构建一个 REST API"                                │
│      ↓                                                       │
│  [迭代 1] 创建基础 API 结构                                   │
│      ↓                                                       │
│  Stop Hook 触发 → 将输出反馈为输入                             │
│      ↓                                                       │
│  [迭代 2] 看到之前的工作，添加错误处理                          │
│      ↓                                                       │
│  Stop Hook 触发 → 将输出反馈为输入                             │
│      ↓                                                       │
│  [迭代 3] 看到改进，添加测试和文档                              │
│      ↓                                                       │
│  ... (重复直到达成完成承诺)                                    │
│      ↓                                                       │
│  输出: <promise>API 完成且测试通过</promise>                  │
│      ↓                                                       │
│  检测到完成标签 → 循环结束                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.4 可用命令

| 命令                   | 功能说明            |
| -------------------- | --------------- |
| `/ralph-loop`        | 启动 Ralph Loop   |
| `/ralph-loop --help` | 查看帮助信息          |
| `/cancel-ralph`      | 取消当前 Ralph Loop |

---

## 2. 核心概念

### 2.1 自引用循环

Ralph Loop 创建一个**反馈循环**，让 AI 能够：

1. **看到自己的工作** - 通过文件系统历史
2. **基于之前的工作改进** - 而非从头开始
3. **持续优化** - 每次迭代都在前一次基础上提升

### 2.2 Stop Hook 机制

```
正常流程:
  任务完成 → AI 试图退出 → Stop Hook 拦截 →
  检测是否达成完成承诺 →
    ├─ 否 → 将原任务作为新输入 → 继续迭代
    └─ 是 → 允许退出
```

### 2.3 完成承诺（Completion Promise）

**完成承诺**是 Ralph Loop 的退出条件之一：

```xml
<promise>YOUR_COMPLETION_PHRASE</promise>
```

**规则**:

- ✅ 必须在承诺**完全真实**时输出
- ❌ 禁止为了退出循环而输出虚假承诺
- ✅ 使用 `<promise>` XML 标签
- ✅ 承诺内容应清晰、可验证

### 2.4 两种退出方式

| 方式       | 参数                            | 说明               |
| -------- | ----------------------------- | ---------------- |
| **完成承诺** | `--completion-promise 'TEXT'` | AI 判断任务完成时输出承诺标签 |
| **最大迭代** | `--max-iterations N`          | 达到指定迭代次数后自动停止    |

---

## 3. 安装与配置

### 3.1 安装插件

Ralph Loop 是 Claude Code 官方插件，需要从官方插件市场安装：

```bash
# 在 Claude Code 中执行
/plugin marketplace add claude-plugins-official
/plugin install ralph-loop
```

### 3.2 验证安装

```bash
# 检查命令是否可用
ls ~/.claude/plugins/marketplaces/claude-plugins-official/plugins/ralph-loop/

# 应该看到:
# commands/ralph-loop.md
# commands/cancel-ralph.md
# scripts/setup-ralph-loop.sh
```

### 3.3 测试安装

```bash
# 查看帮助
/ralph-loop --help
```

**预期输出**:

```
Ralph Loop - Interactive self-referential development loop

USAGE:
  /ralph-loop [PROMPT...] [OPTIONS]

ARGUMENTS:
  PROMPT...    Initial prompt to start the loop

OPTIONS:
  --max-iterations <n>           Maximum iterations before auto-stop
  --completion-promise '<text>'  Promise phrase
  -h, --help                     Show this help message
...
```

---

## 4. 使用指南

### 4.1 基础用法

#### 示例 1: 无限循环迭代

```bash
# 启动无限循环（不推荐生产环境）
/ralph-loop 重构用户认证模块

# 输出:
🔄 Ralph loop activated in this session!

Iteration: 1
Max iterations: unlimited
Completion promise: none (runs forever)

⚠️  WARNING: This loop cannot be stopped manually!
```

#### 示例 2: 限制迭代次数

```bash
# 最多迭代 10 次
/ralph-loop 修复登录页面的样式问题 --max-iterations 10

# 输出:
🔄 Ralph loop activated in this session!

Iteration: 1
Max iterations: 10
Completion promise: none

修复登录页面的样式问题
```

#### 示例 3: 使用完成承诺

```bash
# 使用完成承诺（推荐）
/ralph-loop 创建一个待办事项 API --completion-promise 'API 完成且测试通过'

# 输出:
🔄 Ralph loop activated in this session!

Iteration: 1
Max iterations: unlimited
Completion promise: API 完成且测试通过

═══════════════════════════════════════════════════════════
CRITICAL - Ralph Loop Completion Promise
═══════════════════════════════════════════════════════════

To complete this loop, output this EXACT text:
  <promise>API 完成且测试通过</promise>

STRICT REQUIREMENTS (DO NOT VIOLATE):
  ✓ Use <promise> XML tags EXACTLY as shown above
  ✓ The statement MUST be completely and unequivocally TRUE
  ✓ Do NOT output false statements to exit the loop
...

创建一个待办事项 API
```

#### 示例 4: 组合使用

```bash
# 既有迭代限制又有完成承诺
/ralph-loop 优化数据库查询性能 \
  --completion-promise '查询响应时间小于 100ms' \
  --max-iterations 20
```

### 4.2 停止循环

#### 取消循环

```bash
# 取消当前 Ralph Loop
/cancel-ralph

# 输出示例:
Cancelled Ralph loop (was at iteration 5)
```

### 4.3 参数详解

#### PROMPT（任务描述）

```
语法: /ralph-loop [PROMPT...]

说明:
- 可以是单个词或多个词
- 不需要引号（除非有特殊字符）
- 这是每次迭代的核心任务

示例:
  /ralph-loop 构建用户管理系统
  /ralph-loop Fix the bug in authentication
  /ralph-loop "Create a REST API with JWT auth"
```

#### --max-iterations（最大迭代次数）

```
语法: --max-iterations <n>

参数说明:
  n = 0     → 无限循环（默认）
  n > 0     → 最多迭代 n 次

示例:
  /ralph-loop Task --max-iterations 5     # 最多 5 次迭代
  /ralph-loop Task --max-iterations 0     # 无限迭代
  /ralph-loop Task --max-iterations 100   # 最多 100 次迭代
```

#### --completion-promise（完成承诺）

```
语法: --completion-promise '<text>'

参数说明:
  text  → 完成时输出的承诺短语

规则:
  - 必须使用引号（多词承诺）
  - 承诺必须可验证
  - 只有在完全真实时才能输出

示例:
  /ralph-loop Task --completion-promise 'DONE'
  /ralph-loop Task --completion-promise 'All tests passing'
  /ralph-loop Task --completion-promise 'API documented and tested'
```

---

## 5. 工作原理

### 5.1 状态文件

Ralph Loop 通过 `.claude/ralph-loop.local.md` 文件维护状态：

```yaml
---
active: true                    # 循环是否激活
iteration: 3                    # 当前迭代次数
max_iterations: 10              # 最大迭代次数
completion_promise: "DONE"      # 完成承诺
started_at: "2025-02-13T10:30:00Z"  # 开始时间
---

重构用户认证模块                 # 原始任务
```

### 5.2 Stop Hook 流程

```
┌─────────────────────────────────────────────────────┐
│ AI 完成工作，试图退出                                 │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
    ┌─────────────────────────────┐
    │ Stop Hook 检测到退出尝试      │
    └─────────────────┬───────────┘
                      │
                      ▼
          ┌───────────────────────┐
          │ 读取 ralph-loop 文件   │
          └───────────┬───────────┘
                      │
                      ▼
          ┌───────────────────────┐
          │ 检查退出条件            │
          └───────────┬───────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
  [达成完成承诺]              [达到最大迭代]
  [无限制模式]              [其他情况]
        │                           │
        │                           ▼
        │              ┌─────────────────────┐
        │              │ 增加迭代计数         │
        │              └──────────┬──────────┘
        │                         │
        │                         ▼
        │              ┌─────────────────────┐
        │              │ 将原始任务作为新输入  │
        │              └──────────┬──────────┘
        │                         │
        └─────────────┬───────────┘
                      │
                      ▼
            ┌─────────────────────┐
            │ AI 继续工作          │
            └─────────────────────┘
```

### 5.3 迭代过程

```
[迭代 N]
  ↓
AI 执行任务
  ↓
修改文件 / git commit
  ↓
AI 输出完成信息
  ↓
Stop Hook 拦截
  ↓
检查是否完成
  ├─ 是 → 输出 <promise> → 退出
  └─ 否 → 迭代计数 +1 → 返回原任务
```

---

## 6. 使用场景

### 6.1 场景 1: 代码重构

**适用情况**: 需要多次迭代优化的重构任务

```bash
# 启动重构循环
/ralph-loop 重构用户服务层，提高代码质量和可维护性 \
  --completion-promise '代码重构完成，测试覆盖率 85%+' \
  --max-iterations 15
```

**预期行为**:

```
迭代 1: 提取接口，分离关注点
迭代 2: 实现依赖注入
迭代 3: 添加错误处理
迭代 4: 编写单元测试
迭代 5: 提高测试覆盖率
...
迭代 10: 测试覆盖率达到 85%
→ 输出: <promise>代码重构完成，测试覆盖率 85%+</promise>
→ 循环结束
```

### 6.2 场景 2: 功能开发

**适用情况**: 需要持续完善的功能

```bash
# 启动功能开发循环
/ralph-loop 实现文件上传功能 \
  --completion-promise '文件上传功能完成，包含安全验证和测试'
```

**预期行为**:

```
迭代 1: 创建基础 API 端点
迭代 2: 添加文件类型验证
迭代 3: 添加文件大小限制
迭代 4: 实现安全扫描
迭代 5: 编写集成测试
迭代 6: 添加错误处理
...
→ 输出: <promise>文件上传功能完成，包含安全验证和测试</promise>
→ 循环结束
```

### 6.3 场景 3: Bug 修复

**适用情况**: 复杂的、需要多次尝试的 Bug

```bash
# 启动 Bug 修复循环
/ralph-loop 修复内存泄漏问题 \
  --completion-promise '内存泄漏已修复，profiling 验证通过' \
  --max-iterations 8
```

### 6.4 场景 4: 学习和实验

**适用情况**: 探索性任务，没有明确的完成标准

```bash
# 无限循环探索
/ralph-loop 尝试不同的缓存策略，找到最优方案 \
  --max-iterations 20
```

### 6.5 场景 5: 文档编写

**适用情况**: 需要持续完善的文档

```bash
# 启动文档完善循环
/ralph-loop 完善 API 文档，添加更多示例和用例 \
  --completion-promise '所有 API 端点都有完整文档和示例'
```

---

## 7. 最佳实践

### 7.1 完成承诺设计

#### ✅ 好的完成承诺

| 承诺                 | 优点     |
| ------------------ | ------ |
| `所有测试通过`           | 明确、可验证 |
| `API 响应时间 < 100ms` | 可量化    |
| `代码覆盖率 > 80%`      | 可测量    |
| `所有功能都有文档`         | 可检查    |

#### ❌ 不好的完成承诺

| 承诺      | 问题    |
| ------- | ----- |
| `完成`    | 太模糊   |
| `代码更好`  | 不可验证  |
| `尽量做了`  | 无明确标准 |
| `看起来不错` | 主观判断  |

### 7.2 迭代次数选择

| 任务类型      | 推荐迭代次数    | 理由   |
| --------- | --------- | ---- |
| 小型 Bug 修复 | 5-10      | 快速验证 |
| 中型功能开发    | 10-20     | 充分迭代 |
| 大型重构      | 20-50     | 多轮优化 |
| 探索性任务     | 50-100    | 深度实验 |
| 学习/实验     | 无限制（使用承诺） | 鼓励探索 |

### 7.3 监控循环进度

```bash
# 查看当前迭代
grep '^iteration:' .claude/ralph-loop.local.md

# 查看完整状态
head -10 .claude/ralph-loop.local.md

# 查看启动时间
grep 'started_at:' .claude/ralph-loop.local.md
```

### 7.4 安全建议

#### ⚠️ 重要警告

1. **不要在生产环境使用无限循环**
   
   ```bash
   # ❌ 危险
   /ralph-loop 修改生产代码
   
   # ✅ 安全
   /ralph-loop 修改代码 --max-iterations 10
   ```

2. **总是设置退出条件**
   
   ```bash
   # ❌ 可能失控
   /ralph-loop 任务
   
   # ✅ 有保护
   /ralph-loop 任务 --completion-promise '完成' --max-iterations 20
   ```

3. **定期检查进度**
   
   ```bash
   # 每次迭代后检查
   watch -n 5 'grep iteration .claude/ralph-loop.local.md'
   ```

### 7.5 完成承诺的诚实原则

**核心原则**: 只在承诺**完全真实**时输出

```
场景: 迭代 15/20，代码基本完成但测试未通过

❌ 错误做法:
  "迭代次数快到了，输出 <promise>完成</promise> 跳出循环"

✅ 正确做法:
  "测试还未通过，继续迭代修复测试问题"
  [迭代 16] 修复测试
  [迭代 17] 测试通过
  [迭代 18] 验证所有场景
  → 输出: <promise>完成</promise>
```

### 7.6 任务描述编写

#### ✅ 好的任务描述

```
# 具体、可操作
/ralph-loop 重构 UserService 类，提取接口和实现类

# 包含验收标准
/ralph-loop 添加 Redis 缓存层，要求响应时间 < 50ms

# 明确范围
/ralph-loop 为所有 API 端点添加输入验证和错误处理
```

#### ❌ 不好的任务描述

```
# 太模糊
/ralph-loop 优化代码

# 无明确目标
/ralph-loop 做点什么改进

# 范围过大
/ralph-loop 重构整个项目
```

---

## 8. 故障排查

### 8.1 常见问题

#### 问题 1: 循环无法停止

**症状**: Ralph Loop 持续运行，不退出

**原因**:

- 未设置退出条件
- 完成承诺无法达成
- 任务描述不清晰

**解决方案**:

```bash
# 方案 1: 取消循环
/cancel-ralph

# 方案 2: 修改状态文件
rm .claude/ralph-loop.local.md

# 方案 3: 重启 Claude Code
```

#### 问题 2: 完成承诺不生效

**症状**: 输出了 `<promise>` 但循环未退出

**原因**:

- 标签格式不正确
- Stop Hook 未正确配置
- 状态文件损坏

**解决方案**:

```bash
# 检查标签格式
# ✅ 正确
<promise>任务完成</promise>

# ❌ 错误
promise: 任务完成
<PROMISE>任务完成</PROMISE>
<promise>任务完成</promise >

# 检查状态文件
cat .claude/ralph-loop.local.md
```

#### 问题 3: 迭代次数不增加

**症状**: 迭代计数保持在 1

**原因**:

- Stop Hook 未触发
- 权限问题
- 状态文件锁定

**解决方案**:

```bash
# 检查文件权限
ls -la .claude/ralph-loop.local.md

# 检查 Stop Hook 配置
cat ~/.claude/settings.json | grep -A 10 'stop'
```

#### 问题 4: 插件未找到

**症状**: `/ralph-loop` 命令不存在

**解决方案**:

```bash
# 1. 检查插件是否安装
ls ~/.claude/plugins/marketplaces/claude-plugins-official/plugins/ralph-loop/

# 2. 重新安装
/plugin marketplace add claude-plugins-official
/plugin install ralph-loop

# 3. 重启 Claude Code
```

### 8.2 调试技巧

#### 启用详细日志

```bash
# 在 Claude Code 设置中启用调试
export CLAUDE_DEBUG=true
export RALPH_LOOP_DEBUG=true
```

#### 手动检查状态

```bash
# 查看完整状态
cat .claude/ralph-loop.local.md

# 检查循环是否激活
grep '^active:' .claude/ralph-loop.local.md

# 查看迭代次数
grep '^iteration:' .claude/ralph-loop.local.md
```

#### 模拟循环行为

```bash
# 手动创建状态文件
cat > .claude/ralph-loop.local.md << 'EOF'
---
active: true
iteration: 1
max_iterations: 5
completion_promise: "测试通过"
started_at: "2025-02-13T10:00:00Z"
---

测试任务
EOF

# 验证文件
cat .claude/ralph-loop.local.md
```

---

## 9. 高级技巧

### 9.1 组合工作流

#### 与 Git 结合

```bash
# 启动循环，每次迭代提交
/ralph-loop 实现新功能 \
  --completion-promise '功能完成且有 git commit'

# 每次迭代后检查 git 历史
git log --oneline -5
```

#### 与测试结合

```bash
# 循环直到所有测试通过
/ralph-loop 修复失败的测试 \
  --completion-promise '所有测试通过，覆盖率 80%+'
```

#### 与文档生成结合

```bash
# 循环完善文档
/ralph-loop 生成 API 文档 \
  --completion-promise '所有端点都有完整文档和示例'
```

### 9.2 分阶段迭代

```bash
# 阶段 1: 基础实现
/ralph-loop 实现用户认证 API --max-iterations 5

# 阶段 2: 完善功能
/ralph-loop 添加测试和文档 --max-iterations 5

# 阶段 3: 优化性能
/ralph-loop 优化性能 --completion-promise '响应时间 < 100ms'
```

### 9.3 迭代策略

#### 渐进式改进

```bash
# 每次迭代聚焦一个改进点
/ralph-loop 改进代码质量 \
  --completion-promise '代码符合所有最佳实践'
```

**迭代流程**:

```
迭代 1: 修复命名问题
迭代 2: 提取函数
迭代 3: 添加类型注解
迭代 4: 改进错误处理
迭代 5: 添加文档
...
```

#### 测试驱动

```bash
# 测试优先的开发循环
/ralph-loop 实现 TDD 工作流 \
  --completion-promise '所有功能都有测试且通过'
```

**迭代流程**:

```
迭代 1: 写测试（失败）
迭代 2: 实现功能（测试通过）
迭代 3: 重构代码
迭代 4: 添加边界测试
迭代 5: 优化性能
...
```

### 9.4 多项目协调

```bash
# 项目 A
cd /path/to/project-a
/ralph-loop 实现后端 API --completion-promise 'API 完成'

# 项目 B（新会话）
cd /path/to/project-b
/ralph-loop 实现前端 UI --completion-promise 'UI 完成'
```

### 9.5 性能优化

#### 减少上下文加载

```bash
# 使用具体的、范围较小的任务
/ralph-loop 优化 UserService 的查询方法 \
  --max-iterations 10

# 而不是
/ralph-loop 优化整个应用的性能  # 范围太大
```

#### 利用 Git 历史

```bash
# Ralph Loop 会看到之前的提交
/ralph-loop 改进错误处理

# 迭代 1 的提交会被迭代 2 看到
# 迭代 2 的提交会被迭代 3 看到
# ...
```

---

## 10. 总结

### 10.1 核心概念回顾

| 概念            | 说明                            |
| ------------- | ----------------------------- |
| **自引用循环**     | AI 能够看到并改进自己的工作               |
| **Stop Hook** | 拦截退出，将输出反馈为输入                 |
| **完成承诺**      | 基于真实完成的退出条件                   |
| **迭代计数**      | 限制最大迭代次数                      |
| **状态文件**      | `.claude/ralph-loop.local.md` |

### 10.2 使用决策树

```
任务是否需要多次迭代？
    │
    ├─ 否 → 直接完成，无需 Ralph Loop
    │
    └─ 是 → 有明确的完成标准？
           │
           ├─ 是 → 使用 --completion-promise
           │
           └─ 否 → 使用 --max-iterations
```

### 10.3 命令速查表

```bash
# 基础用法
/ralph-loop <任务描述>

# 限制迭代次数
/ralph-loop <任务> --max-iterations 10

# 使用完成承诺
/ralph-loop <任务> --completion-promise '完成'

# 组合使用
/ralph-loop <任务> --max-iterations 20 --completion-promise '测试通过'

# 查看帮助
/ralph-loop --help

# 取消循环
/cancel-ralph
```

### 10.4 相关资源

- **Ralph Loop 插件**: Claude Code 官方插件市场
- **Claude Code 文档**: https://docs.anthropic.com
- **Stop Hooks**: 参见 Claude Code hooks 文档

---

## 附录 A: 完成承诺模板

### 代码质量

```
--completion-promise '代码符合团队规范，lint 通过'
--completion-promise '测试覆盖率达到 80%'
--completion-promise '所有函数都有类型注解和文档'
```

### 功能完成

```
--completion-promise '所有用户故事都已完成'
--completion-promise 'API 文档完整且有示例'
--completion-promise '所有端点都有错误处理'
```

### 性能指标

```
--completion-promise '响应时间小于 100ms'
--completion-promise '内存使用减少 30%'
--completion-promise '查询性能提升 50%'
```

### 测试验证

```
--completion-promise '所有单元测试通过'
--completion-promise '集成测试覆盖核心流程'
--completion-promise 'E2E 测试验证关键路径'
```

---

## 附录 B: 状态文件示例

### 基础状态

```yaml
---
active: true
iteration: 1
max_iterations: 10
completion_promise: "完成"
started_at: "2025-02-13T10:00:00Z"
---

实现用户认证功能
```

### 运行中状态

```yaml
---
active: true
iteration: 5
max_iterations: 10
completion_promise: "测试通过"
started_at: "2025-02-13T10:00:00Z"
---

重构数据库层
```

### 即将完成状态

```yaml
---
active: true
iteration: 9
max_iterations: 10
completion_promise: "所有测试通过，覆盖率 85%+"
started_at: "2025-02-13T10:00:00Z"
---

实现缓存层
```

---

**文档版本**: v1.0
**最后更新**: 2025-02-13
**维护者**: Claude Code 用户社区
