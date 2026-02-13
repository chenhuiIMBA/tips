# Claude Code Rules 完全指南

> 面向 AI 初学者的详细教程

---

## 目录

1. [什么是 Rules？](#1-什么是-rules)
2. [Rules 解决什么问题](#2-rules-解决什么问题)
3. [工作原理](#3-工作原理)
4. [Common Rules 详解](#4-common-rules-详解)
5. [语言特定 Rules](#5-语言特定-rules)
6. [使用场景](#6-使用场景)
7. [配置位置](#7-配置位置)

---

## 1. 什么是 Rules？

**Rules（规则）** 是强制 AI 遵循的编码规范和最佳实践。

### 1.1 形象理解

| 类型         | 类比                |
| ---------- | ----------------- |
| **Claude** | 新员工 - 懂编程但不知道公司规范 |
| **Rules**  | 员工手册 - 规定必须遵守的规则  |
| **Skills** | 参考书 - 提供知识和建议     |

### 1.2 Rules vs Skills

| Skills（技能） | Rules（规则） |
| ---------- | --------- |
| "推荐这样做"    | "必须这样做"   |
| 提供参考和模式    | 检查合规性     |
| 你选择是否遵循    | AI 自动强制执行 |
| 被动知识       | 主动检查      |

**举例**：

- **Skill** 说："推荐用不可变更新"
- **Rule** 说："检测到变异代码，警告！"

---

## 2. Rules 解决什么问题

### 2.1 问题 1：代码风格不一致

**场景**：不同开发者写法不一样

❌ **没有 Rules**：

```typescript
// 开发者 A
function getUserData(u){return u.data}

// 开发者 B
const getUserData = (user) => {
  return user.userData
}

// 风格混乱，难以维护
```

✅ **有 Rules**：

```typescript
// Rules 规定：函数名用 camelCase
// Rules 规定：参数名用完整单词
// Rules 规定：必须有返回类型

function getUserData(user: User): UserData {
  return user.data
}
```

### 2.2 问题 2：容易犯错

**场景**：常见错误反复出现

❌ **没有 Rules**：

```typescript
async function fetchData(url: string) {
  const response = await fetch(url)
  return await response.json()  // 可能抛出错误
}
```

✅ **有 Rules**：

```typescript
// Rules 规定：所有 async 必须有 try-catch
async function fetchData(url: string): Promise<any> {
  try {
    const response = await fetch(url)
    return await response.json()
  } catch (error) {
    console.error('Fetch failed:', error)
    throw new Error(`Failed to fetch ${url}: ${error.message}`)
  }
}
```

### 2.3 问题 3：测试覆盖不足

**场景**：写代码忘了测试

❌ **没有 Rules**：

- 写完功能就完事了
- 测试想起来才写点
- 覆盖率很低

✅ **有 Rules**：

- Rules 规定最低 80% 覆盖率
- AI 会自动检查
- 提醒补充测试

---

## 3. 工作原理

### 3.1 Rule 的结构

Rules 按目录组织：

```
~/.claude/rules/
├── common/          # 通用原则（所有语言适用）
│   ├── coding-style.md
│   ├── patterns.md
│   ├── git-workflow.md
│   └── ...
├── typescript/      # TypeScript/JavaScript 特定
├── python/          # Python 特定
└── golang/          # Go 特定
```

### 3.2 Rule 文件格式

```markdown
# 主题名称

> 这个文件扩展 [common/xxx.md](../common/xxx.md)
> 包含特定语言的内容

## 规则 1
规则描述和示例

## 规则 2
...
```

### 3.3 Rule 的执行方式

```
你: 写个函数处理用户输入

Claude: [检查当前文件类型]
      [加载对应 Rules]
      [应用 Rules 规范]

      根据 TypeScript Rules：
      - 必须使用 Zod 验证
      - 必须有错误处理
      - 必须有类型注解

      生成的代码：
      [符合规范的代码]
```

---

## 4. Common Rules 详解

### 4.1 Coding-Style（编码风格）

**文件**: `~/.claude/rules/common/coding-style.md`

#### 4.1.1 规则 1: 不可变性（CRITICAL！）

这是最重要的规则，默认情况下**禁止直接修改对象**。

**为什么不可变很重要？**

```
可变代码的问题：
├── 难以调试 - 数据在哪里被改了不知道
├── 副作用难以追踪
├── 并发不安全
└── 容易引入 bug
```

**规则要求**:

```typescript
// ❌ 禁止：直接修改对象参数
function updateUser(user, name) {
  user.name = name  // 变异!
  return user
}

// ✅ 必须：创建新对象
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

```typescript
// ❌ 禁止：直接修改数组
function addItem(items, item) {
  items.push(item)  // 变异!
  return items
}

// ✅ 必须：创建新数组
function addItem(items, item) {
  return [...items, item]
}
```

#### 4.1.2 规则 2: 文件组织

**原则**: 多小文件 > 少大文件

```
❌ 避免：
├── utils.ts         (2000 行)
└── api.ts          (1500 行)

✅ 推荐：
├── utils/
│   ├── format.ts   (200 行)
│   ├── validate.ts (150 行)
│   └── convert.ts   (180 行)
└── api/
    ├── users.ts    (120 行)
    └── products.ts (100 行)
```

**文件大小限制**:

- 推荐: 200-400 行
- 上限: 800 行
- 超过: 必须拆分

#### 4.1.3 规则 3: 错误处理

**规则**: 在每个级别显式处理错误

```typescript
// ✅ 好：完整的错误处理
async function fetchData() {
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Operation failed:', error)
    throw new Error(`Detailed user-friendly message`)
  }
}

// ❌ 差：静默吞没错误
async function fetchData() {
  const response = await fetch(url)
  return await response.json()  // 错误被忽略
}
```

#### 4.1.4 规则 4: 函数设计

**原则**:

| 要求       | 说明         | 示例                                                                     |
| -------- | ---------- | ---------------------------------------------------------------------- |
| **单一职责** | 一个函数只做一件事  | ❌ `validateAndSaveAndNotify()`<br>✅ `validate()`, `save()`, `notify()` |
| **简短**   | 函数不超过 50 行 | 超过必须拆分                                                                 |
| **参数少**  | 最多 3-4 个参数 | 超过用对象参数                                                                |

```typescript
// ❌ 差：太多参数
function createUser(
  name: string,
  email: string,
  age: number,
  address: string,
  phone: string,
  role: string,
  department: string
) { }

// ✅ 好：对象参数
function createUser(data: {
  name: string
  email: string
  age: number
  address?: string
  phone?: string
  role: string
  department: string
}) { }
```

---

### 4.2 Patterns（设计模式）

**文件**: `~/.claude/rules/common/patterns.md`

#### 4.2.1 模式 1: Repository 模式

**问题**: 数据访问逻辑散落在各处

**解决**: 统一的数据访问接口

```typescript
// 定义接口（规则要求）
interface Repository<T> {
  findAll(filters?: Filters): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}

// 实现：细节可以不同
class PostgresUserRepository implements Repository<User> { }
class MongoUserRepository implements Repository<User> { }
class MemoryUserRepository implements Repository<User> { }

// 业务逻辑依赖接口，不关心实现
class UserService {
  constructor(private userRepo: Repository<User>) { }
}
```

#### 4.2.2 模式 2: API 响应格式

**规则**: 所有 API 响应必须有统一格式

```typescript
// 规则要求的格式
interface ApiResponse<T> {
  success: boolean        // 必需：操作是否成功
  data?: T              // 成功时有数据
  error?: string         // 失败时有错误信息
  meta?: {             // 可选：分页信息
    total: number
    page: number
    limit: number
  }
}

// 使用示例
app.get('/users', async (req, res) => {
  const users = await userService.list()

  // 成功响应
  res.json({
    success: true,
    data: users,
    meta: { total: users.length, page: 1, limit: 20 }
  })
})

app.get('/users/:id', async (req, res) => {
  const user = await userService.findById(req.params.id)

  if (!user) {
    // 失败响应
    return res.status(404).json({
      success: false,
      error: 'User not found'
    })
  }

  res.json({
    success: true,
    data: user
  })
})
```

---

### 4.3 Git-Workflow（Git 工作流）

**文件**: `~/.claude/rules/common/git-workflow.md`

#### 4.3.1 规则 1: 提交信息格式

**遵循**: Conventional Commits

```
<type>: <description>

[optional body]

[optional footer]
```

**允许的类型**:

| 类型         | 说明        | 示例                      |
| ---------- | --------- | ----------------------- |
| `feat`     | 新功能       | `feat: 添加用户登录`          |
| `fix`      | Bug 修复    | `fix: 修复支付金额计算错误`       |
| `refactor` | 重构（不改变功能） | `refactor: 重构订单处理逻辑`    |
| `perf`     | 性能优化      | `perf: 优化数据库查询`         |
| `docs`     | 文档更新      | `docs: 更新 API 文档`       |
| `test`     | 测试相关      | `test: 添加用户模块测试`        |
| `chore`    | 杂项（配置等）   | `chore: 更新依赖版本`         |
| `ci`       | CI/CD     | `ci: 添加 GitHub Actions` |

**示例**:

```
feat: 添加用户注册功能

- 实现邮箱验证
- 添加密码加密
- 发送欢迎邮件

Closes #123
```

---

### 4.4 Testing（测试规则）

**文件**: `~/.claude/rules/common/testing.md`

#### 4.4.1 规则 1: 测试覆盖率要求

**最低要求**: 80%

```bash
# 检查覆盖率
npm test -- --coverage

# 要求输出
File        | % Stmts | % Branch | % Funcs | % Lines
-------------|----------|----------|---------|--------
src/        |    85.2  |    82.1  |   85.7  |

# ✅ 85.2% >= 80%，通过
# ❌ 如果 < 80%，必须补充测试
```

#### 4.4.2 规则 2: 测试类型要求

**必须包含**:

| 测试类型       | 说明        | 示例                            |
| ---------- | --------- | ----------------------------- |
| **单元测试**   | 测试单个函数/组件 | `test('calculateTotal 正确计算')` |
| **集成测试**   | 测试模块交互    | `test('POST /users 创建用户')`    |
| **E2E 测试** | 测试完整用户流程  | `test('用户完成购买流程')`            |

---

### 4.5 Security（安全规则）

**文件**: `~/.claude/rules/common/security.md`

#### 4.5.1 规则 1: 密钥管理

**禁止**: 硬编码任何密钥

```typescript
// ❌ 禁止
const API_KEY = "sk-proj-xxxxx"
const DB_PASSWORD = "password123"

// ✅ 必须
const API_KEY = process.env.API_KEY
const DB_PASSWORD = process.env.DB_PASSWORD

// 验证存在
if (!API_KEY) {
  throw new Error('API_KEY not configured')
}
```

#### 4.5.2 规则 2: 输入验证

**规则**: 所有用户输入必须验证

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
  name: z.string().min(1).max(100)
})

// ✅ 使用前必须验证
export async function createUser(input: unknown) {
  const validated = schema.parse(input)
  return await db.users.create(validated)
}
```

---

### 4.6 Performance（性能优化）

**文件**: `~/.claude/rules/common/performance.md`

#### 4.6.1 策略 1: 模型选择

| 模型             | 用途            | 成本/性能              |
| -------------- | ------------- | ------------------ |
| **Haiku 4.5**  | 轻量级代理、频繁调用    | 90% Sonnet，3x 成本节省 |
| **Sonnet 4.5** | 主开发工作、编排多代理系统 | 最佳编码模型             |
| **Opus 4.5**   | 复杂架构决策、最大推理要求 | 最深推理能力             |

**使用原则**:

- Haiku → 轻量任务、代码生成
- Sonnet → 主要开发、多代理编排
- Opus → 复杂决策、研究分析

#### 4.6.2 策略 2: 上下文窗口管理

**避免使用最后 20% 的上下文窗口**用于：

- 大规模重构
- 跨多个文件的功能实现
- 调试复杂的交互

**低上下文敏感度任务**（可以安全使用）:

- 单文件编辑
- 独立工具创建
- 文档更新
- 简单 bug 修复

#### 4.6.3 策略 3: 扩展思考 + 计划模式

**扩展思考**默认启用，保留最多 31,999 tokens 用于内部推理。

**控制方式**:

| 方法               | 说明                                                      |
| ---------------- | ------------------------------------------------------- |
| **Toggle**       | Option+T (macOS) / Alt+T (Windows/Linux)                |
| **Config**       | 在 `~/.claude/settings.json` 中设置 `alwaysThinkingEnabled` |
| **Budget cap**   | 设置 `export MAX_THINKING_TOKENS=10000`                   |
| **Verbose mode** | Ctrl+O 查看思考输出                                           |

**深度推理任务**（需要复杂推理时）:

1. 确保启用扩展思考
2. 启用**计划模式**进行结构化方法
3. 使用多轮批评进行彻底分析
4. 使用**分角色子代理**获得不同视角：
   - 事实审查者
   - 高级工程师
   - 安全专家
   - 一致性审查者
   - 冗余检查者

#### 4.6.4 策略 4: 构建故障排除

如果构建失败：

1. 使用 **build-error-resolver** 代理
2. 分析错误消息
3. 增量修复
4. 每次修复后验证

---

### 4.7 Hooks（钩子系统）

**文件**: `~/.claude/rules/common/hooks.md`

#### 4.7.1 Hook 类型

| 类型              | 触发时机  | 用途        |
| --------------- | ----- | --------- |
| **PreToolUse**  | 工具执行前 | 验证、阻止、修改  |
| **PostToolUse** | 工具执行后 | 格式化、检查、提示 |
| **Stop**        | 会话结束时 | 最终验证      |

#### 4.7.2 自动接受权限

**谨慎使用**:

- ✅ 用于：受信任、明确定义的计划
- ❌ 禁用：探索性工作
- ⚠️ **从不使用** `dangerously-skip-permissions` 标志
- ✅ 在 `~/.claude.json` 中配置 `allowedTools` 来替代

#### 4.7.3 TodoWrite 最佳实践

使用 TodoWrite 工具来：

- ✅ 跟踪多步骤任务的进度
- ✅ 验证对指令的理解
- ✅ 启用实时调整
- ✅ 显示细粒度的实现步骤

**Todo list 可以揭示**:

- 顺序颠倒的步骤
- 缺失的项目
- 多余的不必要项目
- 错误的粒度
- 误解的需求

---

### 4.8 Agents（代理编排）

**文件**: `~/.claude/rules/common/agents.md`

#### 4.8.1 可用代理

位于 `~/.claude/agents/`:

| 代理                       | 目的     | 何时使用       |
| ------------------------ | ------ | ---------- |
| **planner**              | 实现规划   | 复杂功能、重构    |
| **architect**            | 系统设计   | 架构决策       |
| **tdd-guide**            | 测试驱动开发 | 新功能、bug 修复 |
| **code-reviewer**        | 代码审查   | 编写代码后      |
| **security-reviewer**    | 安全分析   | 提交前        |
| **build-error-resolver** | 修复构建错误 | 构建失败时      |
| **e2e-runner**           | E2E 测试 | 关键用户流程     |
| **refactor-cleaner**     | 清理死代码  | 代码维护       |
| **doc-updater**          | 文档更新   | 更新文档       |

#### 4.8.2 立即代理使用

**无需用户提示**:

1. **复杂功能请求** → 使用 **planner** 代理
2. **刚编写/修改的代码** → 使用 **code-reviewer** 代理
3. **bug 修复或新功能** → 使用 **tdd-guide** 代理
4. **架构决策** → 使用 **architect** 代理

#### 4.8.3 并行任务执行

**始终使用并行执行**处理独立操作：

```markdown
# ✅ 好：并行执行
Launch 3 agents in parallel:
1. Agent 1: Security analysis of auth module
2. Agent 2: Performance review of cache system
3. Agent 3: Type checking of utilities

# ❌ 差：顺序执行（当不必要时）
First agent 1, then agent 2, then agent 3
```

#### 4.8.4 多视角分析

对于复杂问题，使用**分角色子代理**:

| 角色         | 作用      |
| ---------- | ------- |
| **事实审查者**  | 验证事实准确性 |
| **高级工程师**  | 评估实现质量  |
| **安全专家**   | 检查安全漏洞  |
| **一致性审查者** | 检查内部一致性 |
| **冗余检查者**  | 识别重复逻辑  |

---

## 5. 语言特定 Rules

### 5.1 TypeScript/JavaScript Rules

**目录**: `~/.claude/rules/typescript/`

#### 5.1.1 规则 1: 不可变更新

```typescript
// ✅ 使用展开运算符
const updated = {
  ...original,
  field: newValue
}

// ❌ 不使用 Object.assign
const updated = Object.assign({}, original, { field: newValue })

// ❌ 不直接修改
original.field = newValue
```

#### 5.1.2 规则 2: 错误处理

```typescript
// ✅ async/await + try-catch
async function fetchData() {
  try {
    const result = await api.call()
    return result
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}
```

#### 5.1.3 规则 3: 类型注解

```typescript
// ✅ 所有函数必须有返回类型
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ✅ 参数必须有类型
function processUser(user: User) { }
```

---

### 5.2 Python Rules

**目录**: `~/.claude/rules/python/`

#### 5.2.1 规则 1: PEP 8 规范

```python
# ✅ 遵循 PEP 8 规范
def calculate_total(items: list[Item]) -> int:
    """计算总金额"""
    return sum(item.price for item in items)

# ❌ 不符合 PEP 8
def calcTotal(items):    # 函数名应该是 snake_case
    return sum(i.price for i in items)
```

#### 5.2.2 规则 2: 类型注解

```python
# ✅ 必须有类型注解
from typing import List, Optional

def find_user(user_id: int) -> Optional[User]:
    return database.query(User, user_id)

# ❌ 缺少类型注解
def find_user(user_id):
    return database.query(User, user_id)
```

#### 5.2.3 规则 3: 不可变数据

```python
# ✅ 使用 dataclass(frozen=True)
from dataclasses import dataclass

@dataclass(frozen=True)
class User:
    name: str
    email: str

# ✅ 使用 NamedTuple
from typing import NamedTuple

class Point(NamedTuple):
    x: float
    y: float
```

---

### 5.3 Golang Rules

**目录**: `~/.claude/rules/golang/`

#### 5.3.1 规则 1: 格式化

**强制**: gofmt 和 goimports

```bash
# 自动格式化
gofmt -w file.go

# 自动整理 import
goimports -w file.go
```

#### 5.3.2 规则 2: 错误处理

```go
// ✅ 好：总是检查错误
file, err := os.Open("file.txt")
if err != nil {
    log.Fatalf("failed to open: %v", err)
}
defer file.Close()

// ❌ 差：忽略错误
file, _ := os.Open("file.txt")
defer file.Close()
```

#### 5.3.3 规则 3: 接口设计

```go
// ✅ 好：接口小而专注
type Reader interface {
    Read(p []byte) (n int, err error)
}

// ❌ 差：接口太大
type FileOperation interface {
    Read() error
    Write() error
    Seek() error
    Close() error
    Stat() error
    // ... 20 more methods
}
```

---

## 6. 使用场景

### 6.1 场景 1: 新建项目

```
你：新建一个 TypeScript 项目

Claude: [检测到 TypeScript]
      [加载 typescript Rules]
      [加载 common Rules]

      根据 Rules：
      1. 使用不可变模式
      2. 添加类型注解
      3. 使用 try-catch 处理错误
      4. 文件保持在 800 行以内

      生成的项目结构：
      [符合规范的架构]
```

### 6.2 场景 2: 代码审查

```
你：这段代码符合规范吗？

Claude: [检测到 Python 代码]
      [加载 python Rules]
      [对照 Rules 检查]

      检查结果：
      ❌ 函数名应该用 snake_case
      ❌ 缺少类型注解
      ❌ 缺少文档字符串
      ✅ 错误处理正确
      ⚠️ 函数过长 (67 行，建议 < 50)
```

### 6.3 场景 3: 重构代码

```
你：重构这个模块

Claude: [加载对应 Rules]
      [根据 Rules 重构]

      重构原则：
      1. 保持不可变性
      2. 函数单一职责
      3. 文件大小控制
      4. 统一错误处理

      重构后的代码：
      [符合规范的代码]
```

---

## 7. 配置位置

### 7.1 Rules 目录结构

```
~/.claude/rules/
├── common/              # 通用原则
│   ├── coding-style.md  # 编码风格原则
│   ├── patterns.md      # 设计模式 (Repository, API响应格式)
│   ├── git-workflow.md  # Git工作流和提交格式
│   ├── testing.md       # 测试要求 (80%覆盖率)
│   ├── security.md      # 安全指南
│   ├── performance.md   # 性能优化策略
│   ├── hooks.md        # Hooks系统说明
│   └── agents.md       # Agent编排指南
│
├── typescript/          # TypeScript/JavaScript 特定
│   ├── coding-style.md  # 语言特定风格
│   ├── patterns.md      # 语言特定模式
│   ├── security.md     # 语言特定安全
│   └── testing.md      # 语言特定测试
│
├── python/              # Python 特定
│   ├── coding-style.md
│   ├── patterns.md
│   ├── security.md
│   └── testing.md
│
└── golang/              # Go 特定
    ├── coding-style.md
    ├── patterns.md
    ├── security.md
    └── testing.md
```

### 7.2 Rule 文件格式

```markdown
# 主题名称

> 这个文件扩展 [common/xxx.md](../common/xxx.md)
> 包含特定语言的内容

## 规则名称

规则描述和说明

### 示例

```language
// ✅ 正确
好的代码

// ❌ 错误
不好的代码
```

## 相关

- 参考 Skill: skill-name
  
  ```
  
  ```

---

## 8. 总结

| 类别             | 文件              | 主要规则                          |
| -------------- | --------------- | ----------------------------- |
| **通用**         | coding-style.md | 不可变性、文件组织、错误处理                |
| **通用**         | patterns.md     | Repository 模式、API 响应格式        |
| **通用**         | git-workflow.md | 提交信息格式                        |
| **通用**         | testing.md      | 80% 覆盖率、测试类型                  |
| **通用**         | security.md     | 密钥管理、输入验证                     |
| **通用**         | performance.md  | 模型选择、上下文管理、扩展思考、构建故障排除        |
| **通用**         | hooks.md        | Hook 类型、自动接受权限、TodoWrite 最佳实践 |
| **通用**         | agents.md       | 可用代理、并行任务执行、多视角分析             |
| **TypeScript** | typescript/*    | 不可变更新、类型注解                    |
| **Python**     | python/*        | PEP 8、类型注解、dataclass          |
| **Go**         | golang/*        | gofmt、错误处理、小接口                |

---

## 9. 下一步

- [Agents 文档](./01-agents.md) - 了解专业代理
- [Commands 文档](./03-commands.md) - 了解快捷命令
