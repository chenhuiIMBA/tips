# Claude Code Agents 完全指南

> 面向 AI 初学者的详细教程

---

## 目录

1. [什么是 Agents？](#1-什么是-agents)
2. [Agents 解决什么问题](#2-agents-解决什么问题)
3. [工作原理](#3-工作原理)
4. [所有 Agents 详解](#4-所有-agents-详解)
   - [4.1 Planner Agent（规划专家）](#41-planner-agent规划专家)
   - [4.2 Code-Reviewer Agent（代码审查专家）](#42-code-reviewer-agent代码审查专家)
   - [4.3 TDD-Guide Agent（测试驱动开发专家）](#43-tdd-guide-agent测试驱动开发专家)
   - [4.4 Security-Reviewer Agent（安全审查专家）](#44-security-reviewer-agent安全审查专家)
   - [4.5 Build-Error-Resolver Agent（构建错误修复专家）](#45-build-error-resolver-agent构建错误修复专家)
   - [4.6 E2E-Runner Agent（端到端测试专家）](#46-e2e-runner-agent端到端测试专家)
   - [4.7 Refactor-Cleaner Agent（代码清理专家）](#47-refactor-cleaner-agent代码清理专家)
   - [4.8 Architect Agent（架构设计专家）](#48-architect-agent架构设计专家)
   - [4.9 Database-Reviewer Agent（数据库审查专家）](#49-database-reviewer-agent数据库审查专家)
   - [4.10 Python-Reviewer Agent（Python 代码审查专家）](#410-python-reviewer-agentpython-代码审查专家)
   - [4.11 Go-Reviewer Agent（Go 代码审查专家）](#411-go-reviewer-agentgo-代码审查专家)
   - [4.12 Doc-Updater Agent（文档更新专家）](#412-doc-updater-agent文档更新专家)
   - [4.13 Go-Build-Resolver Agent（Go 构建修复专家）](#413-go-build-resolver-agentgo-构建修复专家)
5. [使用场景](#5-使用场景)
6. [配置位置](#6-配置位置)
7. [总结](#7-总结)
8. [下一步](#8-下一步)

---

## 1. 什么是 Agents？

**Agents（代理）** 是专门负责特定任务的"智能助手"。

### 1.1 形象理解

想象你在一家公司工作：

| 角色           | 类比                     |
| ------------ | ---------------------- |
| **你 (主 AI)** | 项目经理 - 懂得很多，但不是每个领域的专家 |
| **Agents**   | 专业顾问团队 - 每个人只专注一个领域    |

当你需要做代码审查时，你不会自己凭感觉做，而是叫来 **code-reviewer** 这个专家顾问来帮忙。

### 1.2 为什么需要 Agents？

1. **专注性** - 每个 Agent 只做一件事，做得更好
2. **工具集** - 每个 Agent 有自己专门的工具
3. **一致性** - 每次审查标准都一样
4. **可追溯** - 知道是哪个 Agent 做的什么决定

---

## 2. Agents 解决什么问题

### 2.1 问题 1：盲目开始编码

**场景**：你说"帮我加个用户登录功能"

❌ **没有 Agent**：

- AI 直接开始写代码
- 写到一半发现不对
- 反反复复修改，浪费时间

✅ **有 Planner Agent**：

- 先停下来规划
- 列出需要做什么
- 等你确认后再开始

### 2.2 问题 2：代码质量不稳定

**场景**：今天写的代码和昨天写的标准不一样

❌ **没有 Agent**：

- 有时候检查严格，有时候宽松
- 容易漏掉安全问题
- 没有记录

✅ **有 Code-Reviewer Agent**：

- 每次用同一套标准检查
- 不漏掉安全问题
- 生成审查报告

### 2.3 问题 3：不知道怎么测试

**场景**：功能写完了，但不知道该怎么测试

❌ **没有 Agent**：

- 随便写几个测试
- 覆盖率很低
- 容易出 bug

✅ **有 TDD-Guide Agent**：

- 先写测试，再写代码
- 保证 80% 覆盖率
- 测试更全面

---

## 3. 工作原理

### 3.1 Agent 的结构

每个 Agent 是一个 Markdown 文件，位于 `~/.claude/agents/`：

```markdown
---
name: code-reviewer
description: 代码审查专家
model: opus
tools: ["Read", "Grep", "Glob"]
---

你是一个代码审查专家...

当被调用时：
1. 检查最近的代码变更
2. 按优先级列出问题
3. 提供修复建议
```

### 3.2 Agent 的激活方式

#### 3.2.1 方式 1：自动激活

某些 Agent 会在特定条件下自动激活：

```javascript
// settings.json 中的配置
"agents": {
  "code-reviewer": {
    "trigger": "after_edit",
    "file_types": ["*.ts", "*.js", "*.py"]
  }
}
```

当你编辑完代码文件后，code-reviewer 会自动运行。

#### 3.2.2 方式 2：手动调用

你直接告诉 Claude 使用某个 Agent：

```
你：帮我用 code-reviewer 审查这段代码

Claude：[调用 code-reviewer Agent]
开始审查...
```

#### 3.2.3 方式 3：通过命令

某些 Agent 通过命令触发：

```
/code-review
```

---

## 4. 所有 Agents 详解

### 4.1 Planner Agent（规划专家）

#### 4.1.1 解决的问题

避免"想到哪里写到哪里"的混乱编码方式。

#### 4.1.2 触发场景

- 新功能开发前
- 重构前
- 架构调整前
- 需求不明确时

#### 4.1.3 它怎么工作

```
你的请求
    ↓
[判断是否复杂？]
    ↓
  是 → 激活 Planner Agent
    ↓
[分析需求]
    ↓
[制定计划]
    ↓
[列出风险]
    ↓
[等待你确认]
    ↓
    你确认 → 开始执行
```

#### 4.1.4 实际示例

**你输入**：

```
/plan 添加用户收藏功能
```

**Planner Agent 输出**：

```markdown
# 实现计划: 用户收藏功能

## 需求重述

- 用户可以收藏市场
- 查看收藏列表
- 取消收藏
- 收藏数量上限 100

## 实现阶段

### 阶段 1: 数据库设计

- [ ] 创建 favorites 表
- [ ] 添加索引优化查询
- [ ] 编写迁移脚本

### 阶段 2: 后端 API

- [ ] POST /api/favorites - 添加收藏
- [ ] GET /api/favorites - 获取列表
- [ ] DELETE /api/favorites/:id - 删除

### 阶段 3: 前端界面

- [ ] 收藏按钮组件
- [ ] 收藏列表页面
- [ ] 空状态处理

## 依赖关系

- 阶段 2 依赖阶段 1
- 阶段 3 依赖阶段 2

## 风险评估

- 高风险: 收藏数量上限可能导致业务纠纷
- 中风险: 收藏数量多时性能问题

## 预计时间

- 后端: 2-3 小时
- 前端: 2-3 小时
- 测试: 1-2 小时
- 总计: 5-8 小时

等待确认: 是否按此计划执行? (yes/no/modify)
```

#### 4.1.5 你可以怎么回应

```
yes                    # 直接开始
modify: 去掉收藏上限  # 修改计划
no                     # 取消
```

#### 4.1.6 最佳实践

- **明确需求边界**：清楚定义做什么和不做什么
- **识别依赖关系**：哪些任务必须先完成
- **评估风险**：提前预见可能出现的问题
- **设置检查点**：每个阶段完成后验证

---

### 4.2 Code-Reviewer Agent（代码审查专家）

#### 4.2.1 解决的问题

保证代码质量、安全性、可维护性。

#### 4.2.2 触发场景

- 写完代码后自动触发
- 手动调用 `/code-review`
- Git commit 前检查

#### 4.2.3 它怎么工作

```
[代码变更检测]
    ↓
[运行 git diff]
    ↓
[分析变更内容]
    ↓
[检查清单逐项验证]
    ↓
[生成审查报告]
```

#### 4.2.4 检查清单

| 类别      | 检查项                  |
| ------- | -------------------- |
| **安全性** | 无硬编码密钥、无 SQL 注入、输入验证 |
| **质量**  | 命名清晰、无重复代码、函数简短      |
| **性能**  | 无 N+1 查询、适当使用索引      |
| **测试**  | 覆盖率足够、边界条件测试         |
| **文档**  | 复杂逻辑有注释、API 有说明      |

#### 4.2.5 实际示例

**你输入**：

```
/code-review
```

**Code-Reviewer Agent 输出**：

```markdown
# 代码审查报告

**文件**: src/market/api.ts

## Critical (必须修复)

### 硬编码密钥风险

\`\`\`typescript
const API_KEY = "sk-proj-xxxxx"  // ❌
\`\`\`

**修复**:

\`\`\`typescript
const API_KEY = process.env.MARKET_API_KEY
if (!API_KEY) {
  throw new Error('MARKET_API_KEY not configured')
}
\`\`\`

## Warning (应该修复)

### 函数过长

- `calculateOdds()` 函数有 120 行
- 建议：拆分成多个小函数

### 缺少错误处理

\`\`\`typescript
const data = await fetch(url)  // ❌ 无错误处理
\`\`\`

**修复**: 添加 try-catch

## Suggestion (考虑改进)

### 类型可以更具体

\`\`\`typescript
function process(data: any[]) { }  // 可以更具体
\`\`\`

## 评分

- 安全性: 6/10 (存在密钥泄露风险)
- 可读性: 7/10 (部分函数过长)
- 性能: 8/10 (良好)
- 测试: 5/10 (覆盖率不足)

## 总体评价

需要修复 Critical 问题后才能合并。
```

#### 4.2.6 最佳实践

- **分层审查**：先整体，后细节
- **提供建议**：不只说"有问题"，要给出解决方案
- **保持尊重**：批评代码，不批评人
- **关注改进**：帮助代码变得更好

---

### 4.3 TDD-Guide Agent（测试驱动开发专家）

#### 4.3.1 解决的问题

确保代码有足够的测试覆盖，遵循测试先行原则。

#### 4.3.2 触发场景

- 新功能开发
- Bug 修复
- 重构代码
- 手动调用 `/tdd`

#### 4.3.3 TDD 是什么？

TDD = Test-Driven Development（测试驱动开发）

核心原则：**先写测试，再写代码**

传统方式: 写代码 → 想到测试就写点 → 发现bug → 修复

TDD方式: 写测试 → 确认测试失败 → 写最小代码 → 测试通过 → 重构

#### 4.3.4 TDD 循环

```
┌─────────────────────────────────────┐
│                                 │
│   RED → GREEN → REFACTOR         │
│    ↑              │              │
│    └──────────────┘              │
│                                 │
└─────────────────────────────────────┘

RED:    写一个失败的测试
GREEN:  写最少代码让测试通过
REFACTOR: 改进代码，保持测试通过
```

#### 4.3.5 实际示例

**你输入**：

```
/tdd 实现一个计算折扣价的函数
```

**TDD-Guide Agent 输出**：

```markdown
# TDD 会话: 折扣价计算器

## 第 1 步: 定义接口（脚手架）

\`\`\`typescript
// types/pricing.ts
export interface DiscountRule {
  type: 'percentage' | 'fixed'
  value: number
  minAmount?: number
}

export interface CartItem {
  price: number
  quantity: number
}

export function calculateDiscount(
  items: CartItem[],
  rule: DiscountRule
): number {
  // TODO: 待实现
  throw new Error('Not implemented')
}
\`\`\`

## 第 2 步: 编写失败的测试（RED）

\`\`\`typescript
// tests/pricing.test.ts
import { calculateDiscount } from '../types/pricing'

describe('calculateDiscount', () => {
  it('应该按百分比计算折扣', () => {
    const items = [
      { price: 100, quantity: 2 }
    ]
    const rule = { type: 'percentage', value: 10 }

    const discount = calculateDiscount(items, rule)

    expect(discount).toBe(20) // 200 * 10% = 20
  })

  it('应该有最低消费限制', () => {
    const items = [
      { price: 50, quantity: 1 }
    ]
    const rule = {
      type: 'percentage',
      value: 10,
      minAmount: 100
    }

    const discount = calculateDiscount(items, rule)

    expect(discount).toBe(0) // 未达门槛，无折扣
  })

  it('空商品列表应该返回0', () => {
    const discount = calculateDiscount([], {
      type: 'percentage',
      value: 10
    })

    expect(discount).toBe(0)
  })
})
\`\`\`

## 第 3 步: 运行测试 - 确认失败

\`\`\`bash
npm test pricing.test.ts

FAIL tests/pricing.test.ts
  ✕ calculateDiscount
    ✕ 应该按百分比计算折扣 (2 ms)
    Error: Not implemented

3 tests failed
\`\`\`

测试按预期失败 ✅（因为我们还没实现）

## 第 4 步: 实现最小代码（GREEN）

\`\`\`typescript
// types/pricing.ts
export function calculateDiscount(
  items: CartItem[],
  rule: DiscountRule
): number {
  // 计算总价
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  // 检查最低消费
  if (rule.minAmount && total < rule.minAmount) {
    return 0
  }

  // 计算折扣
  if (rule.type === 'percentage') {
    return total * rule.value / 100
  } else {
    return Math.min(rule.value, total)
  }
}
\`\`\`

## 第 5 步: 运行测试 - 确认通过

\`\`\`bash
npm test pricing.test.ts

PASS tests/pricing.test.ts
  ✓ calculateDiscount
    ✓ 应该按百分比计算折扣 (2 ms)
    ✓ 应该有最低消费限制 (1 ms)
    ✓ 空商品列表应该返回0 (1 ms)

3 tests passed ✅
\`\`\`

## 第 6 步: 重构代码（IMPROVE）

\`\`\`typescript
// 改进: 提取常量，添加更多类型安全
const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed'
} as const

function calculateTotal(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
}

function meetsMinimumAmount(total: number, minAmount?: number): boolean {
  return !minAmount || total >= minAmount
}

export function calculateDiscount(
  items: CartItem[],
  rule: DiscountRule
): number {
  const total = calculateTotal(items)

  if (!meetsMinimumAmount(total, rule.minAmount)) {
    return 0
  }

  if (rule.type === DISCOUNT_TYPES.PERCENTAGE) {
    return total * rule.value / 100
  }

  return Math.min(rule.value, total)
}
\`\`\`

## 第 7 步: 验证测试仍然通过

\`\`\`bash
npm test pricing.test.ts
3 tests passed ✅
\`\`\`

## 第 8 步: 检查覆盖率

\`\`\`bash
npm test -- --coverage

File        | % Stmts | % Branch | % Funcs | % Lines
-------------|----------|----------|---------|--------
pricing.ts   |   100    |   100    |   100   |   100

Coverage: 100% ✅ (目标: 80%)
\`\`\`

TDD 会话完成! ✅
```

#### 4.3.6 最佳实践

- **小步快跑**：一次只写一个测试
- **保持简单**：GREEN 阶段写最简单的能通过的代码
- **持续重构**：REFACTOR 阶段不要怕改代码
- **高覆盖率**：目标是 80% 以上的测试覆盖率

---

### 4.4 Security-Reviewer Agent（安全审查专家）

#### 4.4.1 解决的问题

防止代码中出现安全漏洞。

#### 4.4.2 触发场景

- 实现认证功能时
- 处理用户输入时
- 创建 API 端点时
- 手动调用 `/security-review`

#### 4.4.3 检查的安全问题

| 类别       | 检查内容            |
| -------- | --------------- |
| **密钥管理** | 无硬编码密钥、使用环境变量   |
| **注入攻击** | SQL 注入、XSS、命令注入 |
| **认证授权** | 正确的权限检查         |
| **数据验证** | 输入验证、输出编码       |
| **加密**   | 敏感数据加密存储        |

#### 4.4.4 实际示例

**Security-Reviewer Agent 输出**：

```markdown
# 安全审查报告

## Critical 安全问题

### SQL 注入风险

\`\`\`python
# ❌ 危险
query = f"SELECT * FROM users WHERE name = '{user_input}'"
\`\`\`

**风险**: 攻击者可以输入 `admin' OR '1'='1` 绕过认证

**修复**:

\`\`\`python
# ✅ 安全
query = "SELECT * FROM users WHERE name = ?"
cursor.execute(query, [user_input])
\`\`\`

### XSS 漏洞

\`\`\`typescript
// ❌ 危险
<div>{userComment}</div>
\`\`\`

**风险**: 攻击者可以注入 `<script>alert('XSS')</script>`

**修复**:

\`\`\`typescript
// ✅ 安全
<div>{escapeHtml(userComment)}</div>
\`\`\`

### 硬编码密钥

\`\`\`typescript
// ❌ 危险
const apiKey = "sk-live-1234567890"
\`\`\`

**修复**: 移至环境变量

## 评分

- 密钥管理: 4/10
- 注入防护: 5/10
- 认证授权: 7/10
- 数据验证: 6/10

## 建议

所有 Critical 问题修复后才能部署到生产环境。
```

#### 4.4.5 最佳实践

- **零信任原则**：不信任任何用户输入
- **最小权限**：只授予必要的最小权限
- **纵深防御**：多层安全防护
- **定期审计**：定期进行安全审查

---

### 4.5 Build-Error-Resolver Agent（构建错误修复专家）

#### 4.5.1 解决的问题

当编译/构建失败时，快速诊断和修复错误。

#### 4.5.2 触发场景

- 构建失败时自动激活
- 编译错误时
- 手动调用 `/build-fix`

#### 4.5.3 它怎么工作

```
[构建失败]
    ↓
[解析错误信息]
    ↓
[分析根本原因]
    ↓
[搜索解决方案]
    ↓
[应用修复]
    ↓
[重新构建验证]
```

#### 4.5.4 实际示例

**你遇到错误**：

```
npm run build

ERROR in src/app.ts(15,30):
TS2307: Cannot find module 'lodash' or its type declarations
```

**Build-Error-Resolver Agent 分析**：

```markdown
# 构建错误分析

## 问题

TypeScript 无法找到 `lodash` 模块

## 根本原因

lodash 包未安装或类型定义缺失

## 修复方案

### 方案 1: 安装缺失的包

\`\`\`bash
npm install lodash
npm install -D @types/lodash
\`\`\`

### 方案 2: 如果已安装，检查 tsconfig.json

确保 `moduleResolution` 设置正确：

\`\`\`json
{
  "compilerOptions": {
    "moduleResolution": "node"
  }
}
\`\`\`

## 应用修复

正在执行方案 1...
```

#### 4.5.5 最佳实践

- **精确修复**：只修复错误，不做额外修改
- **理解原因**：不只复制解决方案，要理解为什么
- **验证修复**：确保构建真的通过
- **记录经验**：常见错误可以整理成文档

---

### 4.6 E2E-Runner Agent（端到端测试专家）

#### 4.6.1 解决的问题

确保关键用户流程正常工作。

#### 4.6.2 触发场景

- 重要功能开发完成后
- 发版前测试
- 手动调用 `/e2e`

#### 4.6.3 E2E 测试是什么？

E2E = End-to-End（端到端）

从用户角度测试完整流程：

```
单元测试:     测试单个函数
集成测试:     测试模块交互
E2E 测试:    测试完整用户旅程
```

#### 4.6.4 E2E 测试示例场景

```typescript
// e2e/user-journey.spec.ts
import { test, expect } from '@playwright/test'

test('用户购买商品完整流程', async ({ page }) => {
  // 1. 访问首页
  await page.goto('https://shop.example.com')

  // 2. 搜索商品
  await page.fill('[data-testid="search"]', 'iPhone')
  await page.click('[data-testid="search-button"]')

  // 3. 选择商品
  await page.click('text=iPhone 15 Pro')

  // 4. 加入购物车
  await page.click('text=加入购物车')

  // 5. 查看购物车
  await page.click('[data-testid="cart-icon"]')
  await expect(page.locator('.cart-item')).toHaveCount(1)

  // 6. 结账
  await page.click('text=去结算')
  await page.fill('[name="email"]', 'test@example.com')
  await page.click('text=提交订单')

  // 7. 确认订单成功
  await expect(page.locator('.order-success')).toBeVisible()
})
```

#### 4.6.5 最佳实践

- **测试关键路径**：只测试最重要的用户流程
- **使用 data-testid**：稳定的元素选择器
- **等待策略**：合理使用等待，避免不稳定
- **独立运行**：每个测试应该独立运行

---

### 4.7 Refactor-Cleaner Agent（代码清理专家）

#### 4.7.1 解决的问题

清理代码中的"技术债务"。

#### 4.7.2 触发场景

- 项目维护时
- 代码变混乱时
- 手动调用 `/refactor-clean`

#### 4.7.3 它清理什么

| 类型       | 示例             |
| -------- | -------------- |
| **死代码**  | 未被调用的函数、未使用的变量 |
| **重复代码** | 相同逻辑出现多次       |
| **过时代码** | 已废弃的 API 调用    |
| **注释代码** | 大段被注释的旧代码      |

#### 4.7.4 工作流程

```
[扫描代码库]
    ↓
[使用分析工具]
    ↓
[生成清理报告]
    ↓
[逐项确认删除]
    ↓
[验证清理后代码正常]
```

#### 4.7.5 常用工具

- **knip**：检测 JavaScript/TypeScript 未使用的文件
- **depcheck**：检测未使用的依赖
- **ts-prune**：检测 TypeScript 中未使用的导出
- **eslint**：检测未使用的变量和导入

#### 4.7.6 最佳实践

- **先备份**：清理前确保代码已提交
- **小步清理**：一次清理一部分，不要一次性大改动
- **测试验证**：清理后运行完整测试套件
- **团队协作**：确认删除的代码确实不再使用

---

### 4.8 Architect Agent（架构设计专家）

#### 4.8.1 解决的问题

确保系统架构合理、可扩展、易维护。

#### 4.8.2 触发场景

- 新项目启动时
- 重大架构决策时
- 系统重构前
- 手动调用 `/architect`

#### 4.8.3 关注点

| 方面       | 检查内容        |
| -------- | ----------- |
| **可扩展性** | 系统是否能承载增长   |
| **模块化**  | 是否高内聚、低耦合   |
| **性能**   | 是否满足性能要求    |
| **安全**   | 安全架构是否合理    |
| **可维护性** | 代码是否易于理解和修改 |

#### 4.8.4 实际示例

**你输入**：

```
/architect 设计一个实时聊天系统
```

**Architect Agent 输出**：

```markdown
# 系统架构设计: 实时聊天系统

## 架构选型

### 技术栈选择

- **前端**: React + WebSocket
- **后端**: Node.js + Socket.io
- **数据库**: PostgreSQL (消息) + Redis (在线状态)
- **消息队列**: Redis Pub/Sub

### 架构图

\`\`\`
┌─────────┐         ┌─────────┐         ┌─────────┐
│ Browser │◄───────►│Gateway  │◄───────►│ Service │
└─────────┘  WebSocket└─────────┘  HTTP   └─────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
              ┌─────▼─────┐   ┌───▼────┐   ┌───▼────┐
              │PostgreSQL │   │ Redis  │   │  S3    │
              │ (Messages)│   │(Status)│   │(Files) │
              └───────────┘   └────────┘   └────────┘
\`\`\`

## 核心模块

### 1. 消息服务

- 发送消息
- 消息持久化
- 消息历史查询

### 2. 在线状态服务

- 用户上线/下线
- 在线列表
- 心跳检测

### 3. 房间管理

- 创建房间
- 加入/离开房间
- 房间成员列表

## 扩展性考虑

### 水平扩展

- Gateway 无状态，可任意扩展
- 使用 Redis 共享在线状态
- 数据库分片策略

### 性能优化

- 消息本地缓存
- 批量消息发送
- 连接池管理

## 安全考虑

### 认证授权

- JWT token 验证
- 房间访问权限
- 消息加密传输

### 防滥用

- 消息频率限制
- 敏感词过滤
- 黑名单机制

## 部署架构

\`\`\`yaml
services:
  gateway:
    replicas: 3
    resources:
      limits:
        memory: "512Mi"
        cpu: "500m"

  message-service:
    replicas: 2

  redis:
    mode: cluster
    replicas: 3

  postgresql:
    mode: replication
    replicas: 2
\`\`\`
```

#### 4.8.5 最佳实践

- **渐进式架构**：从简单开始，随需求演进
- **分层架构**：清晰的职责分离
- **接口隔离**：模块间通过接口通信
- **可测试性**：架构应该便于测试

---

### 4.9 Database-Reviewer Agent（数据库审查专家）

#### 4.9.1 解决的问题

优化数据库查询、审查 Schema 设计、防止性能问题。

#### 4.9.2 触发场景

- 编写数据库查询时
- 设计新表结构时
- 性能问题时
- 手动调用 `/db-review`

#### 4.9.3 检查项

| 类别         | 检查内容                |
| ---------- | ------------------- |
| **索引**     | 缺失索引、冗余索引、索引选择      |
| **查询**     | N+1 问题、全表扫描、JOIN 优化 |
| **Schema** | 数据类型选择、范式与反范式       |
| **事务**     | 事务范围、锁问题            |
| **分区**     | 分区策略、分表分库           |

#### 4.9.4 实际示例

**Database-Reviewer Agent 输出**：

```markdown
# 数据库审查报告

## 查询分析

### N+1 查询问题

❌ **问题代码**:

\`\`\`python
users = User.objects.all()
for user in users:
    orders = user.orders.all()  # N+1 查询
\`\`\`

✅ **优化方案**:

\`\`\`python
users = User.objects.prefetch_related('orders')
for user in users:
    orders = user.orders.all()  # 使用预加载
\`\`\`

### 缺失索引

❌ **问题查询**:

\`\`\`sql
SELECT * FROM orders WHERE user_id = ? AND created_at > ?
\`\`\`

**问题**: `user_id` 和 `created_at` 没有组合索引

✅ **优化方案**:

\`\`\`sql
CREATE INDEX idx_user_created ON orders(user_id, created_at);
\`\`\`

### 全表扫描

❌ **问题查询**:

\`\`\`sql
SELECT * FROM products WHERE LOWER(name) LIKE '%iphone%'
\`\`\`

**问题**: `LIKE '%...%'` 无法使用索引，导致全表扫描

✅ **优化方案**:

\`\`\`sql
-- 使用全文索引
ALTER TABLE products ADD FULLTEXT INDEX ft_name(name);

SELECT * FROM products
WHERE MATCH(name) AGAINST('iphone' IN NATURAL LANGUAGE MODE);
\`\`\`

## Schema 优化

### 数据类型优化

❌ **问题设计**:

\`\`\`sql
CREATE TABLE users (
    id VARCHAR(36),  -- UUID 用字符串存储
    status VARCHAR(20),  -- 固定枚举值
    created_at VARCHAR(30)  -- 时间用字符串
);
\`\`\`

✅ **优化设计**:

\`\`\`sql
CREATE TABLE users (
    id CHAR(36) BINARY,  -- 或使用 UNSIGNED BIGINT
    status ENUM('active', 'inactive', 'deleted'),
    created_at TIMESTAMP(6),
    PRIMARY KEY (id),
    KEY idx_status_created (status, created_at)
);
\`\`\`

## 性能建议

### 查询优化

- 避免 `SELECT *`
- 使用 `LIMIT` 限制返回行数
- 合理使用 `JOIN`，避免子查询

### 索引策略

- 为 WHERE、JOIN、ORDER BY 字段建立索引
- 组合索引注意字段顺序
- 定期删除冗余索引

### 分区策略

- 大表按时间分区
- 历史数据归档
- 冷热数据分离
```

#### 4.9.5 最佳实践

- **Explain 分析**：使用 EXPLAIN 分析查询计划
- **监控慢查询**：记录并优化慢查询
- **索引管理**：定期检查索引使用情况
- **容量规划**：提前规划数据增长

---

### 4.10 Python-Reviewer Agent（Python 代码审查专家）

#### 4.10.1 解决的问题

确保 Python 代码符合 PEP 8 规范，使用惯用法和类型注解。

#### 4.10.2 触发场景

- 编写 Python 代码后
- 手动调用 `/python-review`

#### 4.10.3 检查项

| 类别        | 检查内容          |
| --------- | ------------- |
| **PEP 8** | 命名规范、代码风格、行长度 |
| **类型注解**  | 函数签名、类型提示     |
| **惯用法**   | Pythonic 代码   |
| **错误处理**  | 异常处理最佳实践      |
| **性能**    | 列表推导、生成器使用    |

#### 4.10.4 实际示例

**Python-Reviewer Agent 输出**：

```markdown
# Python 代码审查报告

## PEP 8 规范

### 命名规范

❌ **不符合规范**:

\`\`\`python
class userProfile:  # 类名应该用 CapWords
    def GetUserData(self):  # 方法名应该用 lowercase_with_underscores
        USER_NAME = "test"  # 常量应该全大写
\`\`\`

✅ **符合规范**:

\`\`\`python
class UserProfile:
    def get_user_data(self):
        USER_NAME = "test"
\`\`\`

### 行长度

❌ **超过 79 字符**:

\`\`\`python
result = some_function(argument1, argument2, argument3, argument4, argument5)
\`\`\`

✅ **符合规范**:

\`\`\`python
result = some_function(
    argument1, argument2, argument3,
    argument4, argument5
)
\`\`\`

## 类型注解

### 函数签名

❌ **缺少类型注解**:

\`\`\`python
def calculate_total(items, discount):
    total = sum(items)
    return total * discount
\`\`\`

✅ **添加类型注解**:

\`\`\`python
from typing import List

def calculate_total(items: List[float], discount: float) -> float:
    total = sum(items)
    return total * discount
\`\`\`

## Pythonic 惯用法

### 列表推导

❌ **不 Pythonic**:

\`\`\`python
squares = []
for i in range(10):
    squares.append(i ** 2)
\`\`\`

✅ **Pythonic**:

\`\`\`python
squares = [i ** 2 for i in range(10)]
\`\`\`

### 上下文管理器

❌ **不 Pythonic**:

\`\`\`python
f = open('file.txt')
data = f.read()
f.close()
\`\`\`

✅ **Pythonic**:

\`\`\`python
with open('file.txt') as f:
    data = f.read()
\`\`\`

## 错误处理

### 具体异常

❌ **捕获太宽泛**:

\`\`\`python
try:
    result = process_data()
except Exception:  # 捕获所有异常
    pass
\`\`\`

✅ **捕获具体异常**:

\`\`\`python
try:
    result = process_data()
except ValueError as e:
    logger.error(f"Invalid data: {e}")
except IOError as e:
    logger.error(f"IO error: {e}")
\`\`\`

## 性能建议

### 使用生成器

❌ **内存占用大**:

\`\`\`python
def get_all_lines(filename):
    with open(filename) as f:
        return f.readlines()  # 一次性加载所有行

for line in get_all_lines('large_file.txt'):
    process(line)
\`\`\`

✅ **使用生成器**:

\`\`\`python
def get_lines(filename):
    with open(filename) as f:
        for line in f:
            yield line

for line in get_lines('large_file.txt'):
    process(line)
\`\`\`
```

#### 4.10.5 最佳实践

- **使用类型检查**：运行 mypy 进行静态检查
- **遵循 PEP 8**：使用 black 格式化代码
- **编写文档字符串**：使用 Google 风格的 docstring
- **使用虚拟环境**：隔离项目依赖

---

### 4.11 Go-Reviewer Agent（Go 代码审查专家）

#### 4.11.1 解决的问题

确保 Go 代码符合惯用法，正确处理错误和并发。

#### 4.11.2 触发场景

- 编写 Go 代码后
- 手动调用 `/go-review`

#### 4.11.3 检查项

| 类别       | 检查内容                 |
| -------- | -------------------- |
| **错误处理** | 错误检查、错误包装            |
| **并发**   | goroutine、channel 使用 |
| **惯用法**  | Go 特有的编码模式           |
| **内存**   | 内存泄漏、资源清理            |
| **性能**   | 避免不必要的分配             |

#### 4.11.4 实际示例

**Go-Reviewer Agent 输出**：

```markdown
# Go 代码审查报告

## 错误处理

### 错误包装

❌ **错误信息丢失**:

\`\`\`go
file, err := os.Open("config.txt")
if err != nil {
    return err  // 不知道是什么文件出错
}
\`\`\`

✅ **添加上下文**:

\`\`\`go
file, err := os.Open("config.txt")
if err != nil {
    return fmt.Errorf("failed to open config file: %w", err)
}
\`\`\`

### 资源清理

❌ **资源泄漏**:

\`\`\`go
file, _ := os.Open("data.txt")
// 如果这里 panic，file 不会被关闭
data := make([]byte, 100)
file.Read(data)
\`\`\`

✅ **使用 defer**:

\`\`\`go
file, err := os.Open("data.txt")
if err != nil {
    return err
}
defer file.Close()  // 确保文件会被关闭

data := make([]byte, 100)
file.Read(data)
\`\`\`

## 并发

### goroutine 泄漏

❌ **goroutine 泄漏**:

\`\`\`go
func process(ch chan int) {
    go func() {
        for {
            select {
            case val := <-ch:
                processValue(val)
            }
        }
    }()
    // goroutine 永远不会退出
}
\`\`\`

✅ **添加退出机制**:

\`\`\`go
func process(ctx context.Context, ch chan int) {
    go func() {
        for {
            select {
            case <-ctx.Done():
                return  // 可以退出
            case val := <-ch:
                processValue(val)
            }
        }
    }()
}
\`\`\`

### channel 使用

❌ **死锁风险**:

\`\`\`go
ch := make(chan int)
ch <- 1  // 如果没有接收者，会阻塞
\`\`\`

✅ **使用缓冲 channel 或 goroutine**:

\`\`\`go
ch := make(chan int, 1)  // 缓冲 channel
ch <- 1

// 或者
go func() {
    ch <- 1
}()
\`\`\`

## 惯用法

### 接口设计

❌ **接口臃肿**:

\`\`\`go
type User interface {
    Name() string
    Email() string
    Save() error
    Delete() error
    Update() error
}
\`\`\`

✅ **小接口**:

\`\`\`go
type UserSaver interface {
    Save(user User) error
}

type UserGetter interface {
    Get(id int) (User, error)
}
\`\`\`

### 错误值

❌ **不必要的错误值**:

\`\`\`go
func isValid(data string) (bool, error) {
    if len(data) == 0 {
        return false, errors.New("empty data")
    }
    return true, nil
}
\`\`\`

✅ **直接返回 bool**:

\`\`\`go
func isValid(data string) bool {
    return len(data) > 0
}
\`\`\`

## 性能

### 避免不必要的分配

❌ **频繁分配内存**:

\`\`\`go
for i := 0; i < 1000; i++ {
    data := make([]byte, 1024)
    process(data)
}
\`\`\`

✅ **重用缓冲区**:

\`\`\`go
data := make([]byte, 1024)
for i := 0; i < 1000; i++ {
    data = data[:0]  // 重置
    process(data)
}
\`\`\`

### 字符串拼接

❌ **低效**:

\`\`\`go
var s string
for i := 0; i < 100; i++ {
    s += "item"
}
\`\`\`

✅ **使用 strings.Builder**:

\`\`\`go
var b strings.Builder
for i := 0; i < 100; i++ {
    b.WriteString("item")
}
s := b.String()
\`\`\`
```

#### 4.11.5 最佳实践

- **使用 gofmt**：统一代码格式
- **运行 go vet**：静态分析检查
- **context 超时**：所有外部调用使用 context
- **测试覆盖率**：使用 go test -cover 检查

---

### 4.12 Doc-Updater Agent（文档更新专家）

#### 4.12.1 解决的问题

保持文档与代码同步，确保项目文档完整。

#### 4.12.2 触发场景

- 代码变更后
- API 变更时
- 手动调用 `/update-docs`

#### 4.12.3 检查项

| 类别         | 检查内容           |
| ---------- | -------------- |
| **README** | 项目概述、安装说明、快速开始 |
| **API 文档** | 接口文档、请求响应示例    |
| **代码注释**   | 复杂逻辑说明、函数文档    |
| **变更日志**   | CHANGELOG 更新   |
| **架构文档**   | 系统设计、技术选型      |

#### 4.12.4 实际示例

**Doc-Updater Agent 输出**：

```markdown
# 文档更新建议

## 需要更新的文档

### 1. README.md

**添加内容**:

\`\`\`markdown
## 快速开始

### 安装依赖
\`\`\`bash
npm install
\`\`\`

### 启动开发服务器
\`\`\`bash
npm run dev
\`\`\`

### 运行测试
\`\`\`bash
npm test
\`\`\`
\`\`\`

### 2. API 文档

**新增接口**: POST /api/users

\`\`\`markdown
## 创建用户

### 请求
\`\`\`http
POST /api/users
Content-Type: application/json

{
  "name": "张三",
  "email": "zhangsan@example.com"
}
\`\`\`

### 响应
\`\`\`json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "张三",
    "email": "zhangsan@example.com",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

### 错误响应
\`\`\`json
{
  "success": false,
  "error": "Email already exists"
}
\`\`\`
\`\`\`

### 3. CHANGELOG.md

**添加版本记录**:

\`\`\`markdown
## [1.2.0] - 2024-01-15

### Added
- 用户注册功能
- 邮箱验证
- 用户信息查询

### Changed
- 优化登录接口响应时间
- 更新依赖包版本

### Fixed
- 修复 token 过期处理问题
\`\`\`

### 4. 代码注释

**需要添加注释的函数**:

\`\`\`typescript
/**
 * 计算折扣金额
 *
 * @param items - 购物车商品列表
 * @param rule - 折扣规则
 * @returns 折扣金额
 *
 * @example
 * \`\`\`typescript
 * const items = [{ price: 100, quantity: 2 }]
 * const rule = { type: 'percentage', value: 10 }
 * calculateDiscount(items, rule) // 返回 20
 * \`\`\`
 */
function calculateDiscount(items: CartItem[], rule: DiscountRule): number {
  // ...
}
\`\`\`
```

#### 4.12.5 最佳实践

- **文档即代码**：文档也是代码的一部分
- **保持同步**：代码变更时同步更新文档
- **示例驱动**：提供可运行的示例代码
- **版本管理**：文档与代码版本对应

---

### 4.13 Go-Build-Resolver Agent（Go 构建修复专家）

#### 4.13.1 解决的问题

专门处理 Go 语言的构建、编译、测试错误。

#### 4.13.2 触发场景

- `go build` 失败
- `go test` 失败
- `go vet` 报错
- 手动调用 `/go-build`

#### 4.13.3 检查项

| 类别          | 检查内容                 |
| ----------- | -------------------- |
| **编译错误**    | 语法错误、类型错误            |
| **依赖问题**    | 模块下载、版本冲突            |
| **静态检查**    | go vet 警告            |
| **测试失败**    | 单元测试、集成测试            |
| **Lint 问题** | golint、golangci-lint |

#### 4.13.4 常见错误与修复

**示例 1：未使用的导入**

```bash
$ go build
./main.go:5:2: imported and not used: "fmt"
```

**修复**：

```go
// 删除未使用的导入
- import "fmt"
```

**示例 2：类型错误**

```bash
$ go build
./main.go:15:14: cannot use "hello" (type string) as type int
```

**修复**：

```go
// 修正类型
var num int = 42
// 而不是
var num int = "hello"  // ❌
```

**示例 3：依赖缺失**

```bash
$ go build
main.go:10:2: cannot find package "github.com/gin-gonic/gin"
```

**修复**：

```bash
go get github.com/gin-gonic/gin
```

#### 4.13.5 最佳实践

- **使用 go mod**：管理依赖
- **运行 go vet**：静态分析
- **CI 检查**：在 CI 中运行完整检查
- **逐步修复**：一次修复一类错误

---

## 5. 使用场景

### 5.1 场景 1: 新功能开发

```
你: 我要加用户评论功能

Claude: [检测到是复杂新功能]
      正在调用 planner Agent...

Planner: 这里是实现计划...
       1. 数据库设计
       2. API 开发
       3. 前端界面
       确认执行?

你: yes

Claude: [调用 tdd-guide Agent]
TDD: 开始测试驱动开发...
     RED: 编写测试...
     GREEN: 实现代码...
     REFACTOR: 重构...

Claude: [自动调用 code-reviewer]
Review: 代码审查通过 ✅
```

### 5.2 场景 2: 修复 Bug

```
你: 登录时有bug

Claude: [调用 tdd-guide]
TDD: 先写测试复现 bug...
     测试失败 ✅ (bug 确认)

     编写修复...
     测试通过 ✅ (bug 修复)

Claude: [调用 code-reviewer]
Review: 修复代码审查通过 ✅
```

### 5.3 场景 3: 代码审查

```
你: /code-review

Claude: [调用 code-reviewer Agent]
Review:
- Critical: SQL 注入风险
- Warning: 函数过长
- Suggestion: 可以提取常量
```

---

## 6. 配置位置

### 6.1 Agents 目录结构

```
~/.claude/agents/
├── architect.md           # 架构设计专家
├── build-error-resolver.md  # 构建错误修复
├── code-reviewer.md      # 代码审查专家
├── database-reviewer.md   # 数据库审查专家
├── doc-updater.md        # 文档更新专家
├── e2e-runner.md        # E2E 测试专家
├── go-build-resolver.md  # Go 构建修复
├── go-reviewer.md        # Go 代码审查
├── planner.md            # 规划专家
├── python-reviewer.md    # Python 代码审查
├── refactor-cleaner.md    # 代码清理专家
├── security-reviewer.md  # 安全审查专家
└── tdd-guide.md         # TDD 指导
```

### 6.2 Agent 文件格式

每个 Agent 是一个 Markdown 文件：

```markdown
---
name: my-agent
description: 这个Agent做什么
model: opus  # 使用的模型
tools: ["Read", "Write", "Bash"]  # 可用的工具
---

你是...（Agent 的指令）

当被调用时：
1. 第一步做什么
2. 第二步做什么
3. ...

输出格式：
...
```

---

## 7. 总结

| Agent                    | 什么时候用     | 做什么          |
| ------------------------ | --------- | ------------ |
| **planner**              | 复杂功能开始前   | 制定实现计划       |
| **architect**            | 架构设计决策    | 设计系统架构       |
| **code-reviewer**        | 写完代码后     | 检查代码质量       |
| **tdd-guide**            | 新功能/Bug修复 | 测试驱动开发       |
| **security-reviewer**    | 敏感功能      | 安全检查         |
| **build-error-resolver** | 构建失败      | 修复编译错误       |
| **go-build-resolver**    | Go 构建失败   | 修复 Go 编译错误   |
| **e2e-runner**           | 关键流程      | 端到端测试        |
| **refactor-cleaner**     | 代码混乱      | 清理死代码        |
| **database-reviewer**    | 数据库操作     | 优化查询和 Schema |
| **python-reviewer**      | Python 代码 | 检查 PEP 8 规范  |
| **go-reviewer**          | Go 代码     | 检查惯用法和并发     |
| **doc-updater**          | 代码变更后     | 更新项目文档       |

---

## 8. 下一步

- [Skills 文档](./02-skills.md) - 了解技能库
- [Commands 文档](./03-commands.md) - 了解快捷命令
