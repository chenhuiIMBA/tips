# Claude Code Commands 完全指南

> 面向 AI 初学者的详细教程

---

## 目录

1. [什么是 Commands？](#1-什么是-commands)
2. [Commands 解决什么问题](#2-commands-解决什么问题)
3. [工作原理](#3-工作原理)
4. [所有 Commands 详解](#4-所有-commands-详解)
5. [使用场景](#5-使用场景)
6. [配置位置](#6-配置位置)

---

## 1. 什么是 Commands？

**Commands（命令）** 是预定义的"快捷操作"。

### 1.1 形象理解

| 类型           | 类比                 |
| ------------ | ------------------ |
| **Commands** | 手机快捷指令 - 按一下执行一串操作 |
| **普通对话**     | 手动操作 - 需要一步步说      |

### 1.2 为什么需要 Commands？

1. **节省时间** - 一个命令触发复杂工作流
2. **一致性** - 每次执行标准流程
3. **不用记** - 不用记住复杂步骤
4. **可复用** - 常用操作封装起来

---

## 2. Commands 解决什么问题

### 2.1 问题 1：每次都要详细说明

**场景**：代码审查

❌ **没有 Command**：

```
你：请帮我审查代码，检查安全性、性能、可读性，
   看看有没有硬编码密钥、SQL注入、XSS漏洞，
   函数是不是太长、命名是否清晰...

Claude：好的，我来逐个检查...
```

✅ **有 Command**：

```
你：/code-review

Claude：[调用 code-reviewer]
      开始标准审查流程...
```

### 2.2 问题 2：工作流容易遗漏步骤

**场景**：提交代码

❌ **没有 Command**：

- 写完代码
- 忘记审查
- 直接提交
- 之后发现有问题

✅ **有 Command**：

```
commit-push-pr 命令自动：
1. 运行测试
2. 代码审查
3. 创建提交
4. 推送
5. 创建 PR
```

### 2.3 问题 3：不知道有什么功能

**场景**：新用户

❌ **没有 Command**：

- 不知道有哪些命令
- 不知道怎么用
- 只能凭感觉问

✅ **有 Command 系统**：

- `/help` 看所有命令
- 每个命令有说明
- 直接调用

---

## 3. 工作原理

### 3.1 Command 的结构

每个 Command 是一个 Markdown 文件，位于 `~/.claude/commands/`：

```markdown
---
description: 创建实现计划
---

# Plan Command

这个命令调用 planner agent 来...

## 如何使用

[示例对话]

## 何时使用

## 相关命令
```

### 3.2 调用方式

#### 3.2.1 方式 1：斜杠命令

```
/plan
/tdd
/code-review
```

#### 3.2.2 方式 2：参数传递

```
/plan [功能描述]
/tdd 实现支付接口
```

#### 3.2.3 方式 3：通过 Skill 调用

```
commit-commands:commit
commit-commands:commit-push-pr
```

---

## 4. 所有 Commands 详解

### 4.1 核心命令

#### 4.1.1 `/plan` - 规划命令

**描述**: 创建实现计划，等待确认后再执行

**解决什么问题**:

- 避免盲目开始编码
- 明确实现步骤
- 识别潜在风险

**触发方式**:

```
/plan [功能描述]
```

**完整示例**：

**你输入**：

```
/plan 添加商品评论功能
```

**Planner Agent 输出**：

```markdown
# 实现计划: 商品评论功能

## 需求重述
用户可以对商品发表评论，包括：
- 评分（1-5星）
- 文字内容
- 图片上传
- 商家回复

## 实现阶段

### 阶段 1: 数据库设计
- [ ] comments 表（id, user_id, product_id, rating, content）
- [ ] comment_replies 表（回复功能）
- [ ] 索引优化（product_id, user_id）

### 阶段 2: 后端 API
- [ ] POST /api/comments - 发表评论
- [ ] GET /api/products/:id/comments - 获取评论
- [ ] POST /api/comments/:id/reply - 商家回复

### 阶段 3: 前端界面
- [ ] 评论列表组件（分页加载）
- [ ] 发表评论表单（星级选择）
- [ ] 图片上传预览

### 阶段 4: 测试
- [ ] 单元测试（业务逻辑）
- [ ] 集成测试（API）
- [ ] E2E 测试（完整流程）

## 依赖关系
- 阶段 2 依赖阶段 1
- 阶段 3 依赖阶段 2

## 风险评估
- 高风险: 恶意评论、刷单
- 缓解: 内容审核 + 频率限制

## 预计时间
- 后端: 4-6 小时
- 前端: 3-5 小时
- 测试: 2-3 小时
- 总计: 9-14 小时

---

**等待确认**: 是否按此计划执行？
- \`yes\` - 开始执行
- \`modify: [修改建议]\` - 调整计划
- \`no\` - 取消
```

---

#### 4.1.2 `/tdd` - 测试驱动开发命令

**描述**: 强制测试先行的开发流程

**解决什么问题**:

- 确保测试覆盖
- 先想清楚接口
- 减少 bug

**TDD 循环图示**:

```
        ┌─────────────────┐
        │               │
        ▼               │
    ┌───────┐          │
    │  RED  │          │ 写失败的测试
    └───────┘          │
        │               │
        ▼               │
    ┌───────┐          │
    │ GREEN │          │ 写最小实现
    └───────┘          │
        │               │
        ▼               │
    ┌───────────┐    │
    │ REFACTOR  │     │ 改进代码
    └───────────┘    │
        │               │
        └───────────────┘ 重复下一个功能
```

**完整示例**：

**你输入**：

```
/tdd 实现购物车数量更新功能
```

**TDD-Guide Agent 输出**：

```markdown
# TDD 会话: 购物车数量更新

## 步骤 1: 定义接口
\`\`\`typescript
interface UpdateQuantityRequest {
  delta: number  // 正数增加，负数减少
}

export async function updateQuantity(
  item: CartItem,
  request: UpdateQuantityRequest
): Promise<CartItem> {
  // TODO: 实现
  throw new Error('Not implemented')
}
\`\`\`

## 步骤 2: 编写失败的测试（RED）
\`\`\`typescript
describe('updateQuantity', () => {
  it('应该增加数量', async () => {
    const item = { productId: '1', quantity: 1 }
    const result = await updateQuantity(item, { delta: 2 })
    expect(result.quantity).toBe(3)
  })

  it('应该减少数量但不低于1', async () => {
    const item = { productId: '1', quantity: 3 }
    const result = await updateQuantity(item, { delta: -5 })
    expect(result.quantity).toBe(1) // 最小为1
  })

  it('数量为0时应该删除商品', async () => {
    const item = { productId: '1', quantity: 1 }
    const result = await updateQuantity(item, { delta: -1 })
    expect(result).toBeNull() // 删除标记
  })
})
\`\`\`

## 步骤 3: 运行测试 - 确认失败
\`\`\`bash
npm test cart.test.ts
FAIL - 3 tests failed
\`\`\`

## 步骤 4: 实现最小代码（GREEN）
\`\`\`typescript
export async function updateQuantity(
  item: CartItem,
  request: UpdateQuantityRequest
): Promise<CartItem | null> {
  const newQuantity = item.quantity + request.delta

  // 数量为0时返回null（删除标记）
  if (newQuantity <= 0) {
    return null
  }

  // 最小数量为1
  const finalQuantity = Math.max(newQuantity, 1)

  return {
    ...item,
    quantity: finalQuantity
  }
}
\`\`\`

## 步骤 5: 运行测试 - 确认通过
\`\`\`bash
npm test cart.test.ts
PASS - 3 tests passed
\`\`\`

## 步骤 6: 重构（IMPROVE）
\`\`\`typescript
const MIN_QUANTITY = 1
const DELETE_THRESHOLD = 0

function clampQuantity(value: number): number {
  return Math.max(value, MIN_QUANTITY)
}

function shouldDelete(newQuantity: number): boolean {
  return newQuantity <= DELETE_THRESHOLD
}

export async function updateQuantity(
  item: CartItem,
  request: UpdateQuantityRequest
): Promise<CartItem | null> {
  const newQuantity = item.quantity + request.delta

  if (shouldDelete(newQuantity)) {
    return null
  }

  return {
    ...item,
    quantity: clampQuantity(newQuantity)
  }
}
\`\`\`

## 步骤 7: 检查覆盖率
\`\`\`bash
npm test -- --coverage
Coverage: 100% ✅ (目标: 80%)
\`\`\`
```

---

#### 4.1.3 `/code-review` - 代码审查命令

**描述**: 对代码进行全面审查

**解决什么问题**:

- 发现潜在 bug
- 统一代码风格
- 安全检查

**审查输出示例**：

**你输入**：

```
/code-review
```

**Code-Reviewer Agent 输出**：

```markdown
# 代码审查报告

## 审查范围
- 时间: 最近 10 分钟
- 文件: 5 个修改文件
- 变更: +234 -56 行

## Critical 问题（必须修复）

### SQL 注入风险
\`\`\`typescript
const query = \`SELECT * FROM users WHERE id = ${userId}\`
\`\`\`
**修复**: 使用参数化查询

### 硬编码密钥
\`\`\`typescript
export const API_KEY = "sk-proj-xxxxx"
\`\`\`
**修复**: 移至环境变量

## Warning 问题（应该修复）

### 函数过长
\`calculateTotal()\` 函数有 156 行，建议拆分

## Suggestion（考虑改进）

### 类型可以更具体
\`\`\`typescript
function process(data: any) { }
\`\`\`

## 评分
| 类别 | 分数 | 说明 |
|------|------|------|
| 安全性 | 5/10 | ⚠️ 存在注入风险 |
| 可读性 | 7/10 | 良好 |
| 性能 | 8/10 | 良好 |
| 测试 | 4/10 | ⚠️ 覆盖不足 |

## 建议
修复 Critical 问题后再合并到主分支。
```

---

#### 4.1.3.1 `/python-review` - Python 代码审查命令

**描述**: Python 专用代码审查（PEP 8、类型提示、安全）

**解决什么问题**:

- Python PEP 8 合规性
- 类型注解完整性
- Pythonic 惯用法
- 安全漏洞（SQL注入、命令注入等）

**检查项目**:

| 类别           | 检查内容                       |
| ------------ | -------------------------- |
| **CRITICAL** | SQL/命令注入、不安全的反序列化、硬编码凭据    |
| **HIGH**     | 缺少类型提示、可变默认参数、静默吞没异常       |
| **MEDIUM**   | PEP 8格式、缺少文档字符串、使用 print() |

**自动运行工具**:

```bash
# 类型检查
mypy .

# 代码格式化和 linting
ruff check .
black --check .
isort --check-only .

# 安全扫描
bandit -r .

# 测试覆盖率
pytest --cov=app --cov-report=term-missing
```

**使用示例**:

```
/python-review
```

**输出示例**:

```markdown
# Python 代码审查报告

## Static Analysis Results
✓ ruff: No issues
✓ mypy: No errors
⚠️ black: 2 files need reformatting
✓ bandit: No security issues

## Issues Found
[CRITICAL] SQL Injection vulnerability
File: app/routes/user.py:42
Issue: User input directly interpolated into SQL query
```

---

#### 4.1.3.2 `/go-test` - Go 测试驱动开发命令

**描述**: Go 专用 TDD 命令（表驱动测试、覆盖率）

**解决什么问题**:

- 强制表驱动测试模式
- 确保 80%+ 覆盖率
- Go 特定测试模式（并行测试、基准测试）

**TDD 流程**:

```
RED    → 编写失败的表驱动测试
GREEN  → 实现最小代码
REFACTOR → 改进代码，保持测试通过
```

**测试模式**:

```go
// 表驱动测试
func TestValidateEmail(t *testing.T) {
    tests := []struct {
        name    string
        email   string
        wantErr bool
    }{
        {"simple email", "user@example.com", false},
        {"no at sign", "userexample.com", true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            err := ValidateEmail(tt.email)
            if (err != nil) != tt.wantErr {
                t.Errorf("ValidateEmail(%q) error mismatch", tt.email)
            }
        })
    }
}
```

**覆盖率检查**:

```bash
# 基本覆盖率
go test -cover ./...

# 覆盖率目标
| 代码类型         | 目标  |
|----------------|------|
| 关键业务逻辑    | 100%  |
| 公共 API       | 90%+  |
| 一般代码        | 80%+  |
```

**使用示例**:

```
/go-test 实现邮件验证功能
```

**输出示例**:

```markdown
# TDD Session: Email Validator

## Step 1: Define Interface
package validator

func ValidateEmail(email string) error {
    panic("not implemented")
}

## Step 2: Write Table-Driven Tests (RED)
// 创建测试用例...

## Step 3: Run Tests - Verify FAIL
$ go test ./validator/
FAIL: TestValidateEmail (0.00s)
    panic: not implemented

## Step 4: Implement Code (GREEN)
// 实现功能...

## Step 5: Run Tests - Verify PASS
PASS: coverage: 100.0%
```

---

#### 4.1.4 `/build-fix` - 构建修复命令

**描述**: 诊断并修复构建/编译错误

**修复示例**：

**你输入**：

```
npm run build
# 构建失败...

/build-fix
```

**Build-Error-Resolver Agent 输出**：

```markdown
# 构建错误分析

## 错误信息
\`\`\`
ERROR in src/app.ts(15,30):
TS2307: Cannot find module 'lodash' or its type declarations
\`\`\`

## 根本原因
TypeScript 编译器无法找到 lodash 模块的类型定义

## 修复方案
安装缺失的类型定义：
\`\`\`bash
npm install -D @types/lodash
\`\`\`

## 应用修复
\`\`\`bash
npm install -D @types/lodash
\`\`\`

## 验证修复
\`\`\`bash
npm run build
Build completed successfully ✅
\`\`\`
```

---

#### 4.1.5 `/test-coverage` - 测试覆盖率命令

**描述**: 检查并显示测试覆盖率

**输出示例**：

**你输入**：

```
/test-coverage
```

**Agent 输出**：

```markdown
# 测试覆盖率报告

## 总体覆盖率
| 指标 | 当前 | 目标 | 状态 |
|------|------|------|------|
| 语句覆盖率 | 72.3% | 80% | ⚠️ 不足 |
| 分支覆盖率 | 65.8% | 75% | ⚠️ 不足 |
| 函数覆盖率 | 78.5% | 80% | ⚠️ 不足 |
| 行覆盖率 | 72.3% | 80% | ⚠️ 不足 |

## 未覆盖的文件

| 文件 | 覆盖率 | 缺失内容 |
|------|---------|----------|
| src/utils/format.ts | 0% | 完全未测试 |
| src/api/payment.ts | 34.5% | 错误处理分支 |

## 需要补充的测试

### 高优先级
- [ ] src/utils/format.ts - 核心工具函数
- [ ] src/api/payment.ts - 涉及资金

## 建议
1. 优先测试工具函数（影响范围广）
2. 补充支付模块的错误场景测试
3. 使用 /tdd 命令编写新测试
```

---

### 4.2 工作流命令

#### 4.2.1 `/multi-plan` - 多模型协作规划

**描述**: 使用多个 AI 模型协同制定计划

**功能**:

- Codex (后端专家) + Gemini (前端专家) 并行分析
- 自动上下文检索
- 生成分步实现计划
- 保存计划到 `.claude/plan/` 目录

**使用示例**:

```
/multi-plan 实现用户评论功能
```

**输入**:

```
[功能描述] - 需要规划的功能描述
```

**输出**:

```markdown
# Implementation Plan: User Comments Feature

### Task Type
- [x] Frontend (→ Gemini)
- [x] Backend (→ Codex)
- [x] Fullstack (→ Parallel)

### Technical Solution
<综合 Codex + Gemini 分析的最优方案>

### Implementation Steps
1. Backend API - 评论 CRUD 端点
2. Database Schema - comments 表设计
3. Frontend Components - 评论列表和表单
4. Integration - API 调用和状态管理
...

### Key Files
| File | Operation | Description |
|------|-----------|-------------|
| src/api/comments.ts | Create | 评论 API 端点 |
| src/components/CommentList.tsx | Create | 评论列表组件 |

### SESSION_ID (for /multi-execute)
- CODEX_SESSION: <session_id>
- GEMINI_SESSION: <session_id>

---

**Plan generated and saved to `.claude/plan/user-comments.md`**

**Please review the plan. You can:**
- **Modify plan**: Tell me adjustments
- **Execute plan**: /multi-execute .claude/plan/user-comments.md
```

**何时使用**:

- 复杂全栈功能设计
- 需要多角度分析（后端/前端）
- 架构决策和风险评估

**关键特性**:
| 特性 | 说明 |
|------|------|
| 并行分析 | Codex 和 Gemini 同时工作 |
| 后端权威 | Codex 负责 API/数据库设计 |
| 前端权威 | Gemini 负责 UI/UX 设计 |
| 仅规划不执行 | 只生成计划，不修改代码 |

---

#### 4.2.2 `/multi-execute` - 多模型协作执行

**描述**: 执行 `/multi-plan` 生成的计划

**功能**:

- 读取 `.claude/plan/` 中的计划文件
- Codex 实现后端代码
- Gemini 实现前端代码
- 并行执行，提高效率
- Claude Code 负责文件写入

**使用示例**:

```
/multi-execute .claude/plan/user-comments.md
```

**输入**:

```
[计划文件路径] - /multi-plan 生成的计划文件路径
```

**输出**:

```markdown
# Multi-Model Execution Report

## Plan: User Comments Feature

### Phase 1: Backend Implementation (Codex)
✅ Created: src/api/comments.ts
✅ Created: src/types/comment.ts
✅ Modified: src/db/schema.ts

[代码生成详情]

### Phase 2: Frontend Implementation (Gemini)
✅ Created: src/components/CommentForm.tsx
✅ Created: src/components/CommentList.tsx
✅ Modified: src/pages/ProductPage.tsx

[代码生成详情]

### Phase 3: Integration (Claude Code)
✅ Connected components to API
✅ Added error handling
✅ Implemented loading states

## Files Created: 8
## Files Modified: 3
## Total Lines: +450

---

## Execution Summary
Status: ✅ COMPLETED

Backend (Codex): ✅ All tasks completed
Frontend (Gemini): ✅ All tasks completed
Integration: ✅ Connected successfully

## Next Steps
1. Run tests: npm test
2. Check coverage: /test-coverage
3. Review code: /code-review
4. Commit changes: /commit
```

**何时使用**:

- 执行 `/multi-plan` 生成的计划
- 大型功能实现（前后端并行）
- 需要快速开发

**关键特性**:
| 特性 | 说明 |
|------|------|
| 并行执行 | 后端和前端同时开发 |
| Session 复用 | 使用 /multi-plan 保存的 SESSION_ID |
| 文件写入权限 | 只有 Claude Code 可写文件 |
| 快速交付 | 提高开发效率 |

**工作流程**:

```
/multi-plan 生成计划
    ↓
保存 SESSION_ID
    ↓
/multi-execute 执行计划
    ↓
完成功能实现
```

---

#### 4.2.3 `/multi-frontend` - 前端专注模式

**描述**: 切换到前端开发模式

**功能**:

- 自动加载前端 Skills（React、Next.js、TypeScript）
- 使用 Gemini 作为前端专家
- 优化 UI/UX 和组件设计
- 专注于前端最佳实践

**使用示例**:

```
/multi-frontend
设计一个用户评论组件
```

**输入**: `[任务描述]` - 前端开发任务

**输出**:

```markdown
# Frontend Mode Activated ✅

## Loaded Skills
- ✓ frontend-patterns
- ✓ react-patterns
- ✓ typescript-patterns

## Expert: Gemini (Frontend Specialist)

### Component Design
[组件设计方案]

### Code Structure
[推荐的文件结构]

### Best Practices Applied
- Compound Components Pattern
- Custom Hooks for state management
- TypeScript for type safety

### Generated Component
[完整的组件代码]
```

**何时使用**: 前端组件开发、React/Next.js 项目、UI/UX 优化

---

#### 4.2.4 `/multi-backend` - 后端专注模式

**描述**: 切换到后端开发模式

**功能**:

- 自动加载后端 Skills（Node.js、Express、数据库）
- 使用 Codex 作为后端专家
- 优化 API 设计和数据库操作
- 专注于后端最佳实践

**使用示例**:

```
/multi-backend
实现评论 API 端点
```

**输入**: `[任务描述]` - 后端开发任务

**输出**:

```markdown
# Backend Mode Activated ✅

## Loaded Skills
- ✓ backend-patterns
- ✓ postgres-patterns
- ✓ api-design-patterns

## Expert: Codex (Backend Specialist)

### API Design
[API 设计方案]

### Database Schema
[数据库表结构设计]

### Code Structure
[推荐的文件结构]

### Best Practices Applied
- RESTful API 设计
- Repository 模式
- Service Layer 分层

### Generated API Code
[完整的 API 端点代码]
```

**何时使用**: API 开发、数据库设计、后端优化

---

#### 4.2.5 `/multi-workflow` - 通用多服务工作流

**描述**: 通用多服务协作模式

**功能**:

- 自定义工作流配置
- 跨服务协调
- 灵活的编排能力
- 支持自定义代理序列

**使用示例**:

```
/multi-workflow feature "实现支付功能"
```

**输入**:

```
[工作流类型] - feature/bugfix/refactor/security/custom
[任务描述]
```

**输出**:

```markdown
# Orchestration Report

## Workflow: feature
## Task: 实现支付功能

### Agent Sequence
1. Planner Agent → 分析需求，创建计划
2. TDD Guide Agent → 测试驱动开发
3. Code Reviewer Agent → 代码审查
4. Security Reviewer Agent → 安全审查

### Handoff Documents
每个代理间传递上下文和发现

### Final Report
汇总所有代理的输出和建议
```

**何时使用**: 复杂功能实现、多步骤任务、需要专业代理链

**工作流类型**:

- `feature` - 完整功能实现 (planner → tdd-guide → code-reviewer → security-reviewer)
- `bugfix` - Bug 修复 (explorer → tdd-guide → code-reviewer)
- `refactor` - 安全重构 (architect → code-reviewer → tdd-guide)
- `security` - 安全审查 (security-reviewer → code-reviewer → architect)

---

#### 4.2.6 `/pm2` - PM2 进程管理

**描述**: PM2 服务生命周期管理

**功能**:

- 自动检测项目服务（前端/后端/数据库）
- 生成 PM2 配置文件
- 管理多个服务的启停
- Windows/Mac/Linux 跨平台支持

**使用示例**:

```
/pm2
```

**自动检测的服务类型**:

- Vite - 前端开发服务器
- Next.js - React 框架
- Nuxt - Vue 框架
- Express/Node - 后端服务
- FastAPI/Flask - Python 后端
- Go - Go 语言服务

---

#### 4.2.7 `/sessions` - 会话管理

**描述**: 管理 Claude Code 会话历史

**功能**:

- 列出所有会话
- 加载历史会话
- 创建会话别名
- 查看会话详情

**使用示例**:

```
/sessions list              # 列出所有会话
/sessions load <id>         # 加载指定会话
/sessions alias <id> <name>  # 创建别名
/sessions info <id>         # 查看详情
/sessions aliases           # 列出所有别名
```

---

#### 4.2.8 Instinct 系列命令

##### `/instinct-status` - 查看学习的本能

**描述**: 显示所有学习的本能及其置信度

**功能**:

- 按领域分组显示本能
- 显示置信度评分
- 支持筛选和排序

**使用示例**:

```
/instinct-status                # 显示所有本能
/instinct-status --domain testing  # 筛选测试领域
/instinct-status --low-confidence  # 只显示低置信度
```

##### `/evolve` - 聚合本能为技能

**描述**: 将相关本能聚合为技能、命令或代理

**功能**:

- 分析本能模式
- 聚合为命令（用户主动触发）
- 聚合为技能（自动触发）
- 聚合为代理（复杂流程）

**使用示例**:

```
/evolve                    # 分析所有本能并建议演进
/evolve --domain testing   # 只演进测试领域的本能
/evolve --dry-run          # 预览不创建
```

---

#### 4.2.9 `/setup-pm` - 配置包管理器

**描述**: 交互式配置项目包管理器

**功能**:

- 自动检测包管理器（npm/pnpm/yarn/bun）
- 支持全局和项目级别配置
- 跨平台兼容

---

#### 4.2.10 `/skill-create` - 从 Git 历史生成技能

**描述**: 分析项目 Git 提交历史，提取编码模式并生成技能

**功能**:

- 本地分析（无需外部服务）
- 自动生成 SKILL.md 文件
- 支持生成 instinct 集合

**使用示例**:

```
/skill-create                # 分析当前仓库
/skill-create --instincts    # 同时生成 instincts
```

---

### 4.3 Git 命令

#### 4.3.1 `commit-commands:commit` - 创建提交

**描述**: 创建符合规范的 Git 提交

**执行流程**：

**你输入**：

```
/commit
```

**Agent 输出**：

```markdown
# Git 提交

## 检查变更
\`\`\`bash
git status
\`\`\`

修改文件:
- M src/user/service.ts
- M src/user/types.ts

## 分析差异
\`\`\`bash
git diff
\`\`\`

变更内容:
- 添加用户注册功能
- 实现 JWT 认证
- 添加输入验证

## 生成提交信息
\`\`\`
feat: 添加用户注册和JWT认证

- 实现 /api/users/register 端点
- 添加密码加密和 JWT 生成
- 实现登录验证中间件
\`\`\`

## 执行提交
\`\`\`bash
git add src/user/service.ts src/user/types.ts
git commit -m "feat: 添加用户注册和JWT认证"

✅ 提交已创建！
\`\`\`
```

---

#### 4.3.2 `commit-commands:commit-push-pr` - 提交并创建PR

**描述**: 完整的 Git 工作流

**执行流程**：

**你输入**：

```
/pr
```

**Agent 输出**：

```markdown
# Git 提交 + PR 创建

## 步骤 1: 检查状态
- 当前分支: feature/user-auth
- 是否有未推送: 是
- 是否有未提交: 否
✅ 状态正常

## 步骤 2: 代码审查
[运行 code-reviewer]
✅ 审查通过

## 步骤 3: 运行测试
[运行测试套件]
✅ 所有测试通过

## 步骤 4: 创建提交
[生成提交信息并提交]
✅ 提交已创建

## 步骤 5: 推送到远程
\`\`\`bash
git push -u origin feature/user-auth
\`\`\`
✅ 已推送

## 步骤 6: 创建 Pull Request
[分析完整提交历史]
[生成 PR 描述]
[创建 PR]

✅ PR 已创建！
🔗 https://github.com/owner/repo/pull/123
```

---

### 4.4 学习命令

#### 4.4.1 `/learn` - 提取可重用模式

**描述**: 从当前会话中提取学习到的模式

**执行示例**：

**你输入**：

```
/learn 这个 React 组件模式很好用
```

**Agent 输出**：

```markdown
# 提取模式

## 识别到的模式

**模式名称**: Compound Components with Context

**类别**: Frontend / React

**问题**: 多个组件需要共享状态

**解决方案**: 使用 React Context + Compound Components

**代码示例**:
\`\`\`typescript
const TabsContext = createContext(...)

export function Tabs({ children, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  )
}
\`\`\`

**何时使用**: 需要关联组件共享状态时

**已保存到**: ~/.claude/skills/learned/react-compound-components.md
```

---

#### 4.4.2 `/skill-create` - 从 Git 历史生成技能

**描述**: 分析项目的 Git 提交历史，提取编码模式

---

#### 4.4.3 `/evolve` - 将学习内容聚合成技能

**描述**: 将多个 instincts 整理成正式技能

---

### 4.5 其他命令

#### 4.5.1 `/verify` - 验证命令

**描述**: 检查项目健康状态

**功能**:

- 构建检查
- 类型检查
- Lint 检查
- 测试套件和覆盖率
- 安全扫描
- Diff 审查

**使用示例**:

```
/verify full
```

**输入**:

```
[模式] - quick/full/pre-commit/pre-pr
```

**输出**:

```markdown
VERIFICATION REPORT
==================

Phase 1: Build
  ✓ npm run build - PASSED

Phase 2: Type Check
  ✓ npx tsc --noEmit - PASSED

Phase 3: Lint
  ✗ npm run lint - 3 issues found
    src/api/user.ts:42:5 - Missing semicolon
    src/components/Button.tsx:15:3 - Unused import

Phase 4: Tests
  ✓ Tests: 247 passed, 0 failed
  ✓ Coverage: 87% overall

Phase 5: Security
  ✓ No secrets detected
  ✗ 1 outdated dependency (lodash < 4.17.21)

Phase 6: Diff Review
  Files changed: 5
  ✓ No console.log found

OVERALL: ⚠️ NOT READY for PR

Fix Required:
1. Fix 3 lint issues
2. Update lodash dependency
```

**何时使用**: PR 前、重大更改后、部署前验证

**验证模式**:
| 模式 | 说明 |
|------|------|
| `quick` | 仅构建 + 类型检查 |
| `full` | 所有检查（默认） |
| `pre-commit` | 提交相关检查 |
| `pre-pr` | 完整检查 + 安全扫描 |

---

#### 4.5.2 `/checkpoint` - 检查点命令

**描述**: 保存和管理工作进度检查点

**功能**:

- 创建命名检查点
- 验证当前状态与检查点的差异
- 列出所有检查点
- 自动记录 git SHA

**使用示例**:

```
/checkpoint create "feature-start"
/checkpoint verify "feature-start"
/checkpoint list
```

**输入**:

```
[操作] [名称] - create/verify/list/clear
```

**输出**:

```markdown
# Checkpoint Created ✅

Name: feature-start
Time: 2025-01-15 14:30
SHA: abc1234
Status: Clean

## State Snapshot
Build: PASS
Tests: 247 passed
Coverage: 87%

---

# Checkpoint Comparison: feature-start

Files changed: 12
Tests: +15 passed / -2 failed
Coverage: +3% / -1%
Build: PASS → PASS

## Changes Since Checkpoint
+ src/api/comments.ts (new)
+ src/components/CommentList.tsx (new)
M src/pages/ProductPage.tsx (modified)
...
```

**何时使用**: 功能里程碑、实验前保存状态、对比进度

---

#### 4.5.3 `/e2e` - E2E 测试命令

**描述**: 运行端到端测试（Playwright）

**功能**:

- 生成 Playwright 测试代码
- 运行跨浏览器测试
- 捕获失败截图/视频/追踪
- 识别不稳定测试
- 生成测试报告

**使用示例**:

```
/e2e Test the market search and view flow
```

**输入**:

```
[测试场景描述] - 用户流程测试场景
```

**输出**:

```markdown
# E2E Test Generation: Market Search Flow

## Test Scenario Identified
User Journey: Market Search → View Results → Click Market → View Details

## Generated Test Code
[完整的 Playwright 测试代码]

## Running Tests
Running 3 tests using 3 workers

✓ [chromium] › search-and-view.spec.ts:5:3 (4.2s)
✓ [chromium] › empty-state.spec.ts:3:3 (1.8s)
✓ [chromium] › clear-search.spec.ts:3:3 (2.9s)

3 passed (9.1s)

## Test Results
Status: ✅ ALL TESTS PASSED
Total: 3 tests
Passed: 3 (100%)
Duration: 9.1s

## Artifacts
📸 Screenshots: 2 files
📊 HTML Report: playwright-report/index.html
```

**何时使用**: 关键用户旅程测试、PR 前、部署前验证

**测试覆盖的关键流程**:

- 用户登录/注册
- 核心业务流程（下单、支付等）
- 多步骤表单
- 跨页面导航

---

#### 4.5.4 `/eval` - 评估命令

**描述**: 评估当前会话效果

**功能**:

- 分析会话效率
- 总结完成的工作
- 识别改进机会
- 生成学习建议

**使用示例**:

```
/eval
```

**输入**:

```
（无参数）
```

**输出**:

```markdown
# Session Evaluation Report

## Session Summary
Duration: 45 minutes
Messages: 23
Tasks Completed: 3

## Work Completed
✅ Added user authentication
✅ Implemented JWT tokens
✅ Created login UI

## Code Metrics
Files Created: 5
Files Modified: 3
Lines Added: +450
Tests Added: 12
Coverage: 85%

## Efficiency Analysis
Planning: 15% (good)
Implementation: 60% (optimal)
Debugging: 20% (acceptable)
Review: 5% (could improve)

## Learnings
- JWT middleware pattern
- Async/await error handling
- React context for auth state

## Suggestions for Next Session
1. Allocate more time for code review
2. Consider /plan command for complex features
3. Add more edge case tests
```

**何时使用**: 会话结束、项目总结、改进流程

---

#### 4.5.5 `/pm2` - PM2 初始化

**描述**: 配置 PM2 进程管理

**功能**:

- 自动检测项目服务（前端/后端/数据库）
- 生成 PM2 配置文件（ecosystem.config.js）
- 管理多个服务的启停
- 跨平台支持（Windows/Mac/Linux）

**使用示例**:

```
/pm2
```

**输入**:

```
（无参数，自动检测项目）
```

**输出**:

```markdown
# PM2 Configuration

## Detected Services
✓ Frontend: Vite dev server (port 3000)
✓ Backend: FastAPI (port 8000)
✓ Database: PostgreSQL (port 5432)

## Generated Configuration
Created: ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm run dev',
      cwd: './frontend',
      port: 3000
    },
    {
      name: 'backend',
      script: 'uvicorn main:app',
      cwd: './backend',
      port: 8000
    }
  ]
}

## Commands
Start all: pm2 start ecosystem.config.js
Stop all: pm2 stop all
Restart: pm2 restart all
Logs: pm2 logs
Monitor: pm2 monit
```

**何时使用**: 项目初始化、多服务管理、本地开发环境

**支持的服务类型**:

- Vite / Next.js / Nuxt（前端）
- Express / FastAPI / Flask / Go（后端）
- PostgreSQL / Redis / MongoDB（数据库）

---

#### 4.5.6 `/sessions` - 会话管理命令

**描述**: 查看和管理会话历史

**功能**:

- 列出所有会话
- 加载历史会话
- 创建会话别名
- 查看会话详情

**使用示例**:

```
/sessions list
/sessions load abc123
/sessions alias abc123 "user-auth-work"
/sessions info abc123
```

**输入**:

```
[操作] [参数]
```

**输出**:

```markdown
# All Sessions

| ID | Alias | Created | Messages | Duration |
|----|-------|---------|----------|----------|
| abc123 | user-auth-work | 2025-01-15 | 23 | 45m |
| def456 | - | 2025-01-14 | 15 | 30m |
| ghi789 | bug-fix | 2025-01-13 | 8 | 20m |

---

# Session Details: abc123

Alias: user-auth-work
Created: 2025-01-15 14:30
Duration: 45 minutes
Messages: 23

Topics:
- User authentication
- JWT tokens
- Login UI

Files Modified:
- src/api/auth.ts
- src/components/LoginForm.tsx

Related Sessions:
- def456 (follow-up on auth)
```

**何时使用**: 查找历史会话、恢复之前的工作、管理会话别名

---

#### 4.5.7 `/orchestrate` - 编排命令

**描述**: 编排复杂任务的多步骤执行

**功能**:

- 顺序调用多个专业代理
- 在代理间传递上下文
- 聚合所有输出
- 生成最终报告

**使用示例**:

```
/orchestrate feature "实现支付功能"
```

**输入**:

```
[工作流类型] [任务描述]

工作流类型:
- feature - 完整功能实现
- bugfix - Bug 修复
- refactor - 重构
- security - 安全审查
```

**输出**:

```markdown
ORCHESTRATION REPORT
====================
Workflow: feature
Task: 实现支付功能
Agents: planner → tdd-guide → code-reviewer → security-reviewer

SUMMARY
-------
成功实现了完整的支付功能，包括 Stripe 集成、支付 UI 和测试覆盖。

AGENT OUTPUTS
-------------
Planner: 设计了三层架构（API → Service → Stripe）
TDD Guide: 编写了 15 个测试，覆盖率达到 92%
Code Reviewer: 发现 3 个问题并修复
Security Reviewer: 确认 PCI 合规性

FILES CHANGED
-------------
Created: src/api/payment.ts, src/components/PaymentForm.tsx
Modified: src/lib/stripe.ts

TEST RESULTS
------------
15 passed, 0 failed
Coverage: 92%

SECURITY STATUS
---------------
✅ No hardcoded API keys
✅ Input validation in place
✅ HTTPS only

RECOMMENDATION
--------------
SHIP - Ready for production
```

**何时使用**: 复杂功能实现、需要专业代理链、多步骤任务

---

## 5. 使用场景

### 5.1 场景 1: 新功能开发完整流程

```
1. /plan 添加新功能
   → 看到完整计划
   → 确认执行

2. /tdd 实现功能
   → 测试驱动开发
   → 80%+ 覆盖率

3. /code-review 审查代码
   → 发现问题
   → 修复问题

4. /pr 提交并创建PR
   → 自动提交流程
   → PR 创建成功
```

### 5.2 场景 2: Bug 修复流程

```
1. 分析 Bug
   → 定位问题代码

2. /tdd 修复 Bug
   → 先写测试复现
   → 然后修复

3. /test-coverage 检查
   → 确保覆盖足够

4. /commit 提交修复
   → 规范提交信息
```

### 5.3 场景 3: 项目迁移

```
1. /multi-backend 切换后端模式
   → 加载后端技能

2. 执行迁移任务
   → 获得专业建议

3. /verify 验证迁移结果
   → 检查健康状态

4. /pr 创建迁移 PR
   → 完整提交流程
```

---

## 6. 配置位置

### 6.1 Commands 目录结构

```
~/.claude/commands/
├── plan.md               # 规划命令
├── tdd.md                # TDD 命令
├── code-review.md         # 代码审查
├── python-review.md       # Python 代码审查
├── go-test.md            # Go TDD
├── build-fix.md           # 构建修复
├── go-build.md           # Go 构建
├── go-review.md          # Go 审查
├── test-coverage.md      # 覆盖率检查
├── verify.md            # 验证
├── checkpoint.md        # 检查点
├── e2e.md              # E2E 测试
├── eval.md             # 评估
├── sessions.md          # 会话管理
├── orchestrate.md        # 编排
├── multi-plan.md        # 多模型规划
├── multi-execute.md     # 多模型执行
├── multi-workflow.md    # 多模型工作流
├── multi-frontend.md    # 前端模式
├── multi-backend.md     # 后端模式
├── learn.md            # 学习
├── evolve.md           # 聚合
├── instinct-export.md   # 导出 instincts
├── instinct-import.md   # 导入 instincts
├── instinct-status.md   # 查看 instincts
├── skill-create.md     # 创建技能
├── setup-pm.md        # PM2 配置
├── update-codemaps.md  # 更新代码地图
├── update-docs.md      # 更新文档
├── refactor-clean.md   # 清理重构
└── ...
```

### 6.2 Command 文件格式

每个 Command 是一个 Markdown 文件：

```markdown
---
description: 命令的简短描述
---

# Command 名称

## 这个命令做什么

## 如何使用

[示例对话]

## 何时使用

## 相关命令
```

---

## 7. 总结

| 类别      | 命令                                                  | 用途    |
| ------- | --------------------------------------------------- | ----- |
| **核心**  | /plan, /tdd, /code-review, /python-review, /go-test | 主要工作流 |
| **工作流** | /multi-*, /orchestrate                              | 协作模式  |
| **Git** | /commit, /pr, clean_gone                            | 版本控制  |
| **学习**  | /learn, /skill-create, /evolve                      | 知识积累  |
| **检查**  | /verify, /test-coverage                             | 质量保证  |

---

## 8. 下一步

- [Agents 文档](./01-agents.md) - 了解专业代理
- [Skills 文档](./02-skills.md) - 了解技能库
