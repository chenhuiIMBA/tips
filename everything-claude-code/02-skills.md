# Claude Code Skills 完全指南

> 面向 AI 初学者的详细教程

---

## 目录

1. [什么是 Skills？](#1-什么是-skills)
2. [Skills 解决什么问题](#2-skills-解决什么问题)
3. [工作原理](#3-工作原理)
4. [所有 Skills 详解](#4-所有-skills-详解)
5. [使用场景](#5-使用场景)
6. [配置位置](#6-配置位置)

---

## 1. 什么是 Skills？

**Skills（技能）** 是按领域组织的"专业知识库"。

### 1.1 形象理解

如果说 **Agents** 是专家顾问，那么 **Skills** 就是专业参考书：

| 类型         | 类比             |
| ---------- | -------------- |
| **Claude** | 项目经理（懂得多但不够深）  |
| **Agents** | 专业顾问（主动帮你做事）   |
| **Skills** | 专业参考书（你查书获得知识） |

### 1.2 Skills vs Agents

| Skills  | Agents |
| ------- | ------ |
| 被动知识库   | 主动执行任务 |
| 提供参考和模式 | 帮你完成工作 |
| 不做决策    | 做决策并行动 |

### 1.3 为什么需要 Skills？

1. **深度知识** - 某个领域的深入知识
2. **现成模式** - 不用每次重新发明轮子
3. **最佳实践** - 行业认可的做法
4. **代码示例** - 可以直接用的代码

---

## 2. Skills 解决什么问题

### 2.1 问题 1：不知道用什么模式

**场景**：需要设计一个 API 响应格式

❌ **没有 Skills**：

- 每次随便设计
- 格式不统一
- 容易漏掉重要字段

✅ **有 Skills**：

- 查阅 `backend-patterns` Skill
- 使用标准的 API 响应格式
- 保持一致性

### 2.2 问题 2：不熟悉某个框架

**场景**：第一次用 Spring Boot

❌ **没有 Skills**：

- 边做边查文档
- 可能用错 API
- 效率低

✅ **有 Skills**：

- 查阅 `springboot-patterns` Skill
- 直接看到正确用法
- 快速上手

### 2.3 问题 3：代码风格不统一

**场景**：团队代码风格五花八门

❌ **没有 Skills**：

- 每个人写法不一样
- 难以维护

✅ **有 Skills**：

- 查阅 `coding-standards` Skill
- 统一编码规范
- 代码可读性高

---

## 3. 工作原理

### 3.1 Skill 的结构

每个 Skill 是一个目录，位于 `~/.claude/skills/`：

```
~/.claude/skills/
├── coding-standards/
│   └── SKILL.md          # 技能定义文件
├── python-patterns/
│   └── SKILL.md
├── frontend-patterns/
│   └── SKILL.md
└── ...
```

### 3.2 Skill 文件格式

```markdown
---
name: python-patterns
description: Python 惯用法和最佳实践
---

# Python 开发模式

## 何时激活
- 编写 Python 代码
- 审查 Python 代码
- ...

## 核心模式

### 模式 1: EAFP
...
### 模式 2: 列表推导
...

## 代码示例
...
```

### 3.3 Skills 如何被调用

#### 3.3.1 自动激活

Claude 会根据当前任务自动选择相关 Skill：

```
你: 用 Python 写个函数处理用户输入

Claude: [检测到 Python 开发]
      [自动加载 python-patterns Skill]

      根据最佳实践，这是推荐的做法...
```

#### 3.3.2 手动引用

你可以直接提到某个 Skill：

```
你: 用 springboot-patterns 里的 Repository 模式

Claude: [加载 springboot-patterns Skill]
      这是 Repository 模式的实现方式...
```

---

## 4. 所有 Skills 详解

### 4.1 通用技能

#### 4.1.1 Coding-Standards（编码标准）

**目录**: `~/.claude/skills/coding-standards/`

**解决问题**: 统一编码风格

**核心原则**:

##### 4.1.1.1 原则 1: KISS（保持简单）

```typescript
// ❌ 过度复杂
function getUserData(id) {
  const user = database.query(id)
  if (user) {
    if (user.active) {
      if (user.email) {
        return { email: user.email, name: user.name }
      }
    }
  }
}

// ✅ 简单直接
function getUserData(id) {
  const user = database.query(id)
  return user?.active ? { email: user.email, name: user.name } : null
}
```

##### 4.1.1.2 原则 2: DRY（不要重复）

```typescript
// ❌ 重复代码
function validateEmail(email) { /* ... */ }
function validatePhone(phone) { /* ... */ }
function validateUsername(name) { /* ... */ }

// ✅ 提取通用逻辑
function validate(field, value) {
  const rules = VALIDATION_RULES[field]
  return rules?.test(value) ?? false
}
```

##### 4.1.1.3 原则 3: 不可变性（重要！）

```typescript
// ❌ 直接修改对象
function updateUser(user, data) {
  user.name = data.name
  user.email = data.email
  return user
}

// ✅ 创建新对象
function updateUser(user, data) {
  return {
    ...user,
    ...data
  }
}
```

**为什么不可变很重要？**

1. **可预测** - 函数不会产生副作用
2. **易调试** - 数据变化有迹可循
3. **并发安全** - 多个读取不会冲突
4. **React 要求** - React 框架要求不可变

---

#### 4.1.2 Security-Review（安全审查）

**目录**: `~/.claude/skills/security-review/`

**解决问题**: 防止安全漏洞

**安全检查清单**:

##### 4.1.2.1 密钥管理

```typescript
// ❌ 硬编码密钥
const API_KEY = "sk-proj-xxxxx"  // 在代码中

// ✅ 环境变量
const API_KEY = process.env.API_KEY
if (!API_KEY) {
  throw new Error('API_KEY not configured')
}
```

##### 4.1.2.2 输入验证

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

// 验证用户输入
const validated = schema.parse(userInput)
```

##### 4.1.2.3 SQL 注入防护

```typescript
// ❌ 危险：字符串拼接
query = `SELECT * FROM users WHERE id = '${userId}'`

// ✅ 安全：参数化查询
query = 'SELECT * FROM users WHERE id = ?'
db.execute(query, [userId])
```

---

#### 4.1.3 TDD-Workflow（测试驱动开发）

**目录**: `~/.claude/skills/tdd-workflow/`

**解决问题**: 确保测试覆盖率

**TDD 流程**:

```
1. RED    - 写一个失败的测试
2. GREEN  - 写最少的代码让它通过
3. REFACTOR - 改进代码，保持测试通过
```

---

### 4.2 前端技能

#### 4.2.1 Frontend-Patterns（前端模式）

**目录**: `~/.claude/skills/frontend-patterns/`

**解决问题**: React/Next.js 开发最佳实践

**核心模式**:

##### 4.2.1.1 模式 1: 组件组合

```typescript
// ✅ 好：使用组合
<Card>
  <CardHeader>标题</CardHeader>
  <CardBody>内容</CardBody>
  <CardFooter>按钮</CardFooter>
</Card>

// ❌ 差：通过 props 控制
<Card header="标题" body="内容" footer="按钮" />
```

##### 4.2.1.2 模式 2: 自定义 Hooks

```typescript
// 封装可复用逻辑
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

// 使用
const searchQuery = useDebounce(rawQuery, 300)
```

---

### 4.3 后端技能

#### 4.3.1 Backend-Patterns（后端模式）

**目录**: `~/.claude/skills/backend-patterns/`

**解决问题**: Node.js/Express API 设计

**核心模式**:

##### 4.3.1.1 模式 1: Repository 模式

```typescript
// 抽象数据访问
interface UserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(user: CreateUser): Promise<User>
}

// 实现
class PostgresUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id])
    return result.rows[0] || null
  }
}
```

**为什么用 Repository 模式？**

1. **分离关注点** - 业务逻辑和数据访问分开
2. **易测试** - 可以 mock repository
3. **可切换** - 换数据库只需改实现

##### 4.3.1.2 模式 2: 服务层模式

```typescript
// 业务逻辑在服务层
class UserService {
  constructor(private repo: UserRepository) {}

  async register(data: RegisterDto): Promise<User> {
    // 1. 验证
    if (await this.repo.findByEmail(data.email)) {
      throw new Error('Email already exists')
    }

    // 2. 处理
    const user = await this.repo.create(data)

    // 3. 返回（不包含敏感信息）
    return omit(user, ['passwordHash'])
  }
}
```

---

#### 4.3.2 Spring-Boot-Patterns

**目录**: `~/.claude/skills/springboot-patterns/`

**核心模式**:

##### 4.3.2.1 分层架构

```java
// Controller 层 - 处理 HTTP
@RestController
@RequestMapping("/api/users")
class UserController {
  private final UserService userService;

  @GetMapping("/{id}")
  ResponseEntity<UserResponse> getById(@PathVariable Long id) {
    User user = userService.findById(id);
    return ResponseEntity.ok(UserResponse.from(user));
  }
}

// Service 层 - 业务逻辑
@Service
class UserService {
  @Transactional
  public User create(CreateUserRequest request) {
    // 业务逻辑
    return userRepository.save(entity);
  }
}
```

---

### 4.4 语言特定技能

#### 4.4.1 Python-Patterns

**目录**: `~/.claude/skills/python-patterns/`

**解决问题**: Python 惯用法、PEP 8 规范、类型注解

**核心模式**:

##### 4.4.1.1 模式 1: EAFP（请求宽恕比许可更容易）

```python
# ✅ Python 风格
def get_value(dictionary, key):
    try:
        return dictionary[key]
    except KeyError:
        return None

# ❌ 不是 Python 风格
def get_value(dictionary, key):
    if key in dictionary:
        return dictionary[key]
    return None
```

##### 4.4.1.2 模式 2: 列表推导

```python
# ✅ Python 风格
squares = [x ** 2 for x in range(10)]

# ❌ 不够 Pythonic
squares = []
for x in range(10):
    squares.append(x ** 2)
```

##### 4.4.1.3 模式 3: Dataclasses

```python
from dataclasses import dataclass

@dataclass
class User:
    """用户实体，自动生成 __init__, __repr__, __eq__"""
    id: str
    name: str
    email: str
    is_active: bool = True
```

##### 4.4.1.4 模式 4: 上下文管理器

```python
# ✅ 使用 with 管理资源
def process_file(path: str) -> str:
    with open(path, 'r') as f:
        return f.read()
```

---

#### 4.4.2 Python-Testing

**目录**: `~/.claude/skills/python-testing/`

**解决问题**: Python 测试策略（pytest、TDD、mocking）

**核心模式**:

##### 4.4.2.1 pytest 基础

```python
import pytest

def test_calculate_total():
    """单元测试示例"""
    result = calculate_total([10, 20, 30])
    assert result == 60

@pytest.mark.parametrize("input,expected", [
    ([1, 2, 3], 6),
    ([0, 0, 0], 0),
    ([-1, 1], 0),
])
def test_calculate_total_parametrized(input, expected):
    """参数化测试"""
    assert calculate_total(input) == expected
```

##### 4.4.2.2 Mock 示例

```python
from unittest.mock import Mock, patch

def test_send_notification():
    """Mock 外部依赖"""
    mock_service = Mock()
    mock_service.send.return_value = True

    result = send_notification(mock_service, "user@example.com")

    assert result is True
    mock_service.send.assert_called_once_with("user@example.com")
```

---

#### 4.4.3 Django-Patterns

**目录**: `~/.claude/skills/django-patterns/`

**解决问题**: Django 架构模式、REST API 设计、ORM 最佳实践

**核心模式**:

##### 4.4.3.1 分离 Settings

```python
# config/settings/base.py
BASE_DIR = Path(__file__).resolve().parent.parent.parent

INSTALLED_APPS = [
    'django.contrib.admin',
    'rest_framework',
    'corsheaders',
    'apps.users',
]

# config/settings/development.py
from .base import *
DEBUG = True

# config/settings/production.py
from .base import *
DEBUG = False
SECURE_SSL_REDIRECT = True
```

##### 4.4.3.2 Custom QuerySet

```python
class ProductQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)

    def with_category(self):
        return self.select_related('category')

class Product(models.Model):
    objects = ProductQuerySet.as_manager()

# 使用
Product.objects.active().with_category()
```

##### 4.4.3.3 ViewSet 模式

```python
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category')
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return ProductCreateSerializer
        return ProductSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured = self.queryset.filter(is_featured=True)[:10]
        return Response(ProductSerializer(featured, many=True).data)
```

---

#### 4.4.4 Django-Security

**目录**: `~/.claude/skills/django-security/`

**解决问题**: Django 安全最佳实践

**核心检查清单**:

##### 4.4.4.1 Settings 安全配置

```python
# 生产环境必须
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# CORS 配置
CORS_ALLOWED_ORIGINS = [
    "https://example.com",
]
CORS_ALLOW_CREDENTIALS = True
```

##### 4.4.4.2 输入验证

```python
from django.core.exceptions import ValidationError

def clean_email(self):
    email = self.cleaned_data['email']
    if '.edu' in email:
        raise ValidationError("不允许 .edu 邮箱")
    return email
```

---

#### 4.4.5 Django-TDD

**目录**: `~/.claude/skills/django-tdd/`

**1. 解决的问题**

Django 项目测试策略不统一、测试覆盖率低、测试运行慢

**2. 触发场景**

- 编写新的 Django 应用
- 实现 Django REST Framework API
- 测试 Django 模型、视图和序列化器
- 设置 Django 项目测试基础设施

**3. 怎么工作**

TDD 工作流程遵循 **红-绿-重构** 循环：

```
1. RED   - 编写失败的测试
2. GREEN - 编写最少代码让测试通过
3. REFACTOR - 改进代码，保持测试通过
```

**核心工具**：

- **pytest-django** - Django 测试运行器
- **factory_boy** - 测试数据工厂
- **pytest-cov** - 覆盖率报告

**4. 实际示例**

##### 测试配置

```ini
# pytest.ini
[pytest]
DJANGO_SETTINGS_MODULE = config.settings.test
testpaths = tests
python_files = test_*.py
addopts =
    --reuse-db
    --cov=apps
    --cov-report=html
```

##### Factory Boy 使用

```python
# tests/factories.py
import factory
from django.contrib.auth import get_user_model

User = get_user_model()

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Sequence(lambda n: f"user{n}@example.com")
    password = factory.PostGenerationMethodCall('set_password', 'testpass123')
```

##### API 测试示例

```python
# tests/test_api.py
import pytest
from rest_framework.test import APIClient
from tests.factories import ProductFactory

class TestProductAPI:
    def test_list_products(self, api_client):
        ProductFactory.create_batch(10)

        response = api_client.get('/api/products/')

        assert response.status_code == 200
        assert response.data['count'] == 10

    def test_create_product_unauthorized(self, api_client):
        response = api_client.post('/api/products/', {'name': 'Test'})

        assert response.status_code == 401
```

**5. 最佳实践**

| DO ✅                | DON'T ❌  |
| ------------------- | -------- |
| 使用 factories 创建测试数据 | 手动创建对象   |
| 每个测试一个断言            | 过多重断言    |
| Mock 外部服务           | 依赖真实 API |
| 测试边界情况              | 只测试快乐路径  |
| `--reuse-db` 加速测试   | 每次都迁移数据库 |

---

#### 4.4.6 Spring-Boot-Patterns

**目录**: `~/.claude/skills/springboot-patterns/`

**解决问题**: Spring Boot 架构模式、REST API 设计

**核心模式**:

##### 4.4.6.1 分层架构

```java
// Controller 层
@RestController
@RequestMapping("/api/users")
class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    ResponseEntity<UserResponse> getById(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(UserResponse.from(user));
    }
}

// Service 层
@Service
class UserService {
    @Transactional
    public User create(CreateUserRequest request) {
        return userRepository.save(entity);
    }
}
```

##### 4.4.6.2 DTO 模式

```java
public record CreateUserRequest(
    @NotBlank @Size(max = 200) String name,
    @NotBlank @Email String email
) {}

public record UserResponse(Long id, String name, String email) {
    static UserResponse from(User user) {
        return new UserResponse(user.id(), user.name(), user.email());
    }
}
```

---

#### 4.4.7 Spring-Security

**目录**: `~/.claude/skills/springboot-security/`

**1. 解决的问题**

Spring Boot 应用安全配置不完整、认证授权漏洞、敏感信息泄露

**2. 触发场景**

- 添加认证/授权功能
- 处理用户输入
- 创建 API 端点
- 处理密钥和敏感数据

**3. 怎么工作**

提供全面的安全检查清单和最佳实践模式，涵盖：

- JWT/Session 认证
- 方法级授权
- 输入验证
- SQL 注入防护
- CSRF 保护
- 安全头配置
- 密钥管理

**4. 实际示例**

##### JWT 认证过滤器

```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain chain
    ) throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            Authentication auth = jwtService.authenticate(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        chain.doFilter(request, response);
    }
}
```

##### 方法级授权

```java
@EnableMethodSecurity
class SecurityConfig {}

@Service
class MarketService {
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteMarket(Long id) { ... }

    @PreAuthorize("@authz.canEdit(#id)")
    public Market updateMarket(Long id, MarketData data) { ... }
}
```

##### 安全头配置

```java
http
    .headers(headers -> headers
        .contentSecurityPolicy(csp -> csp
            .policyDirectives("default-src 'self'"))
        .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
        .xssProtection(Customizer.withDefaults())
        .referrerPolicy(rp -> rp.policy(
            ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER)));
```

**5. 最佳实践**

| 安全检查      | 说明                       |
| --------- | ------------------------ |
| ✅ 无硬编码密钥  | 使用环境变量或密钥管理服务            |
| ✅ 输入验证    | Bean Validation + 自定义验证器 |
| ✅ 参数化查询   | 防止 SQL 注入                |
| ✅ CSRF 保护 | 浏览器应用启用，纯 API 禁用         |
| ✅ 速率限制    | 防止暴力攻击                   |
| ✅ 日志脱敏    | 不记录敏感信息                  |

**发布前检查清单**：

- [ ] Token 正确验证和过期
- [ ] 所有敏感路径有授权守卫
- [ ] 输入验证和清理
- [ ] 无字符串拼接 SQL
- [ ] CSRF 策略正确
- [ ] 密钥外部化
- [ ] 安全头配置
- [ ] 依赖扫描更新

---

#### 4.4.8 Spring-Boot-TDD

**目录**: `~/.claude/skills/springboot-tdd/`

**1. 解决的问题**

Spring Boot 测试覆盖率不足、测试分层不清晰、测试运行慢

**2. 触发场景**

- 新功能或端点开发
- Bug 修复或重构
- 添加数据访问逻辑或安全规则

**3. 怎么工作**

TDD 工作流程：**写测试 → 实现最少代码 → 重构 → 覆盖率检查**

测试分层：

- **单元测试** (@ExtendWith(MockitoExtension.class))
- **Web 层测试** (@WebMvcTest)
- **持久层测试** (@DataJpaTest)
- **集成测试** (@SpringBootTest)

**4. 实际示例**

##### 单元测试 (JUnit 5 + Mockito)

```java
@ExtendWith(MockitoExtension.class)
class MarketServiceTest {
    @Mock MarketRepository repo;
    @InjectMocks MarketService service;

    @Test
    void createsMarket() {
        CreateMarketRequest req = new CreateMarketRequest(
            "name", "desc", Instant.now(), List.of("cat")
        );
        when(repo.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Market result = service.create(req);

        assertThat(result.name()).isEqualTo("name");
        verify(repo).save(any());
    }
}
```

##### Web 层测试 (MockMvc)

```java
@WebMvcTest(MarketController.class)
class MarketControllerTest {
    @Autowired MockMvc mockMvc;
    @MockBean MarketService marketService;

    @Test
    void returnsMarkets() throws Exception {
        when(marketService.list(any())).thenReturn(Page.empty());

        mockMvc.perform(get("/api/markets"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray());
    }
}
```

##### 集成测试

```java
@SpringBootTest
@AutoConfigureMockMvc
class MarketIntegrationTest {
    @Autowired MockMvc mockMvc;

    @Test
    void createsMarket() throws Exception {
        mockMvc.perform(post("/api/markets")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
              {"name":"Test","description":"Desc"}
            """))
          .andExpect(status().isCreated());
    }
}
```

##### 覆盖率配置 (JaCoCo)

```xml
<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <version>0.8.14</version>
  <executions>
    <execution>
      <goals><goal>prepare-agent</goal></goals>
    </execution>
    <execution>
      <id>report</id>
      <phase>verify</phase>
      <goals><goal>report</goal></goals>
    </execution>
  </executions>
</plugin>
```

**5. 最佳实践**

| DO ✅                      | DON'T ❌  |
| ------------------------- | -------- |
| Arrange-Act-Assert 模式     | 部分模拟     |
| `@ParameterizedTest` 测试变体 | 测试实现细节   |
| AssertJ 断言 (`assertThat`) | JUnit 断言 |
| Testcontainers 镜像生产       | 嵌入式数据库   |
| 测试行为，非实现                  | 过度 Mock  |

**CI 命令**：

```bash
# Maven
mvn -T 4 test

# Gradle
./gradlew test jacocoTestReport
```

---

#### 4.4.9 JPA-Patterns

**目录**: `~/.claude/skills/jpa-patterns/`

**1. 解决的问题**

JPA/Hibernate 实体设计不当、N+1 查询问题、事务管理混乱

**2. 触发场景**

- 数据建模和实体设计
- Repository 层开发
- 查询性能优化
- 事务边界划分

**3. 怎么工作**

提供 JPA/Hibernate 最佳实践模式：

- 实体设计和审计
- 关系映射和 N+1 防护
- 查询优化和投影
- 事务管理
- 分页和索引策略
- 连接池配置

**4. 实际示例**

##### 实体设计

```java
@Entity
@Table(name = "markets", indexes = {
  @Index(name = "idx_markets_slug", columnList = "slug", unique = true)
})
@EntityListeners(AuditingEntityListener.class)
public class MarketEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Enumerated(EnumType.STRING)
    private MarketStatus status = MarketStatus.ACTIVE;

    @CreatedDate private Instant createdAt;
    @LastModifiedDate private Instant updatedAt;
}
```

##### N+1 防护

```java
// ❌ 避免 EAGER 加载
@OneToMany(mappedBy = "market", fetch = FetchType.EAGER)  // 错误！
private List<PositionEntity> positions;

// ✅ 使用 lazy 加载 + JOIN FETCH
@OneToMany(mappedBy = "market", cascade = CascadeType.ALL)
private List<PositionEntity> positions = new ArrayList();

@Query("select m from MarketEntity m left join fetch m.positions where m.id = :id")
Optional<MarketEntity> findWithPositions(@Param("id") Long id);
```

##### 投影优化

```java
// ✅ 接口投影减少数据传输
public interface MarketSummary {
    Long getId();
    String getName();
    MarketStatus getStatus();
}

Page<MarketSummary> findAllBy(Pageable pageable);
```

##### 事务管理

```java
@Service
class MarketService {
    @Transactional
    public Market updateStatus(Long id, MarketStatus status) {
        MarketEntity entity = repo.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Market"));
        entity.setStatus(status);
        return Market.from(entity);
    }

    @Transactional(readOnly = true)
    public Page<MarketSummary> list(Pageable pageable) {
        return repo.findAllBy(pageable);
    }
}
```

**5. 最佳实践**

| 最佳实践               | 说明         |
| ------------------ | ---------- |
| ✅ Lazy 加载默认        | 避免意外 N+1   |
| ✅ JOIN FETCH       | 按需加载关联     |
| ✅ 投影接口             | 减少数据传输     |
| ✅ `@Transactional` | 明确事务边界     |
| ✅ 索引匹配查询           | 复合索引顺序重要   |
| ✅ Flyway/Liquibase | 生产不用自动 DDL |

**连接池配置 (HikariCP)**：

```properties
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.validation-timeout=5000
```

---

#### 4.4.10 Golang-Patterns

**目录**: `~/.claude/skills/golang-patterns/`

**解决问题**: Go 惯用法、最佳实践

**核心模式**:

##### 4.4.10.1 错误处理

```go
// ✅ 好：总是检查错误
file, err := os.Open("file.txt")
if err != nil {
    log.Fatalf("failed to open: %v", err)
}
defer file.Close()

// ❌ 差：忽略错误
file, _ := os.Open("file.txt")
```

##### 4.4.10.2 接口设计

```go
// ✅ 好：小而专注的接口
type Reader interface {
    Read(p []byte) (n int, err error)
}

// ✅ 好：在使用处定义接口
type UserStore interface {
    GetUser(id string) (*User, error)
    SaveUser(user *User) error
}
```

##### 4.4.10.3 Worker Pool

```go
func WorkerPool(jobs <-chan Job, results chan<- Result, numWorkers int) {
    var wg sync.WaitGroup

    for i := 0; i < numWorkers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                results <- process(job)
            }
        }()
    }

    wg.Wait()
    close(results)
}
```

---

#### 4.4.11 Golang-Testing

**目录**: `~/.claude/skills/golang-testing/`

**解决问题**: Go 测试模式（表驱动测试、基准测试、fuzzing）

**核心模式**:

##### 4.4.11.1 表驱动测试

```go
func TestCalculate(t *testing.T) {
    tests := []struct {
        name     string
        input    int
        expected int
    }{
        {"positive", 5, 10},
        {"zero", 0, 0},
        {"negative", -5, -10},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := calculate(tt.input)
            if result != tt.expected {
                t.Errorf("calculate(%d) = %d; want %d", tt.input, result, tt.expected)
            }
        })
    }
}
```

##### 4.4.11.2 基准测试

```go
func BenchmarkFib(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Fib(20)
    }
}
```

---

#### 4.4.12 Cpp-Testing

**目录**: `~/.claude/skills/cpp-testing/`

**1. 解决的问题**

C++ 测试基础设施不完善、测试覆盖不足、内存安全漏洞

**2. 触发场景**

- 编写或修复 C++ 测试
- 配置 GoogleTest/CTest 工作流
- 诊断测试失败或不稳定
- 添加覆盖率或消毒器

**3. 怎么工作**

TDD 工作流程：**RED → GREEN → REFACTOR**

核心概念：

- **TDD 循环**：先写测试，最小实现，然后清理
- **隔离性**：依赖注入优于全局状态
- **Mock vs Fake**：Mock 用于交互，Fake 用于状态
- **Sanitizers**：ASan/UBSan/TSan 用于内存/竞态诊断

**4. 实际示例**

##### 基础单元测试

```cpp
// tests/calculator_test.cpp
#include <gtest/gtest.h>

int Add(int a, int b); // 由生产代码提供

TEST(CalculatorTest, AddsTwoNumbers) {
    EXPECT_EQ(Add(2, 3), 5);
}
```

##### Fixture (gtest)

```cpp
// tests/user_store_test.cpp
#include <gtest/gtest.h>
#include <memory>

class UserStoreTest : public ::testing::Test {
protected:
    void SetUp() override {
        store = std::make_unique<UserStore>(":memory:");
        store->Seed({{"alice"}, {"bob"}});
    }

    std::unique_ptr<UserStore> store;
};

TEST_F(UserStoreTest, FindsExistingUser) {
    auto user = store->Find("alice");
    ASSERT_TRUE(user.has_value());
    EXPECT_EQ(user->name, "alice");
}
```

##### Mock (gmock)

```cpp
// tests/notifier_test.cpp
#include <gmock/gmock.h>

class MockNotifier : public Notifier {
public:
    MOCK_METHOD(void, Send, (const std::string &message), (override));
};

TEST(ServiceTest, SendsNotifications) {
    MockNotifier notifier;
    Service service(notifier);

    EXPECT_CALL(notifier, Send("hello")).Times(1);
    service.Publish("hello");
}
```

##### CMake/CTest 配置

```cmake
# CMakeLists.txt
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/tags/v1.17.0.zip
)
FetchContent_MakeAvailable(googletest)

add_executable(example_tests
  tests/calculator_test.cpp
  src/calculator.cpp
)
target_link_libraries(example_tests
  GTest::gtest GTest::gmock GTest::gtest_main
)

enable_testing()
include(GoogleTest)
gtest_discover_tests(example_tests)
```

##### 运行测试

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake --build build -j
ctest --test-dir build --output-on-failure
```

##### Sanitizers 配置

```cmake
option(ENABLE_ASAN "Enable AddressSanitizer" OFF)
option(ENABLE_UBSAN "Enable UndefinedBehaviorSanitizer" OFF)

if(ENABLE_ASAN)
  add_compile_options(-fsanitize=address -fno-omit-frame-pointer)
  add_link_options(-fsanitize=address)
endif()
```

**5. 最佳实践**

| DO ✅                            | DON'T ❌       |
| ------------------------------- | ------------- |
| 保持测试确定性和隔离                      | 依赖真实时间/网络     |
| `ASSERT_*` 前置条件，`EXPECT_*` 多重检查 | 所有都用 `EXPECT` |
| 单元 vs 集成测试分离                    | 混在一起          |
| CI 中运行 Sanitizers               | 仅本地测试         |
| 条件变量而非 sleep                    | 等待用 sleep     |

**常见陷阱**：

- ❌ 固定临时路径 → 每个测试唯一临时目录
- ❌ 依赖墙上时钟 → 注入时钟或 Fake 时间
- ❌ 不稳定并发测试 → 条件变量/latch + 有界等待
- ❌ 隐藏全局状态 → Fixture 中重置或删除全局
- ❌ 过度 Mock → 状态行为用 Fake，交互才 Mock

---

### 4.5 数据库技能

#### 4.5.1 Postgres-Patterns

**目录**: `~/.claude/skills/postgres-patterns/`

**解决问题**: PostgreSQL 查询优化、模式设计、索引策略

**核心模式**:

##### 4.5.1.1 索引策略

```sql
-- ✅ 好：复合索引顺序很重要
CREATE INDEX idx_user_email_verified
  ON users(email, is_verified)
WHERE is_verified = true;  -- 部分索引

-- 查询能使用索引
SELECT * FROM users
WHERE email = 'x@example.com' AND is_verified = true;
```

##### 4.5.1.2 查询优化

```sql
-- ✅ 使用 CTE 提高可读性
WITH user_stats AS (
    SELECT user_id, COUNT(*) as total
    FROM orders
    GROUP BY user_id
)
SELECT u.name, us.total
FROM users u
JOIN user_stats us ON u.id = us.user_id;
```

##### 4.5.1.3 JSONB 操作

```sql
-- 查询 JSONB 字段
SELECT * FROM products
WHERE metadata->>'category' = 'electronics';

-- 创建 JSONB 索引
CREATE INDEX idx_products_metadata
ON products USING gin(metadata);
```

---

#### 4.5.2 ClickHouse-IO

**目录**: `~/.claude/skills/clickhouse-io/`

**解决问题**: ClickHouse 分析型数据库、高性能查询

**核心模式**:

##### 4.5.2.1 MergeTree 引擎

```sql
-- ✅ 推荐：MergeTree 系列表引擎
CREATE TABLE events (
    date Date,
    user_id UInt32,
    event_type String,
    value Float64
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (user_id, event_type, date)
SETTINGS index_granularity = 8192;
```

##### 4.5.2.2 物化视图

```sql
-- 预聚合数据
CREATE MATERIALIZED VIEW events_daily_mv
ENGINE = SummingMergeTree()
ORDER BY (date, event_type)
AS SELECT
    toDate(date) as date,
    event_type,
    count() as count,
    sum(value) as total_value
FROM events
GROUP BY date, event_type;
```

---

### 4.6 测试技能

#### 4.6.1 TDD-Workflow

**目录**: `~/.claude/skills/tdd-workflow/`

**解决问题**: 测试驱动开发工作流

**TDD 流程**:

```
1. RED    - 写一个失败的测试
2. GREEN  - 写最少的代码让它通过
3. REFACTOR - 改进代码，保持测试通过
```

##### 4.6.1.1 TDD 示例

```typescript
// 第一步：写失败的测试 (RED)
test('calculateTotal returns sum of prices', () => {
  const items = [
    { price: 10 },
    { price: 20 }
  ]
  expect(calculateTotal(items)).toBe(30)
})

// 第二步：写最少代码 (GREEN)
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// 第三步：重构 (REFACTOR)
// 如果有重复代码可以提取
```

---

#### 4.6.2 E2E

**目录**: `~/.claude/skills/e2e/`

**解决问题**: 端到端测试（Playwright）

**核心模式**:

##### 4.6.2.1 Playwright 测试

```typescript
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('https://example.com/login')
  await page.fill('[name="email"]', 'user@example.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL('https://example.com/dashboard')
  await expect(page.locator('h1')).toContainText('Welcome')
})
```

---

#### 4.6.3 Eval-Harness

**目录**: `~/.claude/skills/eval-harness/`

**解决问题**: 会话评估框架（EDD - 评估驱动开发）

---

### 4.7 工作流技能

#### 4.7.1 Continuous-Learning-v2

**目录**: `~/.claude/skills/continuous-learning-v2/`

**解决问题**: 基于本能的学习系统

**核心概念**:

##### 4.7.1.1 Instincts（本能）

**Instincts** 是从会话中学习的小型行为模式：

```
Instinct 结构:
├── 触发条件（何时使用）
├── 行为模式（做什么）
├── 置信度（0.3-0.9）
└── 使用次数
```

##### 4.7.1.2 工作流程

```
1. Hook 观察 → 捕获会话中的模式
2. 检测模式 → 识别可重用行为
3. 创建 Instinct → 带置信度评分
4. 演化 → 集群成 Skill/Command/Agent
```

##### 4.7.1.3 相关命令

| 命令                 | 功能      |
| ------------------ | ------- |
| `/instinct-status` | 查看学习的本能 |
| `/evolve`          | 集群本能为技能 |
| `/learn`           | 提取可重用模式 |

---

#### 4.7.2 Iterative-Retrieval

**目录**: `~/.claude/skills/iterative-retrieval/`

**1. 解决的问题**

多代理工作流中的"上下文问题"：子代理不知道需要哪些上下文，直到开始工作

**2. 触发场景**

- 启动需要特定代码库知识的子代理
- 子代理不知道文件结构、模式或术语
- 需要为代理检索相关上下文

**3. 怎么工作**

4 阶段循环渐进式细化上下文：

```
┌─────────────────────────────────────────────┐
│   ┌──────────┐      ┌──────────┐            │
│   │ DISPATCH │─────▶│ EVALUATE │            │
│   └──────────┘      └──────────┘            │
│        ▲                  │                 │
│        │                  ▼                 │
│   ┌──────────┐      ┌──────────┐            │
│   │   LOOP   │◀─────│  REFINE  │            │
│   └──────────┘      └──────────┘            │
│                                             │
│        Max 3 cycles, then proceed           │
└─────────────────────────────────────────────┘
```

**阶段**：

1. **DISPATCH** - 初始广泛查询收集候选文件
2. **EVALUATE** - 评估相关性（高/中/低/无）
3. **REFINE** - 基于评估更新搜索条件
4. **LOOP** - 重复细化标准（最多 3 次循环）

**4. 实际示例**

##### 示例 1：Bug 修复上下文

```
Task: "Fix the authentication token expiry bug"

Cycle 1:
  DISPATCH: 搜索 "token", "auth", "expiry" in src/**
  EVALUATE: 找到 auth.ts (0.9), tokens.ts (0.8), user.ts (0.3)
  REFINE: 添加 "refresh", "jwt" 关键词；排除 user.ts

Cycle 2:
  DISPATCH: 搜索细化术语
  EVALUATE: 找到 session-manager.ts (0.95), jwt-utils.ts (0.85)
  REFINE: 上下文足够（2 个高相关文件）

Result: auth.ts, tokens.ts, session-manager.ts, jwt-utils.ts
```

##### 示例 2：功能实现

```
Task: "Add rate limiting to API endpoints"

Cycle 1:
  DISPATCH: 搜索 "rate", "limit", "api" in routes/**
  EVALUATE: 无匹配 - 代码库使用 "throttle" 术语
  REFINE: 添加 "throttle", "middleware" 关键词

Cycle 2:
  DISPATCH: 搜索细化术语
  EVALUATE: 找到 throttle.ts (0.9), middleware/index.ts (0.7)
  REFINE: 需要路由模式

Cycle 3:
  DISPATCH: 搜索 "router", "express" 模式
  EVALUATE: 找到 router-setup.ts (0.8)
  REFINE: 上下文足够

Result: throttle.ts, middleware/index.ts, router-setup.ts
```

**5. 最佳实践**

| 最佳实践         | 说明                  |
| ------------ | ------------------- |
| ✅ 从广泛开始，渐进缩小 | 初始查询不过度指定           |
| ✅ 学习代码库术语    | 第一轮常揭示命名约定          |
| ✅ 跟踪缺失内容     | 显式缺口识别驱动细化          |
| ✅ "足够好"时停止   | 3 个高相关文件优于 10 个平庸文件 |
| ✅ 有信心地排除     | 低相关文件不会变相关          |

**相关**：

- `continuous-learning` skill - 随时间改进的模式
- `~/.claude/agents/` 中的代理定义

---

#### 4.7.3 Strategic-Compact

**目录**: `~/.claude/skills/strategic-compact/`

**1. 解决的问题**

自动压缩在任意点触发，常在任务中途丢失重要上下文

**2. 触发场景**

- 长时间会话需要压缩
- 任务阶段完成
- 上下文需要重大转移

**3. 怎么工作**

在逻辑边界建议手动 `/compact`，而非依赖任意自动压缩

**Hook 机制**：
`suggest-compact.sh` 脚本在 PreToolUse (Edit/Write) 运行：

1. **跟踪工具调用** - 计算会话中的工具调用次数
2. **阈值检测** - 可配置阈值（默认：50 次调用）
3. **定期提醒** - 阈值后每 25 次调用提醒

**4. 实际示例**

##### Hook 配置

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "tool == \"Edit\" || tool == \"Write\"",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/strategic-compact/suggest-compact.sh"
      }]
    }]
  }
}
```

##### 配置环境变量

```bash
# 首次建议前的工具调用次数（默认：50）
export COMPACT_THRESHOLD=50
```

##### 逻辑压缩时机

| 时机         | 说明             |
| ---------- | -------------- |
| ✅ 探索后，执行前  | 压缩研究上下文，保留实现计划 |
| ✅ 完成里程碑后   | 为下一阶段重新开始      |
| ✅ 主要上下文转移前 | 清除探索上下文再处理不同任务 |
| ❌ 实现中途     | 保留相关更改的上下文     |

**5. 最佳实践**

| DO ✅    | DON'T ❌         |
| ------- | --------------- |
| 计划完成后压缩 | 中途实现时压缩         |
| 调试后压缩   | 相关修改时压缩         |
| 读建议     | 被动接受            |
| 你决定"何时" | Hook 只告诉你"什么时候" |

**相关**：

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - Token 优化部分
- Memory persistence hooks - 跨压缩保留的状态

---

### 4.8 安全技能

#### 4.8.1 Security-Review

**目录**: `~/.claude/skills/security-review/`

**解决问题**: 安全漏洞审查

**安全检查清单**:

##### 4.8.1.1 密钥管理

```typescript
// ❌ 硬编码密钥
const API_KEY = "sk-proj-xxxxx"

// ✅ 环境变量
const API_KEY = process.env.API_KEY
if (!API_KEY) {
  throw new Error('API_KEY not configured')
}
```

##### 4.8.1.2 输入验证

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

const validated = schema.parse(userInput)
```

##### 4.8.1.3 SQL 注入防护

```typescript
// ❌ 危险：字符串拼接
query = `SELECT * FROM users WHERE id = '${userId}'`

// ✅ 安全：参数化查询
query = 'SELECT * FROM users WHERE id = ?'
db.execute(query, [userId])
```

---

#### 4.8.2 Security-Scan

**目录**: `~/.claude/skills/security-scan/`

**1. 解决的问题**

Claude Code 配置安全漏洞、配置错误、注入风险

**2. 触发场景**

- 设置新的 Claude Code 项目
- 修改 `.claude/settings.json`、`CLAUDE.md` 或 MCP 配置后
- 提交配置更改前
- 接入有现有 Claude Code 配置的仓库
- 定期安全卫生检查

**3. 怎么工作**

使用 [AgentShield](https://github.com/affaan-m/agentshield) 审计配置

**扫描的文件**：

| 文件              | 检查内容                           |
| --------------- | ------------------------------ |
| `CLAUDE.md`     | 硬编码密钥、自动运行指令、提示注入模式            |
| `settings.json` | 过于宽松的允许列表、缺少拒绝列表、危险绕过标志        |
| `mcp.json`      | 有风险的 MCP 服务器、硬编码环境密钥、npx 供应链风险 |
| `hooks/`        | 命令注入、数据渗漏、静默错误抑制               |
| `agents/*.md`   | 无限制工具访问、提示注入表面、缺少模型规范          |

**4. 实际示例**

##### 基础扫描

```bash
# 扫描当前项目
npx ecc-agentshield scan

# 扫描特定路径
npx ecc-agentshield scan --path /path/to/.claude

# 最小严重性过滤器
npx ecc-agentshield scan --min-severity medium
```

##### 输出格式

```bash
# 终端输出（默认）- 彩色报告和等级
npx ecc-agentshield scan

# JSON - CI/CD 集成
npx ecc-agentshield scan --format json

# Markdown - 文档
npx ecc-agentshield scan --format markdown

# HTML - 自包含暗色主题报告
npx ecc-agentshield scan --format html > security-report.html
```

##### 自动修复

```bash
# 应用安全修复（仅自动可修复的）
npx ecc-agentshield scan --fix
```

自动修复会：

- 用环境变量引用替换硬编码密钥
- 收紧通配符权限
- 从不修改手动仅建议

##### GitHub Action

```yaml
- uses: affaan-m/agentshield@v1
  with:
    path: '.'
    min-severity: 'medium'
    fail-on-findings: true
```

**5. 严重性级别**

| 等级  | 分数     | 含义   |
| --- | ------ | ---- |
| A   | 90-100 | 安全配置 |
| B   | 75-89  | 轻微问题 |
| C   | 60-74  | 需要注意 |
| D   | 40-59  | 重大风险 |
| F   | 0-39   | 关键漏洞 |

**常见发现**：

| 严重性   | 发现                                    |
| ----- | ------------------------------------- |
| 🔴 关键 | 硬编码 API 密钥、`Bash(*)` 允许列表、Hooks 中命令注入 |
| 🟠 高  | 自动运行指令、缺少拒绝列表、不必要的 Bash 访问            |
| 🟡 中  | 静默错误抑制、缺少 PreToolUse 安全钩子、`npx -y`    |
| 🔵 信息 | 缺少 MCP 描述、正确标记的禁止指令                   |

**相关链接**：

- GitHub: [github.com/affaan-m/agentshield](https://github.com/affaan-m/agentshield)
- npm: [npmjs.com/package/ecc-agentshield](https://www.npmjs.com/package/ecc-agentshield)

---

### 4.9 多模型协作技能

#### 4.9.1 Multi-Frontend / Multi-Backend

**目录**: `~/.claude/skills/multi-frontend/`, `~/.claude/skills/multi-backend/`

**解决问题**: 多模型协作开发

**核心概念**:

##### 4.9.1.1 Codex + Gemini 协作

```
前端任务 (multi-frontend):
├── Codex - 组件实现
└── Gemini - 样式优化

后端任务 (multi-backend):
├── Codex - API 实现
└── Gemini - 数据验证
```

##### 4.9.1.2 工作流程

```
1. 分析任务 → 选择合适的模型组合
2. 并行执行 → 模型独立工作
3. 整合结果 → 合并输出
4. 一致性检查 → 确保兼容性
```

---

### 4.10 实用工具技能

#### 4.10.1 Configure-ECC

**目录**: `~/.claude/skills/configure-ecc/`

**解决问题**: 交互式安装 Everything Claude Code

---

#### 4.10.2 Hookify

**目录**: `~/.claude/skills/hookify/`

**解决问题**: 创建 Hooks 防止不良行为

**核心命令**:

| 命令                   | 功能       |
| -------------------- | -------- |
| `/hookify`           | 分析会话创建规则 |
| `/hookify:list`      | 列出所有规则   |
| `/hookify:configure` | 启用/禁用规则  |
| `/hookify:help`      | 获取帮助     |

---

#### 4.10.3 Ralph-Loop

**目录**: `~/.claude/skills/ralph-loop/`

**解决问题**: 循环系统

**核心命令**:

| 命令                         | 功能   |
| -------------------------- | ---- |
| `/ralph-loop`              | 启动循环 |
| `/ralph-loop:cancel-ralph` | 取消循环 |
| `/ralph-loop:help`         | 获取帮助 |

---

#### 4.10.4 Skill-Create

**目录**: `~/.claude/skills/skill-create/`

**解决问题**: 从 Git 历史提取模式生成 SKILL.md

---

#### 4.10.5 Nutrient-Document-Processing

**目录**: `~/.claude/skills/nutrient-document-processing/`

**解决问题**: 文档处理（PDF、DOCX、OCR、签名、填充）

---

### 4.11 代码审查技能

#### 4.11.1 Python-Review

**目录**: `~/.claude/skills/python-review/`

**解决问题**: Python 代码审查（PEP 8、类型提示、安全）

---

#### 4.11.2 Go-Review

**目录**: `~/.claude/skills/go-review/`

**解决问题**: Go 代码审查（惯用法、并发、错误处理）

---

#### 4.11.3 Go-Build

**目录**: `~/.claude/skills/go-build/`

**解决问题**: 修复 Go 构建错误

---

### 4.12 验证技能

#### 4.12.1 Verification-Loop

**目录**: `~/.claude/skills/verification-loop/`

**1. 解决的问题**

Claude Code 会话缺少全面的质量门控检查

**2. 触发场景**

- 完成功能或重要代码更改后
- 创建 PR 前
- 需要确保质量门通过时
- 重构后

**3. 怎么工作**

6 阶段验证系统：构建 → 类型检查 → Lint → 测试 → 安全扫描 → Diff 审查

**4. 实际示例**

##### Phase 1: 构建验证

```bash
# 检查项目是否构建
npm run build 2>&1 | tail -20
# 或
pnpm build 2>&1 | tail -20
```

如果构建失败，停止并修复。

##### Phase 2: 类型检查

```bash
# TypeScript 项目
npx tsc --noEmit 2>&1 | head -30

# Python 项目
pyright . 2>&1 | head -30
```

报告所有类型错误。关键错误修复前继续。

##### Phase 3: Lint 检查

```bash
# JavaScript/TypeScript
npm run lint 2>&1 | head -30

# Python
ruff check . 2>&1 | head -30
```

##### Phase 4: 测试套件

```bash
# 运行带覆盖率的测试
npm run test -- --coverage 2>&1 | tail -50
```

报告：

- 总测试数：X
- 通过：X
- 失败：X
- 覆盖率：X%

##### Phase 5: 安全扫描

```bash
# 检查密钥
grep -rn "sk-" --include="*.ts" --include="*.js" . 2>/dev/null | head -10

# 检查 console.log
grep -rn "console.log" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -10
```

##### Phase 6: Diff 审查

```bash
# 显示更改内容
git diff --stat
git diff HEAD~1 --name-only
```

审查每个更改文件的：

- 意外更改
- 缺少错误处理
- 潜在边界情况

##### 输出报告模板

```
VERIFICATION REPORT
==================

Build:     [PASS/FAIL]
Types:     [PASS/FAIL] (X errors)
Lint:      [PASS/FAIL] (X warnings)
Tests:     [PASS/FAIL] (X/Y passed, Z% coverage)
Security:  [PASS/FAIL] (X issues)
Diff:      [X files changed]

Overall:   [READY/NOT READY] for PR

Issues to Fix:
1. ...
2. ...
```

**5. 最佳实践**

| 最佳实践        | 说明            |
| ----------- | ------------- |
| ✅ 完成功能后验证   | 不在实现中途        |
| ✅ 长会话定期验证   | 每 15 分钟或重大更改后 |
| ✅ 失败即停止     | 构建失败不继续       |
| ✅ 80% 覆盖率目标 | 测试质量指标        |

---

#### 4.12.2 Django-Verification

**目录**: `~/.claude/skills/django-verification/`

**1. 解决的问题**

Django 应用发布前缺少全面验证

**2. 触发场景**

- PR 前
- 重大更改后
- 预部署

**3. 怎么工作**

12 阶段验证：环境 → 代码质量 → 迁移 → 测试 → 安全 → 管理 → 性能 → 静态文件 → 配置 → 日志 → API 文档 → Diff

**4. 实际示例**

##### Phase 1: 环境检查

```bash
# 验证 Python 版本
python --version

# 检查虚拟环境
which python

# 验证环境变量
python -c "import os; print('SECRET_KEY set' if os.environ.get('DJANGO_SECRET_KEY') else 'MISSING')"
```

##### Phase 2: 代码质量

```bash
# 类型检查
mypy . --config-file pyproject.toml

# Linting with ruff
ruff check . --fix

# Formatting with black
black . --check

# Django 特定检查
python manage.py check --deploy
```

##### Phase 3: 迁移

```bash
# 检查未应用迁移
python manage.py showmigrations

# 创建缺失迁移
python manage.py makemigrations --check

# 计划迁移应用
python manage.py migrate --plan
```

##### Phase 4: 测试 + 覆盖率

```bash
# 运行所有测试
pytest --cov=apps --cov-report=html --cov-report=term-missing --reuse-db
```

覆盖目标：

- Models: 90%+
- Serializers: 85%+
- Views: 80%+
- Services: 90%+
- Overall: 80%+

##### Phase 5: 安全扫描

```bash
# 依赖漏洞
pip-audit
safety check --full-report

# Django 安全检查
python manage.py check --deploy

# Bandit 安全 Linter
bandit -r . -f json -o bandit-report.json
```

##### 输出报告

```
DJANGO VERIFICATION REPORT
==========================

Phase 1: Environment
  ✓ Python 3.11.5
  ✓ Virtual environment active

Phase 2: Code Quality
  ✓ mypy: No type errors
  ✓ ruff: 3 issues (auto-fixed)

Phase 3: Migrations
  ✓ No unapplied migrations

Phase 4: Tests + Coverage
  Tests: 247 passed, 0 failed
  Coverage: 87% overall

Phase 5: Security
  ✓ pip-audit: No issues
  ✓ DEBUG = False

RECOMMENDATION: Ready for deployment
```

**5. 最佳实践**

| DO ✅        | DON'T ❌ |
| ----------- | ------- |
| 测试环境验证      | 生产环境测试  |
| 80% 覆盖率最低目标 | 忽略覆盖报告  |
| 安全扫描自动化     | 跳过依赖检查  |
| 迁移前后测试      | 丢弃迁移文件  |

---

#### 4.12.3 SpringBoot-Verification

**目录**: `~/.claude/skills/springboot-verification/`

**1. 解决的问题**

Spring Boot 应用发布前验证不完整

**2. 触发场景**

- PR 前
- 重大更改后
- 预部署

**3. 怎么工作**

6 阶段验证：构建 → 静态分析 → 测试+覆盖率 → 安全扫描 → Lint/格式 → Diff 审查

**4. 实际示例**

##### Phase 1: 构建

```bash
# Maven
mvn -T 4 clean verify -DskipTests

# Gradle
./gradlew clean assemble -x test
```

##### Phase 2: 静态分析

```bash
# Maven
mvn -T 4 spotbugs:check pmd:check checkstyle:check

# Gradle
./gradlew checkstyleMain pmdMain spotbugsMain
```

##### Phase 3: 测试 + 覆盖率

```bash
# Maven
mvn -T 4 test
mvn jacoco:report

# Gradle
./gradlew test jacocoTestReport
```

目标：80%+ 覆盖率

##### Phase 4: 安全扫描

```bash
# 依赖 CVE
mvn org.owasp:dependency-check-maven:check

# 密钥扫描
git secrets --scan
```

##### Phase 5: Lint/格式

```bash
# Maven (Spotless)
mvn spotless:apply

# Gradle
./gradlew spotlessApply
```

##### Phase 6: Diff 审查

```bash
git diff --stat
git diff
```

检查清单：

- 无调试日志 (`System.out`, `log.debug`)
- 有意义的错误和 HTTP 状态
- 事务和验证存在

**5. 最佳实践**

| 最佳实践             | 说明            |
| ---------------- | ------------- |
| ✅ 快速反馈           | 30-60 分钟内完整循环 |
| ✅ 严格门控           | 警告视为生产缺陷      |
| ✅ Testcontainers | 镜像生产数据库       |
| ❌ 嵌入式数据库         | 不反映真实行为       |

---

### 4.13 Java 技能

#### 4.13.1 Java-Coding-Standards

**目录**: `~/.claude/skills/java-coding-standards/`

**1. 解决的问题**

Java 代码风格不统一、可读性差、可维护性低

**2. 触发场景**

- 编写 Spring Boot 服务
- Java 17+ 项目开发
- 代码审查

**3. 怎么工作**

提供可读、可维护 Java (17+) 代码标准：

- 清晰优于聪明
- 默认不可变
- 快速失败和有意义的异常
- 一致的命名和包结构

**4. 实际示例**

##### 命名约定

```java
// ✅ 类/记录：PascalCase
public class MarketService {}
public record Money(BigDecimal amount, Currency currency) {}

// ✅ 方法/字段：camelCase
private final MarketRepository marketRepository;
public Market findBySlug(String slug) {}

// ✅ 常量：UPPER_SNAKE_CASE
private static final int MAX_PAGE_SIZE = 100;
```

##### 不可变性

```java
// ✅ 优先使用 records 和 final 字段
public record MarketDto(Long id, String name, MarketStatus status) {}

public class Market {
    private final Long id;
    private final String name;
    // 仅 getter，无 setter
}
```

##### Optional 使用

```java
// ✅ 从 find* 方法返回 Optional
Optional<Market> market = marketRepository.findBySlug(slug);

// ✅ map/flatMap 代替 get()
return market
    .map(MarketResponse::from)
    .orElseThrow(() -> new EntityNotFoundException("Market not found"));
```

##### 异常

```java
// ✅ 使用域特定异常
throw new MarketNotFoundException(slug);

// ✅ 包装技术异常
try {
    return externalApi.call();
} catch (ApiException ex) {
    throw new ServiceUnavailableException("External API failed", ex);
}
```

##### 项目结构

```
src/main/java/com/example/app/
  config/
  controller/
  service/
  repository/
  domain/
  dto/
  util/
src/main/resources/
  application.yml
src/test/java/... (镜像 main 结构)
```

**5. 最佳实践**

| 最佳实践          | 说明                  |
| ------------- | ------------------- |
| ✅ 清晰胜于聪明      | 可读性优先               |
| ✅ 不可变默认       | 最小化共享可变状态           |
| ✅ 快速失败        | 有意义的异常              |
| ✅ Optional 返回 | find* 方法返回 Optional |
| ✅ 短方法         | 提取辅助方法              |
| ❌ 原始类型        | 声明泛型参数              |
| ❌ 静态可变        | 优先依赖注入              |
| ❌ 静默 catch    | 记录并行动或重新抛出          |

**格式和风格**：

- 一致的 2 或 4 个空格
- 每个文件一个公共顶级类型
- 成员顺序：常量 → 字段 → 构造函数 → 公共方法 → 受保护 → 私有

**相关**：

- Spring-Boot-Patterns - 框架特定模式
- Spring-Boot-TDD - 测试策略

---

### 4.14 学习技能

#### 4.14.1 Continuous-Learning

**目录**: `~/.claude/skills/continuous-learning/`

**1. 解决的问题**

会话中学习到的模式未保存，无法重复使用

**2. 触发场景**

- 会话结束自动触发
- 手动提取模式 (`/learn` 命令)

**3. 怎么工作**

作为 **Stop hook** 在每次会话结束时运行：

1. **会话评估** - 检查会话是否有足够消息（默认：10+）
2. **模式检测** - 识别可提取的模式
3. **技能提取** - 保存有用模式到 `~/.claude/skills/learned/`

**4. 实际示例**

##### 配置

```json
{
  "min_session_length": 10,
  "extraction_threshold": "medium",
  "auto_approve": false,
  "learned_skills_path": "~/.claude/skills/learned/",
  "patterns_to_detect": [
    "error_resolution",
    "user_corrections",
    "workarounds",
    "debugging_techniques",
    "project_specific"
  ]
}
```

##### Hook 设置

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/continuous-learning/evaluate-session.sh"
      }]
    }]
  }
}
```

##### 模式类型

| 模式                     | 说明          |
| ---------------------- | ----------- |
| `error_resolution`     | 如何解决特定错误    |
| `user_corrections`     | 用户纠正的模式     |
| `workarounds`          | 框架/库怪癖的解决方案 |
| `debugging_techniques` | 有效调试方法      |
| `project_specific`     | 项目特定约定      |

**5. 最佳实践**

| 最佳实践              | 说明        |
| ----------------- | --------- |
| ✅ Stop hook       | 轻量级、完整上下文 |
| ✅ 小型原子单元          | 容易组合      |
| ✅ 置信度评分           | 避免低质量模式   |
| ❌ PreToolUse hook | 高延迟、不完整   |

**为什么 Stop Hook？**

- **轻量**：会话结束时运行一次
- **非阻塞**：不为每条消息添加延迟
- **完整上下文**：访问完整会话记录

**相关**：

- `/learn` 命令 - 会话中间手动提取
- `continuous-learning-v2` - 基于本能的学习系统

---

#### 4.14.2 Continuous-Learning-v2

**目录**: `~/.claude/skills/continuous-learning-v2/`

已在 **4.7.1** 详细介绍。

---

### 4.15 项目指南

#### 4.15.1 Project-Guidelines-Example

**目录**: `~/.claude/skills/project-guidelines-example/`

**1. 解决的问题**

缺少项目特定的技能模板

**2. 触发场景**

- 为项目创建特定技能
- 新成员加入项目
- 需要项目特定上下文

**3. 怎么工作**

项目特定技能模板，包含：

- 架构概览
- 文件结构
- 代码模式
- 测试要求
- 部署工作流

**4. 实际示例**

基于真实生产应用：[Zenith](https://zenith.chat) - AI 驱动的客户发现平台

##### 技术栈

```
Frontend:  Next.js 15 (App Router), TypeScript, React
Backend:   FastAPI (Python), Pydantic
Database:  Supabase (PostgreSQL)
AI:       Claude API 工具调用
Deploy:   Google Cloud Run
```

##### 文件结构

```
project/
├── frontend/
│   └── src/
│       ├── app/          # Next.js app router
│       ├── components/   # React 组件
│       ├── hooks/        # 自定义 hooks
│       └── lib/          # 工具
├── backend/
│   ├── routers/          # FastAPI 路由
│   ├── models.py         # Pydantic 模型
│   └── services/         # 业务逻辑
└── deploy/               # 部署配置
```

##### API 响应格式

```python
from pydantic import BaseModel
from typing import Generic, TypeVar, Optional

T = TypeVar('T')

class ApiResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[str] = None

    @classmethod
    def ok(cls, data: T) -> "ApiResponse[T]":
        return cls(success=True, data=data)

    @classmethod
    def fail(cls, error: str) -> "ApiResponse[T]":
        return cls(success=False, error=error)
```

##### 自定义 Hooks

```typescript
export function useApi<T>(
  fetchFn: () => Promise<ApiResponse<T>>
) {
  const [state, setState] = useState({
    data: null as T | null,
    loading: false,
    error: null as string | null
  })

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    const result = await fetchFn()
    if (result.success) {
      setState({ data: result.data!, loading: false, error: null })
    } else {
      setState({ data: null, loading: false, error: result.error! })
    }
  }, [fetchFn])

  return { ...state, execute }
}
```

##### 测试要求

```bash
# Backend (pytest)
poetry run pytest tests/ --cov=. --cov-report=html

# Frontend (React Testing Library)
npm run test -- --coverage

# E2E (Playwright)
npm run test:e2e
```

**5. 最佳实践**

| 最佳实践   | 说明      |
| ------ | ------- |
| ✅ 架构概览 | 技术栈和服务  |
| ✅ 文件结构 | 项目布局    |
| ✅ 代码模式 | 重复使用的模式 |
| ✅ 测试要求 | 覆盖率和框架  |
| ✅ 关键规则 | 项目特定约束  |

**相关技能**：

- `coding-standards` - 通用编码最佳实践
- `backend-patterns` - API 和数据库模式
- `frontend-patterns` - React 和 Next.js 模式
- `tdd-workflow` - 测试驱动开发

---

## 5. 使用场景

### 5.1 场景 1: 学习新框架

```
你: 我要用 Spring Boot 写个 API

Claude: [检测到 Spring Boot 开发]
      [加载 springboot-patterns Skill]

      根据 Spring Boot 最佳实践：
      1. 使用三层架构
      2. Service 层加 @Transactional
      3. 用 DTO 传输数据

      这是示例代码...
```

### 5.2 场景 2: 代码风格不统一

```
你: 这段 Python 代码怎么改得更 Pythonic？

Claude: [加载 python-patterns Skill]
      根据 Python 最佳实践：

      1. 用列表推导替代循环
      2. 用上下文管理器处理文件
      3. 遵循 EAFP 原则

      改进后的代码...
```

### 5.3 场景 3: 安全检查

```
你: 这个登录功能安全吗？

Claude: [加载 security-review Skill]
      根据安全检查清单：

      ❌ 密码未加盐哈希
      ❌ 缺少 CSRF 保护
      ✅ 有 SQL 注入防护

      需要修复...
```

---

## 6. 配置位置

### 6.1 Skills 目录结构

```
~/.claude/skills/
│
├── # 通用技能
├── coding-standards/         # 编码标准（TypeScript/JavaScript/React）
├── security-review/          # 安全审查
├── security-scan/            # 配置安全扫描
├── tdd-workflow/            # TDD 工作流
├── eval-harness/            # 评估框架
├── continuous-learning-v2/   # 基于本能的学习系统
├── iterative-retrieval/     # 渐进式上下文检索
├── strategic-compact/       # 策略性上下文压缩
│
├── # 前端技能
├── frontend-patterns/        # 前端模式（React/Next.js）
│
├── # 后端技能
├── backend-patterns/         # 后端模式（Node.js/Express）
│
├── # Django 生态
├── django-patterns/          # Django 架构模式
├── django-security/          # Django 安全
├── django-tdd/              # Django 测试
│
├── # Spring Boot 生态
├── springboot-patterns/      # Spring Boot 模式
├── springboot-security/      # Spring Security
├── springboot-tdd/          # Spring Boot TDD
├── jpa-patterns/            # JPA/Hibernate
│
├── # Python 生态
├── python-patterns/          # Python 惯用法
├── python-testing/           # Python 测试
├── python-review/           # Python 代码审查
│
├── # Go 生态
├── golang-patterns/          # Go 惯用法
├── golang-testing/           # Go 测试
├── go-review/               # Go 代码审查
├── go-build/                # Go 构建修复
│
├── # C++ 生态
├── cpp-testing/             # C++ 测试
│
├── # 数据库
├── postgres-patterns/        # PostgreSQL 模式
├── clickhouse-io/           # ClickHouse 分析型数据库
│
├── # 测试
├── e2e/                     # E2E 测试（Playwright）
│
├── # 多模型协作
├── multi-frontend/          # 前端多模型协作
├── multi-backend/           # 后端多模型协作
│
├── # 实用工具
├── configure-ecc/           # 交互式安装程序
├── hookify/                 # Hook 创建系统
├── ralph-loop/              # 循环系统
├── skill-create/            # 从 Git 提取技能
├── nutrient-document-processing/  # 文档处理
│
└── # 其他
    └── ...
```

### 6.2 Skill 文件格式

每个 Skill 目录包含：

```
~/.claude/skills/skill-name/
├── SKILL.md              # 必需：技能定义
├── examples/             # 可选：示例代码
└── tests/               # 可选：测试用例
```

---

## 7. Skills vs 规则(Rules)

| Skills    | Rules   |
| --------- | ------- |
| 参考知识      | 强制规范    |
| 提供模式和最佳实践 | 检查合规性   |
| 你选择是否遵循   | AI 自动检查 |

**举例**：

- **Skill** 说："推荐用不可变更新"
- **Rule** 说："检测到变异代码，警告！"

---

## 8. 总结

| 类别              | Skills                                                                                                                                       | 用途                       |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| **通用**          | coding-standards, security-review, security-scan, tdd-workflow, eval-harness, continuous-learning-v2, iterative-retrieval, strategic-compact | 基础规范、安全、测试、学习            |
| **前端**          | frontend-patterns, multi-frontend                                                                                                            | React/Next.js、多模型协作      |
| **后端**          | backend-patterns, multi-backend                                                                                                              | Node.js/Express、多模型协作    |
| **Django**      | django-patterns, django-security, django-tdd                                                                                                 | Django 架构、安全、测试          |
| **Spring Boot** | springboot-patterns, springboot-security, springboot-tdd, jpa-patterns                                                                       | Spring Boot 架构、安全、测试、JPA |
| **Python**      | python-patterns, python-testing, python-review                                                                                               | Python 惯用法、测试、审查         |
| **Go**          | golang-patterns, golang-testing, go-review, go-build                                                                                         | Go 惯用法、测试、审查、构建          |
| **C++**         | cpp-testing                                                                                                                                  | C++ 测试                   |
| **数据库**         | postgres-patterns, clickhouse-io                                                                                                             | PostgreSQL、ClickHouse    |
| **测试**          | e2e                                                                                                                                          | E2E 测试                   |
| **工具**          | configure-ecc, hookify, ralph-loop, skill-create, nutrient-document-processing                                                               | 安装、Hook、循环、技能生成、文档处理     |

### 9.12 验证技能

| Skill                   | 描述                  |
| ----------------------- | ------------------- |
| verification-loop       | 通用验证系统（构建、类型、测试、安全） |
| django-verification     | Django 项目验证循环       |
| springboot-verification | Spring Boot 项目验证循环  |

### 9.13 学习技能

| Skill                  | 描述            |
| ---------------------- | ------------- |
| continuous-learning    | 自动从会话提取可重用模式  |
| continuous-learning-v2 | 基于本能的学习系统（v2） |

### 9.14 项目指南

| Skill                      | 描述       |
| -------------------------- | -------- |
| project-guidelines-example | 项目指南示例模板 |

---

## 9. Skills 完整列表

### 9.1 通用技能

| Skill                  | 描述                               |
| ---------------------- | -------------------------------- |
| coding-standards       | TypeScript/JavaScript/React 编码标准 |
| security-review        | 安全漏洞审查                           |
| security-scan          | Claude Code 配置安全扫描               |
| tdd-workflow           | 测试驱动开发工作流                        |
| eval-harness           | 评估驱动开发（EDD）框架                    |
| continuous-learning-v2 | 基于本能的学习系统                        |
| iterative-retrieval    | 渐进式上下文检索                         |
| strategic-compact      | 策略性上下文压缩                         |

### 9.2 前端技能

| Skill             | 描述                      |
| ----------------- | ----------------------- |
| frontend-patterns | React/Next.js 前端模式      |
| multi-frontend    | 前端多模型协作（Codex + Gemini） |

### 9.3 后端技能

| Skill            | 描述                      |
| ---------------- | ----------------------- |
| backend-patterns | Node.js/Express 后端模式    |
| multi-backend    | 后端多模型协作（Codex + Gemini） |

### 9.4 Django 生态

| Skill               | 描述                                    |
| ------------------- | ------------------------------------- |
| django-patterns     | Django 架构模式、REST API、ORM              |
| django-security     | Django 安全最佳实践                         |
| django-tdd          | Django TDD（pytest-django、factory_boy） |
| django-verification | Django 验证循环（环境、测试、安全、部署）              |

### 9.5 Spring Boot 生态

| Skill                   | 描述                                              |
| ----------------------- | ----------------------------------------------- |
| springboot-patterns     | Spring Boot 架构模式、REST API                       |
| springboot-security     | Spring Security 最佳实践                            |
| springboot-tdd          | Spring Boot TDD（JUnit 5、Mockito、Testcontainers） |
| jpa-patterns            | JPA/Hibernate 模式、实体设计、查询优化                      |
| springboot-verification | Spring Boot 验证循环（构建、测试、安全）                      |

### 9.6 Python 生态

| Skill           | 描述                            |
| --------------- | ----------------------------- |
| python-patterns | Python 惯用法、PEP 8、类型注解         |
| python-testing  | Python 测试（pytest、TDD、mocking） |
| python-review   | Python 代码审查（PEP 8、类型、安全）      |

### 9.7 Java 生态

| Skill                 | 描述                                  |
| --------------------- | ----------------------------------- |
| java-coding-standards | Java 编码标准（命名、不可变性、Optional、Streams） |

### 9.8 Go 生态

| Skill           | 描述                        |
| --------------- | ------------------------- |
| golang-patterns | Go 惯用法、并发、错误处理            |
| golang-testing  | Go 测试（表驱动测试、基准测试、fuzzing） |
| go-review       | Go 代码审查（惯用法、并发、错误处理）      |
| go-build        | Go 构建错误修复                 |

### 9.9 数据库

| Skill             | 描述                      |
| ----------------- | ----------------------- |
| postgres-patterns | PostgreSQL 查询优化、模式设计、索引 |
| clickhouse-io     | ClickHouse 分析型数据库、高性能查询 |

### 9.10 测试

| Skill       | 描述                       |
| ----------- | ------------------------ |
| e2e         | E2E 测试（Playwright）       |
| cpp-testing | C++ 测试（GoogleTest、CTest） |

### 9.11 工具

| Skill                        | 描述                             |
| ---------------------------- | ------------------------------ |
| configure-ecc                | Everything Claude Code 交互式安装程序 |
| hookify                      | 创建 Hooks 防止不良行为                |
| ralph-loop                   | 循环系统                           |
| skill-create                 | 从 Git 历史提取模式生成 SKILL.md        |
| nutrient-document-processing | 文档处理（PDF、DOCX、OCR、签名、填充）       |

---

## 10. 下一步

- [Agents 文档](./01-agents.md) - 了解专业代理
- [Commands 文档](./03-commands.md) - 了解快捷命令
- [Rules 文档](./04-rules.md) - 了解编码规则
- [Hooks 文档](./05-hooks.md) - 了解自动化钩子
- [MCP 文档](./06-mcp.md) - 了解模型上下文协议
