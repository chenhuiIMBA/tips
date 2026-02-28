# tmux 完全使用指南

> 终端复用器（Terminal Multiplexer）详细教程

---

## 目录

1. [系统概述](#1-系统概述)
2. [核心概念](#2-核心概念)
3. [安装与配置](#3-安装与配置)
4. [基础操作](#4-基础操作)
5. [会话管理](#5-会话管理)
6. [窗口管理](#6-窗口管理)
7. [窗格管理](#7-窗格管理)
8. [实用场景](#8-实用场景)
9. [高级配置](#9-高级配置)
10. [快捷键速查](#10-快捷键速查)
11. [故障排查](#11-故障排查)
12. [最佳实践](#12-最佳实践)

---

## 1. 系统概述

### 1.1 什么是 tmux

**tmux** 是一个**终端复用器**（terminal multiplexer），让你可以在一个终端窗口中创建和管理多个会话。

**名称由来**: tmux = **T**erminal **MU**X **（终端多路复用）**

### 1.2 为什么需要 tmux

#### 问题场景

```
场景 1: 服务器长时间任务
┌─────────────────────────────────┐
│ SSH 连接到远程服务器              │
│ 运行训练模型任务（预计 10 小时）  │
│                                 │
│ ⚠️  突然需要离开，关闭笔记本       │
│     → SSH 断开 → 任务中断 ❌      │
└─────────────────────────────────┘
```

**tmux 解决方案**:

```
┌─────────────────────────────────┐
│ SSH 连接到远程服务器              │
│ 启动 tmux 会话                   │
│ 运行训练模型任务（预计 10 小时）  │
│ 分离 tmux 会话                   │
│                                 │
│ ✅ 关闭 SSH → 任务继续运行        │
│ ✅ 稍后重新连接 → 查看进度        │
└─────────────────────────────────┘
```

#### 场景 2: 多任务并行

```
没有 tmux:
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ SSH 连接 1   │ │ SSH 连接 2   │ │ SSH 连接 3   │
│ 编辑代码     │ │ 运行测试     │ │ 查看日志     │
└──────────────┘ └──────────────┘ └──────────────┘
  浪费资源        管理复杂         容易混乱

有 tmux:
┌──────────────────────────────────────────┐
│         单个 SSH 连接 → tmux             │
│  ┌──────┬──────┬──────┬──────┐          │
│  │编辑  │测试  │日志  │监控  │          │
│  └──────┴──────┴──────┴──────┘          │
│         一个终端，多个任务                │
└──────────────────────────────────────────┘
```

### 1.3 核心特性

| 特性        | 说明          | 价值       |
| --------- | ----------- | -------- |
| **会话持久化** | 网络断开后任务继续运行 | 长时间任务不中断 |
| **多窗口**   | 一个会话多个窗口    | 并行处理多个任务 |
| **分屏功能**  | 窗口可以分割成多个窗格 | 同时查看多个输出 |
| **远程协作**  | 多人共享同一会话    | 团队协作调试   |
| **可定制**   | 自定义快捷键和外观   | 个性化工作流   |
| **脚本化**   | 支持自动化布局     | 快速启动工作环境 |

### 1.4 tmux vs screen vs byobu

| 特性       | tmux   | screen | byobu             |
| -------- | ------ | ------ | ----------------- |
| **活跃开发** | ✅ 活跃   | ❌ 停滞   | ✅ 活跃              |
| **学习曲线** | 中等     | 简单     | 简单                |
| **功能强大** | ✅ 非常强大 | 基础     | 中等                |
| **默认安装** | 部分系统   | 大多数系统  | 较少                |
| **可定制性** | ✅ 极高   | 有限     | 中等                |
| **底层技术** | -      | -      | tmux 或 screen 的封装 |

**推荐**: 选择 **tmux** - 功能最强、活跃维护

---

## 2. 核心概念

### 2.1 三层结构

```
tmux 结构
    │
    ├─ Session（会话）
    │   │
    │   ├─ Window 0
    │   │   ├─ Pane 1
    │   │   ├─ Pane 2
    │   │   └─ Pane 3
    │   │
    │   ├─ Window 1
    │   │   ├─ Pane 1
    │   │   └─ Pane 2
    │   │
    │   └─ Window 2
    │       └─ Pane 1
```

### 2.2 概念详解

#### Session（会话）

**最高层级单位**

```
类比: 浏览器窗口
- 可以包含多个窗口
- 可以独立存在
- 可以分离和重连
```

**用途**: 一个项目或一个工作单元

```bash
# 示例会话
tmux new -s development    # 开发环境
tmux new -s testing        # 测试环境
tmux new -s monitoring     # 监控环境
```

#### Window（窗口）

**会话中的标签页**

```
类比: 浏览器标签
- 属于某个会话
- 可以包含多个窗格
- 全屏显示
```

**用途**: 一个任务类型

```bash
# 示例窗口
Window 0: 代码编辑
Window 1: 运行测试
Window 2: 数据库操作
Window 3: 日志查看
```

#### Pane（窗格）

**窗口中的分屏区域**

```
类比: 分屏显示
- 属于某个窗口
- 独立的 Shell 进程
- 可以调整大小
```

**用途**: 同时查看多个输出

```
┌─────────────┬─────────────┐
│   编辑器    │   测试输出   │
├─────────────┴─────────────┤
│        服务器日志          │
└───────────────────────────┘
```

### 2.3 前缀键（Prefix Key）

**tmux 使用前缀键来触发命令**

```
默认前缀: Ctrl+b （按下 Ctrl 和 b）

工作流程:
  1. 按下 Ctrl+b （前缀）
  2. 松开按键
  3. 按下命令键
```

**示例**:

```
创建新窗口:
  Ctrl+b → 松开 → c

切换到下一个窗口:
  Ctrl+b → 松开 → n

垂直分屏:
  Ctrl+b → 松开 → %
```

---

## 3. 安装与配置

### 3.1 安装 tmux

#### Linux (Ubuntu/Debian)

```bash
# 安装
sudo apt update
sudo apt install tmux

# 验证安装
tmux -V
# 输出: tmux 3.3a 或其他版本
```

#### Linux (CentOS/RHEL)

```bash
# 安装
sudo yum install tmux

# 或使用 dnf (较新版本)
sudo dnf install tmux
```

#### macOS

```bash
# 使用 Homebrew
brew install tmux

# 验证
tmux -V
```

#### 从源码编译（最新版本）

```bash
# 安装依赖
sudo apt install libevent-dev ncurses-dev build-essential

# 下载最新版本
wget https://github.com/tmux/tmux/releases/download/3.4/tmux-3.4.tar.gz
tar -xzvf tmux-3.4.tar.gz
cd tmux-3.4

# 编译安装
./configure
make
sudo make install

# 验证
tmux -V
```

### 3.2 配置文件

#### 创建配置文件

```bash
# 配置文件位置
~/.tmux.conf

# 创建配置文件
touch ~/.tmux.conf
```

#### 基础配置模板

```bash
# ============================================
# tmux 配置文件
# ============================================

# 设置前缀键为 Ctrl+a（更易按）
unbind C-b
set -g prefix C-a
bind C-a send-prefix

# 设置默认 Shell
set -g default-shell /bin/bash
# 或使用 zsh
# set -g default-shell /bin/zsh

# 启用鼠标支持
set -g mouse on

# 窗口和窗格编号从 1 开始
set -g base-index 1
setw -g pane-base-index 1

# 自动重命名窗口
setw -g automatic-rename on

# 重新加载配置快捷键: Ctrl+r
bind r source-file ~/.tmux.conf \; display "配置已重载!"

# 启用 256 色支持
set -g default-terminal "screen-256color"

# 启用真彩色（如果终端支持）
set -ga terminal-overrides ",xterm-256color:Tc"

# 增加历史记录大小
set -g history-limit 10000

# 显示会话信息
set -g display-time 2000
set -g status-interval 1

# ============================================
# 状态栏配置
# ============================================

# 状态栏位置（top/bottom）
set -g status-position bottom

# 状态栏颜色
set -g status-bg colour234
set -g status-fg colour15

# 状态栏左侧
set -g status-left-length 40
set -g status-left '#[fg=green,bold]#S #[fg=white]| '

# 状态栏右侧
set -g status-right-length 60
set -g status-right '#[fg=yellow]%H:%M:%S #[fg=white]| #[fg=cyan]%Y-%m-%d'

# 窗口列表格式
setw -g window-status-format '#I:#W '
setw -g window-status-current-format '#[fg=green,bold]#I:#W* '

# 当前窗口高亮
setw -g window-status-current-style fg=green,bg=black,bold

# ============================================
# 窗格配置
# ============================================

# 窗格边框颜色
set -g pane-border-style fg=colour238
set -g pane-active-border-style fg=green

# 窗格分隔线样式
set -g pane-border-status top
set -g pane-border-format "#{pane_index}: #{pane_current_command} "

# ============================================
# 快捷键绑定
# ============================================

# 更容易的分屏快捷键
bind | split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"

# 在当前路径创建新窗口
bind c new-window -c "#{pane_current_path}"

# 使用 Alt+方向键切换窗格（不需要前缀）
bind -n M-Left select-pane -L
bind -n M-Right select-pane -R
bind -n M-Up select-pane -U
bind -n M-Down select-pane -D

# 使用 Shift+方向键切换窗口
bind -n S-Left previous-window
bind -n S-Right next-window

# ============================================
# 复制模式配置（类似 vi）
# ============================================

# 使用 vi 模式
setw -g mode-keys vi

# 复制模式快捷键
bind -T copy-mode-vi v send -X begin-selection
bind -T copy-mode-vi y send-keys -X copy-pipe-and-cancel "xclip -in -selection clipboard"

# 或使用 Wayland
# bind -T copy-mode-vi y send-keys -X copy-pipe-and-cancel "wl-copy"
```

### 3.3 验证配置

```bash
# 1. 重新加载配置
tmux source-file ~/.tmux.conf

# 2. 启动 tmux
tmux

# 3. 测试快捷键
Ctrl+r    # 应该显示 "配置已重载!"
Ctrl+a |  # 应该垂直分屏
Ctrl+a -  # 应该水平分屏
```

---

## 4. 基础操作

### 4.1 启动和退出

#### 启动 tmux

```bash
# 方式 1: 创建新会话（自动命名）
tmux

# 方式 2: 创建命名会话（推荐）
tmux new -s mysession

# 方式 3: 创建会话并执行命令
tmux new -s mysession "vim README.md"
```

#### 分离和退出

```bash
# 分离会话（保持后台运行）
Ctrl+b d

# 或者
tmux detach

# 退出 tmux（结束会话）
exit
# 或
Ctrl+b d 然后 tmux kill-session
```

### 4.2 第一次使用流程

```
┌─────────────────────────────────────────┐
│ 1. SSH 到服务器                          │
│    ssh user@server                      │
├─────────────────────────────────────────┤
│ 2. 启动 tmux 会话                        │
│    tmux new -s work                     │
├─────────────────────────────────────────┤
│ 3. 进行工作                              │
│    - 创建窗口                            │
│    - 分割窗格                            │
│    - 运行命令                            │
├─────────────────────────────────────────┤
│ 4. 分离会话                              │
│    Ctrl+b d                             │
├─────────────────────────────────────────┤
│ 5. 安全关闭 SSH 连接                     │
│    exit                                 │
├─────────────────────────────────────────┤
│ 6. 稍后重新连接                          │
│    ssh user@server                      │
│    tmux attach -t work                  │
└─────────────────────────────────────────┘
```

### 4.3 基本快捷键

| 快捷键        | 功能      |
| ---------- | ------- |
| **会话操作**   |         |
| `Ctrl+b d` | 分离当前会话  |
| `Ctrl+b s` | 列出所有会话  |
| `Ctrl+b $` | 重命名当前会话 |
| **帮助**     |         |
| `Ctrl+b ?` | 显示所有快捷键 |
| `Ctrl+b :` | 进入命令模式  |

---

## 5. 会话管理

### 5.1 会话操作

#### 创建会话

```bash
# 创建新会话（自动命名）
tmux

# 创建命名会话（推荐）
tmux new -s development
tmux new -s testing
tmux new -s monitoring

# 创建会话并执行命令
tmux new -s temp "htop"
```

#### 分离会话

```bash
# 方式 1: 使用快捷键
Ctrl+b d

# 方式 2: 使用命令
tmux detach

# 方式 3: 分离指定会话
tmux detach -s development
```

#### 列出会话

```bash
# 列出所有会话
tmux ls

# 或
tmux list-sessions

# 输出示例:
# development: 3 windows
# testing: 1 windows (created Mon Feb 13 10:30:00 2025)
# monitoring: 2 windows
```

#### 重连会话

```bash
# 重连到最后一个会话
tmux attach

# 或
tmux attach-session

# 重连到指定会话
tmux attach -t development

# 或使用会话名的一部分
tmux attach -t dev
```

#### 杀死会话

```bash
# 杀死指定会话
tmux kill-session -t development

# 杀死所有会话
tmux kill-server

# 在会话内退出
exit
```

#### 重命名会话

```bash
# 方式 1: 快捷键
Ctrl+b $
# 输入新名称

# 方式 2: 命令行
tmux rename-session -t oldname newname
```

### 5.2 会话管理技巧

#### 场景 1: 项目隔离

```bash
# 为不同项目创建独立会话
tmux new -s project-a
tmux new -s project-b
tmux new -s project-c

# 切换项目
tmux attach -t project-a
# ... 工作 ...
Ctrl+b d

tmux attach -t project-b
# ... 工作 ...
Ctrl+b d
```

#### 场景 2: 长时间任务

```bash
# 启动长时间任务
tmux new -s training

# 在 tmux 中运行
python train_model.py

# 分离会话
Ctrl+b d

# 安全关闭 SSH
exit

# 稍后查看进度
ssh server
tmux attach -t training
```

#### 场景 3: 远程协作

```bash
# 用户 A 创建会话
tmux new -s pair-programming

# 用户 B 连接同一会话（只读）
tmux attach -t pair-programming -r

# 用户 B 连接（可编辑）
tmux attach -t pair-programming
```

### 5.3 会话脚本化

#### 自动化会话创建

```bash
#!/bin/bash
# 文件: dev-env.sh

SESSION="dev"

# 检查会话是否已存在
tmux has-session -t $SESSION 2>/dev/null

if [ $? != 0 ]; then
  # 创建新会话
  tmux new-session -d -s $SESSION

  # 创建窗口并命名
  tmux rename-window -t $SESSION:0 "editor"
  tmux send-keys -t $SESSION:0 "cd ~/project" C-m
  tmux send-keys -t $SESSION:0 "vim" C-m

  # 创建新窗口
  tmux new-window -t $SESSION:1 -n "tests"
  tmux send-keys -t $SESSION:1 "cd ~/project" C-m

  # 创建新窗口
  tmux new-window -t $SESSION:2 -n "server"
  tmux send-keys -t $SESSION:2 "cd ~/project" C-m
  tmux send-keys -t $SESSION:2 "npm run dev" C-m

  # 创建新窗口
  tmux new-window -t $SESSION:3 -n "git"
  tmux send-keys -t $SESSION:3 "cd ~/project" C-m
fi

# 附加到会话
tmux attach-session -t $SESSION
```

**使用方法**:

```bash
chmod +x dev-env.sh
./dev-env.sh
```

---

## 6. 窗口管理

### 6.1 窗口操作

#### 创建窗口

```bash
# 快捷键（最常用）
Ctrl+b c

# 命令方式
tmux new-window

# 创建并命名
tmux new-window -n "tests"

# 在当前路径创建
tmux new-window -c "#{pane_current_path}"
```

#### 切换窗口

```bash
# 快捷键
Ctrl+b n      # 下一个窗口
Ctrl+b p      # 上一个窗口
Ctrl+b 0      # 切换到窗口 0
Ctrl+b 1      # 切换到窗口 1
Ctrl+b 2      # 切换到窗口 2
# ... 依此类推

# 通过编号切换
tmux select-window -t 2

# 通过名称切换
tmux select-window -t "tests"
```

#### 重命名窗口

```bash
# 快捷键
Ctrl+b ,

# 输入新名称，按 Enter 确认

# 命令方式
tmux rename-window "new-name"
```

#### 关闭窗口

```bash
# 快捷键
Ctrl+b &

# 命令方式
tmux kill-window

# 或使用 exit
exit
```

#### 查找窗口

```bash
# 快捷键
Ctrl+b f

# 输入窗口名称或编号进行搜索
```

### 6.2 窗口管理技巧

#### 场景 1: 按功能组织窗口

```bash
# 窗口 0: 编辑器
Ctrl+b c
Ctrl+b , editor

# 窗口 1: 测试
Ctrl+b c
Ctrl+b , tests

# 窗口 2: 数据库
Ctrl+b c
Ctrl+b , database

# 窗口 3: 日志
Ctrl+b c
Ctrl+b , logs

# 快速切换
Ctrl+b 0-3
```

#### 场景 2: 自动重命名

```bash
# 在 ~/.tmux.conf 中启用
setw -g automatic-rename on

# tmux 会根据当前运行的命令自动重命名窗口
# 例如: vim、bash、htop、node
```

### 6.3 窗口布局

#### 预设布局

```bash
# 快捷键
Ctrl+b Spacebar

# 循环切换预设布局:
# 1. even-horizontal  - 水平等分
# 2. even-vertical    - 垂直等分
# 3. main-horizontal  - 主窗格水平
# 4. main-vertical    - 主窗格垂直
# 5. tiled            - 平铺布局
```

#### 保存和恢复布局

```bash
# 保存当前布局
tmux list-windows -F "#{window_active} #{window_layout}" \
  | grep "^1" | awk '{print $2}' > ~/.tmux-layout

# 恢复布局（手动应用）
Ctrl+b Spacebar
```

---

## 7. 窗格管理

### 7.1 窗格操作

#### 创建窗格

```bash
# 垂直分屏（左右）
Ctrl+b %

# 或（推荐配置后）
Ctrl+a |

# 水平分屏（上下）
Ctrl+b "

# 或（推荐配置后）
Ctrl+a -
```

#### 切换窗格

```bash
# 使用方向键
Ctrl+b 方向键

# 或使用配置（推荐）
Alt+方向键

# 循环切换
Ctrl+b o

# 显示窗格编号（按数字快速切换）
Ctrl+b q
# 然后按窗格编号
```

#### 调整窗格大小

```bash
# 调整当前窗格大小
Ctrl+b Ctrl+方向键

# 精确调整大小
Ctrl+b :       # 进入命令模式
resize-pane -D 10    # 向下扩展 10 行
resize-pane -U 10    # 向上扩展 10 行
resize-pane -L 10    # 向左扩展 10 列
resize-pane -R 10    # 向右扩展 10 列
```

#### 关闭窗格

```bash
# 快捷键
Ctrl+b x

# 或使用 exit
exit

# 或使用命令
tmux kill-pane
```

#### 最大化窗格

```bash
# 快捷键
Ctrl+b z

# 再次按下恢复
Ctrl+b z
```

### 7.2 窗格布局示例

#### 布局 1: 开发环境

```
目标布局:
┌─────────────┬─────────────┐
│   代码编辑   │   终端输出   │
├─────────────┴─────────────┤
│        服务器日志          │
└───────────────────────────┘

操作步骤:
1. tmux new -s dev
2. Ctrl+b %         # 垂直分屏
3. Ctrl+b "         # 下方分屏
4. Ctrl+b 方向键    # 切换窗格
```

#### 布局 2: 监控面板

```
目标布局:
┌─────┬─────┬─────┬─────┐
│ CPU │ MEM │ DISK│ NET │
├─────┴─────┴─────┴─────┤
│      系统日志          │
└───────────────────────┘

操作步骤:
1. tmux new -s monitor
2. Ctrl+b %         # 垂直分屏
3. Ctrl+b %         # 再分屏
4. Ctrl+b %         # 再分屏
5. Ctrl+b "         # 下方分屏
```

#### 布局 3: 四象限

```
目标布局:
┌─────────────┬─────────────┐
│    任务1     │    任务2     │
├─────────────┼─────────────┤
│    任务3     │    任务4     │
└─────────────┴─────────────┘

操作步骤:
1. tmux new -s tasks
2. Ctrl+b %         # 垂直分屏
3. Ctrl+b "         # 水平分屏
4. Ctrl+b 方向键    # 切换到右上
5. Ctrl+b "         # 水平分屏
6. Ctrl+b 方向键    # 切换到左下
7. Ctrl+b "         # 水平分屏
```

### 7.3 窗格高级操作

#### 在窗格间移动内容

```bash
# 交换当前窗格和上一个窗格
Ctrl+b Ctrl+o

# 交换当前窗格和指定窗格
Ctrl+b :
swap-pane -t 2
```

#### 在新窗口打开窗格

```bash
# 将当前窗格移到新窗口
Ctrl+b !

# 将指定窗格移到新窗口
tmux break-pane -t 1
```

#### 合并窗格

```bash
# 将指定窗口的窗格合并到当前窗口
tmux join-pane -s session:window.pane

# 示例: 将 session:1.2 合并到当前位置
tmux join-pane -s mysession:1.2
```

---

## 8. 实用场景

### 8.1 场景 1: 服务器开发

#### 配置开发会话

```bash
# 创建开发会话
tmux new -s dev

# 窗口 0: 代码编辑
# 窗口 1: 测试运行
# 窗口 2: 服务器
# 窗口 3: 数据库
# 窗口 4: 日志查看

# 在每个窗口中设置相应的工作目录和命令
```

#### 工作流程

```
1. SSH 到服务器
   ssh user@server

2. 启动开发会话
   tmux attach -t dev

3. 在窗口 0 编辑代码
   Ctrl+b 0

4. 在窗口 1 运行测试
   Ctrl+b 1
   npm test

5. 在窗口 2 查看服务器输出
   Ctrl+b 2

6. 分离会话
   Ctrl+b d

7. 安全关闭 SSH
   exit
```

### 8.2 场景 2: 长时间运行任务

#### 机器学习训练

```bash
# 1. 创建训练会话
tmux new -s training

# 2. 激活虚拟环境并运行训练
source venv/bin/activate
python train.py --epochs 100 --batch-size 32

# 3. 分离会话
Ctrl+b d

# 4. 安全关闭连接
exit

# 5. 稍后查看进度
ssh server
tmux attach -t training
```

#### 批量数据处理

```bash
# 1. 创建处理会话
tmux new -s data-processing

# 2. 运行处理脚本
nohup python process_data.py > output.log 2>&1 &

# 3. 实时查看日志
tail -f output.log

# 4. 分离会话
Ctrl+b d
```

### 8.3 场景 3: 远程协作

#### 结对编程

```bash
# 用户 A (创建者)
tmux new -s pair-programming

# 用户 B (参与者)
tmux attach -t pair-programming

# 两人可以看到对方的操作
# 适合:
# - 代码审查
# - 调试
# - 教学
```

#### 只读模式

```bash
# 用户 B 以只读模式连接
tmux attach -t pair-programming -r

# 用户 B 可以看到但不能操作
```

### 8.4 场景 4: 监控和运维

#### 系统监控会话

```bash
# 创建监控会话
tmux new -s monitor

# 窗口 0: CPU 监控
htop

# 窗口 1: 内存监控
free -m

# 窗口 2: 磁盘使用
df -h

# 窗口 3: 网络连接
netstat -an

# 窗口 4: 应用日志
tail -f /var/log/app.log

# 布局示例:
# ┌──────┬──────┬──────┬──────┐
# │ htop │ free │  df  │ net  │
# └──────┴──────┴──────┴──────┘
#           [    日志     ]
```

#### 应用日志查看

```bash
# 创建日志会话
tmux new -s logs

# 垂直分屏查看多个日志
Ctrl+b %
tail -f /var/log/nginx/access.log

Ctrl+b 方向键
tail -f /var/log/nginx/error.log

Ctrl+b "
tail -f /var/log/app/app.log
```

### 8.5 场景 5: 演示和教学

#### 演示环境准备

```bash
# 1. 创建演示会话
tmux new -s demo

# 2. 准备多个窗口
# 窗口 0: 幻灯片/备注
# 窗口 1: 代码演示
# 窗口 2: 实时运行
# 窗口 3: 问答回复

# 3. 规划演示流程
# Ctrl+b 0-3 快速切换
```

#### 教学环境

```bash
# 教师创建会话
tmux new -s class-lecture

# 学生连接观看
tmux attach -t class-lecture -r

# 适合:
# - 编程教学
# - 命令行演示
# - 调试教学
```

---

## 9. 高级配置

### 9.1 状态栏美化

#### 现代状态栏配置

```bash
# ============================================
# 状态栏美化配置
# ============================================

# 使用 Powerline 风格符号
set -g status-left-length 60
set -g status-left '#[fg=blue,bold]❐ #S #[fg=white]| '

# 显示 CPU 使用率（需要安装 tmux-cpu）
set -g status-right-length 80
set -g status-right '#{cpu_bg_color} CPU: #{cpu_icon} #{cpu_percentage} #[fg=white]| #[fg=yellow]%H:%M:%S #[fg=white]| #[fg=cyan]%Y-%m-%d'

# 窗口列表美化
setw -g window-status-current-format '#[fg=white,bg=blue]❱ #I:#W* #[default]'
setw -g window-status-format '#[fg=white]#I:#W #[default]'

# 状态栏背景渐变
set -g status-bg colour234
set -g status-fg colour15

# 状态栏分隔符
set -g window-status-separator "  "
```

#### Solarized 主题

```bash
# Solarized Dark 主题
set -g status-bg colour235
set -g status-fg colour136

setw -g window-status-current-fg colour81
setw -g window-status-current-bg colour238
setw -g window-status-current-attr bold

setw -g window-status-fg colour244
setw -g window-status-bg colour235
setw -g window-status-attr none

setw -g window-status-bell-attr bold
setw -g window-status-bell-fg colour255
setw -g window-status-bell-bg colour1

set -g pane-border-fg colour235
set -g pane-active-border-fg colour240

set -g message-fg colour16
set -g message-bg colour221
set -g message-attr bold
```

### 9.2 插件系统

#### 安装 TPM (Tmux Plugin Manager)

```bash
# 克隆 TPM
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm

# 在 ~/.tmux.conf 中添加
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'

# 初始化 TPM（放在配置文件最后）
run '~/.tmux/plugins/tpm/tpm'

# 重新加载配置
tmux source ~/.tmux.conf

# 安装插件
Ctrl+b I
```

#### 常用插件

```bash
# ============================================
# 插件列表
# ============================================

# CPU 使用率显示
set -g @plugin 'tmux-plugins/tmux-cpu'

# 保存会话
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @resurrect-capture-pane-contents 'on'
set -g @resurrect-strategy-vim 'session'

# 持久化会话
set -g @plugin 'tmux-plugins/tmux-continuum'
set -g @continuum-restore 'on'
set -g @continuum-save-interval '15'

# 复制到系统剪贴板
set -g @plugin 'tmux-plugins/tmux-yank'

# 更好的默认配置
set -g @plugin 'tmux-plugins/tmux-sensible'

# 打开文件/URL
set -g @plugin 'tmux-plugins/tmux-open'

# 会话管理
set -g @plugin 'tmux-plugins/tmux-sessionist'

# 初始化 TPM
run '~/.tmux/plugins/tpm/tpm'
```

#### 插件快捷键

```
tmux-resurrect:
  Ctrl+b Ctrl+r  # 保存会话
  Ctrl+b Ctrl+R  # 恢复会话

tmux-continuum:
  # 自动保存和恢复

tmux-open:
  Ctrl+b o       # 打开选中文件
  Ctrl+b Ctrl+o  # 打开选中 URL

tmux-yank:
  Ctrl+b y       # 复制到系统剪贴板

tmux-sessionist:
  Ctrl+b Ctrl+f  # 列出会话并切换
  Ctrl+b Ctrl+g  # 列出会话并预览
```

### 9.3 自定义命令

#### 创建自定义快捷键

```bash
# ============================================
# 自定义快捷键
# ============================================

# 快速SSH连接
bind S command-prompt -p "ssh: " "new-window -n 'ssh:%1' 'ssh %1'"

# 快速查看日志
bind L command-prompt -p "log: " "new-window -n 'log:%1' 'tail -f %1'"

# 快速查看man
bind M command-prompt -p "man page: " "new-window -n 'man:%1' 'man %1'"

# 快速打开htop
bind h split-window -h -p 30 'htop'

# 快速编辑配置文件
bind e new-window -n 'conf' "vim ~/.tmux.conf \; source-file ~/.tmux.conf"

# 快速重新加载配置
bind r source-file ~/.tmux.conf \; display "配置已重载!"

# 快速创建水平分割
bind | split-window -h -c "#{pane_current_path}"

# 快速创建垂直分割
bind - split-window -v -c "#{pane_current_path}"

# 在当前路径创建新窗口
bind c new-window -c "#{pane_current_path}"

# 无前缀键切换窗格
bind -n M-Left select-pane -L
bind -n M-Right select-pane -R
bind -n M-Up select-pane -U
bind -n M-Down select-pane -D

# 无前缀键切换窗口
bind -n S-Left previous-window
bind -n S-Right next-window
```

### 9.4 集成其他工具

#### 集成 fzf (模糊搜索)

```bash
# 安装 fzf
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install

# 在 ~/.tmux.conf 中添加
# 使用 fzf 切换会话
bind s run-shell -b tmux list-sessions | fzf | xargs tmux switch-client -t

# 使用 fzf 切换窗口
bind w run-shell -b tmux list-windows | fzf | awk '{print $1}' | xargs tmux select-window -t

# 使用 fzf 切换窗格
bind p run-shell -b tmux list-panes -s -F "#{pane_index}: #{pane_current_command}" | fzf | awk '{print $1}' | xargs tmux select-pane -t
```

#### 集成 vim

```bash
# 在 vim 和 tmux 之间无缝导航
# 需要配合 vim 插件: vim-tmux-navigator

# ~/.tmux.conf 配置
is_vim="ps -o state= -o comm= -t '#{pane_tty}' \
  | grep -iqE '^[^TXZ ]+ +(\\S+\\/)?g?(view|n?vim?x?)(diff)?$'"

bind-key -n 'C-h' if-shell "$is_vim" 'send-keys C-h' 'select-pane -L'
bind-key -n 'C-j' if-shell "$is_vim" 'send-keys C-j' 'select-pane -D'
bind-key -n 'C-k' if-shell "$is_vim" 'send-keys C-k' 'select-pane -U'
bind-key -n 'C-l' if-shell "$is_vim" 'send-keys C-l' 'select-pane -R'

# ~/.vimrc 配置
Plugin 'christoomey/vim-tmux-navigator'
```

---

## 10. 快捷键速查

### 10.1 会话快捷键

| 快捷键        | 功能       | 说明     |
| ---------- | -------- | ------ |
| `Ctrl+b d` | 分离会话     | 保持后台运行 |
| `Ctrl+b s` | 列出会话     | 交互式选择  |
| `Ctrl+b $` | 重命名会话    | 输入新名称  |
| `Ctrl+b (` | 切换到上一个会话 | -      |
| `Ctrl+b )` | 切换到下一个会话 | -      |

### 10.2 窗口快捷键

| 快捷键          | 功能      | 说明       |
| ------------ | ------- | -------- |
| `Ctrl+b c`   | 创建新窗口   | 在当前路径    |
| `Ctrl+b n`   | 下一个窗口   | 循环切换     |
| `Ctrl+b p`   | 上一个窗口   | 循环切换     |
| `Ctrl+b 0-9` | 切换到编号窗口 | 直接跳转     |
| `Ctrl+b ,`   | 重命名窗口   | 输入新名称    |
| `Ctrl+b &`   | 关闭窗口    | 确认后关闭    |
| `Ctrl+b f`   | 查找窗口    | 搜索窗口名    |
| `Ctrl+b w`   | 列出窗口    | 交互式选择    |
| `Ctrl+b l`   | 最后使用的窗口 | 在两个窗口间切换 |
| `Ctrl+b .`   | 移动窗口    | 移动到指定编号  |

### 10.3 窗格快捷键

| 快捷键               | 功能     | 说明     |
| ----------------- | ------ | ------ |
| **创建**            | -      | -      |
| `Ctrl+b %`        | 垂直分屏   | 左右分割   |
| `Ctrl+b "`        | 水平分屏   | 上下分割   |
| **切换**            | -      | -      |
| `Ctrl+b 方向键`      | 切换窗格   | 上下左右   |
| `Ctrl+b o`        | 循环切换   | 按顺序    |
| `Ctrl+b q`        | 显示编号   | 按数字跳转  |
| **调整**            | -      | -      |
| `Ctrl+b Ctrl+方向键` | 调整大小   | 逐行/列调整 |
| `Ctrl+b z`        | 最大化/恢复 | 切换全屏   |
| `Ctrl+b !`        | 移到新窗口  | 当前窗格独立 |
| `Ctrl+b x`        | 关闭窗格   | 确认后关闭  |
| **交换**            | -      | -      |
| `Ctrl+b }`        | 交换窗格   | 与上一个交换 |
| `Ctrl+b Ctrl+o`   | 旋转窗格   | 循环交换   |

### 10.4 其他常用快捷键

| 快捷键               | 功能     | 说明         |
| ----------------- | ------ | ---------- |
| `Ctrl+b ?`        | 显示帮助   | 列出所有快捷键    |
| `Ctrl+b :`        | 命令模式   | 输入 tmux 命令 |
| `Ctrl+b [`        | 复制模式   | 可以滚动和复制    |
| `Ctrl+b ]`        | 粘贴缓冲区  | 粘贴复制的内容    |
| `Ctrl+b =`        | 列出缓冲区  | 选择要粘贴的内容   |
| `Ctrl+b Spacebar` | 切换布局   | 预设布局       |
| `Ctrl+b t`        | 显示时钟   | 大字时钟       |
| `Ctrl+b ~`        | 显示之前窗口 | 提示信息       |
| `Ctrl+b PageUp`   | 进入复制模式 | 滚动查看历史     |

### 10.5 复制模式快捷键

在复制模式（`Ctrl+b [`）中:

| 快捷键               | 功能     | 说明    |
| ----------------- | ------ | ----- |
| `q`               | 退出复制模式 | -     |
| `方向键`             | 移动光标   | 上下左右  |
| `PageUp/PageDown` | 翻页     | 滚动历史  |
| `Space`           | 开始选择   | 标记起点  |
| `Enter`           | 复制选择   | vi 模式 |
| `w`               | 下一个词   | -     |
| `b`               | 上一个词   | -     |
| `e`               | 词尾     | -     |
| `0`               | 行首     | -     |
| `$`               | 行尾     | -     |
| `g`               | 首行     | -     |
| `G`               | 末行     | -     |
| `/`               | 搜索     | 向前搜索  |
| `?`               | 搜索     | 向后搜索  |

---

## 11. 故障排查

### 11.1 常见问题

#### 问题 1: tmux 无法启动

**症状**: 运行 `tmux` 命令无响应或报错

**解决方案**:

```bash
# 检查是否安装
which tmux

# 检查版本
tmux -V

# 如果未安装
sudo apt install tmux  # Ubuntu/Debian
sudo yum install tmux  # CentOS/RHEL
brew install tmux      # macOS
```

#### 问题 2: 配置文件不生效

**症状**: 修改 `~/.tmux.conf` 后没有效果

**解决方案**:

```bash
# 重新加载配置
tmux source-file ~/.tmux.conf

# 或在 tmux 中
Ctrl+b :
source-file ~/.tmux.conf

# 检查配置文件语法
cat ~/.tmux.conf | grep -n "^"
```

#### 问题 3: 鼠标不工作

**症状**: 鼠标无法点击选择窗格或窗口

**解决方案**:

```bash
# 在 ~/.tmux.conf 中添加
set -g mouse on

# 重新加载配置
tmux source-file ~/.tmux.conf
```

#### 问题 4: 颜色显示不正确

**症状**: 终端颜色失真或不支持 256 色

**解决方案**:

```bash
# 在 ~/.tmux.conf 中添加
set -g default-terminal "screen-256color"

# 或启用真彩色
set -ga terminal-overrides ",xterm-256color:Tc"

# 检查终端支持
echo $TERM
```

#### 问题 5: 会话无法重连

**症状**: `tmux attach` 报错 "session not found"

**解决方案**:

```bash
# 列出所有会话
tmux ls

# 使用正确的会话名
tmux attach -t session_name

# 或附加到最后一个会话
tmux attach
```

#### 问题 6: 剪贴板不工作

**症状**: 无法在 tmux 和系统之间复制粘贴

**解决方案**:

```bash
# 安装 xclip (X11)
sudo apt install xclip

# 或 wl-clipboard (Wayland)
sudo apt install wl-clipboard

# 在 ~/.tmux.conf 中配置
bind -T copy-mode-vi y send-keys -X copy-pipe-and-cancel "xclip -in -selection clipboard"

# Wayland 使用
# bind -T copy-mode-vi y send-keys -X copy-pipe-and-cancel "wl-copy"
```

### 11.2 调试技巧

#### 启用详细日志

```bash
# 启动 tmux 时启用调试
tmux -vvv new -s debug

# 查看日志
cat ~/.tmux-debug-*.log
```

#### 检查配置

```bash
# 显示当前配置
tmux show-options -g

# 显示窗口选项
tmux show-options -w

# 显示所有配置
tmux show-options -a
```

#### 测试快捷键

```bash
# 在 tmux 中
Ctrl+b :
list-keys   # 列出所有快捷键
list-commands   # 列出所有命令
```

### 11.3 性能优化

#### 减少延迟

```bash
# 减少 Esc 键延迟
set -s escape-time 0

# 增加历史限制
set -g history-limit 10000

# 减少状态刷新间隔
set -g status-interval 5
```

#### 禁用不需要的功能

```bash
# 禁用活动窗口监控
setw -g monitor-activity off

# 禁用自动重命名
setw -g automatic-rename off
```

---

## 12. 最佳实践

### 12.1 命名规范

#### 会话命名

```bash
# ✅ 好的命名
tmux new -s project-name-env
# 例如:
tmux new -s myapp-dev
tmux new -s myapp-prod
tmux new -s myapp-testing

# ❌ 避免的命名
tmux new -s work
tmux new -s session1
tmux new -s temp
```

#### 窗口命名

```bash
# ✅ 好的命名
Ctrl+b ,
editor    # 编辑器
tests     # 测试
server    # 服务器
logs      # 日志
database  # 数据库

# ❌ 避免的命名
bash*     # 默认名称
window1   # 无意义
a         # 太短
```

### 12.2 工作流程

#### 开发工作流

```bash
# 1. 启动项目会话
tmux new -s myproject

# 2. 创建工作窗口
Ctrl+b c     → editor
Ctrl+b , editor

Ctrl+b c     → tests
Ctrl+b , tests

Ctrl+b c     → server
Ctrl+b , server

Ctrl+b c     → git
Ctrl+b , git

# 3. 分离会话
Ctrl+b d

# 4. 稍后重连
tmux attach -t myproject
```

#### 部署工作流

```bash
# 1. 创建部署会话
tmux new -s deploy

# 2. 准备窗口
# 窗口 0: 服务器A
# 窗口 1: 服务器B
# 窗口 2: 数据库
# 窗口 3: 监控

# 3. 在各窗口执行部署

# 4. 在监控窗口观察

# 5. 部署完成后保留会话用于监控
```

### 12.3 安全建议

#### 敏感操作

```bash
# ❌ 避免在 tmux 会话中输入密码
# tmux 历史可能被记录

# ✅ 使用 SSH 密钥认证
ssh-keygen -t ed25519
ssh-copy-id user@server

# ✅ 或使用密钥管理工具
# 例如: pass, keepassxc
```

#### 清理会话

```bash
# 定期清理无用会话
tmux ls
tmux kill-session -t old-session

# 清理所有会话
tmux kill-server
```

### 12.4 备份配置

#### 备份配置文件

```bash
# 备份 tmux 配置
cp ~/.tmux.conf ~/.tmux.conf.backup

# 或使用版本控制
cd ~
git init
git add .tmux.conf
git commit -m "Initial tmux config"
```

#### 跨机器同步

```bash
# 使用 Git 同步配置
mkdir -p ~/dotfiles
cp ~/.tmux.conf ~/dotfiles/

cd ~/dotfiles
git init
git add .
git commit -m "Add tmux config"

# 推送到 GitHub
git remote add origin git@github.com:username/dotfiles.git
git push -u origin main

# 在其他机器上克隆
git clone git@github.com:username/dotfiles.git ~/dotfiles
cp ~/dotfiles/.tmux.conf ~/
```

### 12.5 学习路径

```
阶段 1: 基础使用（1-2 天）
├─ 会话创建、分离、重连
├─ 窗口创建、切换
└─ 基础分屏

阶段 2: 日常使用（1 周）
├─ 自定义配置
├─ 自定义快捷键
├─ 窗格调整
└─ 复制粘贴

阶段 3: 高级功能（2-4 周）
├─ 脚本化会话
├─ 插件系统
├─ 状态栏定制
└─ 与其他工具集成

阶段 4: 专家级（持续学习）
├─ 高级自定义
├─ 性能优化
└─ 创建自己的插件
```

---

## 13. 总结

### 13.1 核心概念回顾

| 概念          | 说明          | 快捷键示例              |
| ----------- | ----------- | ------------------ |
| **Session** | 最高层级，包含多个窗口 | `tmux new -s name` |
| **Window**  | 会话中的标签页     | `Ctrl+b c`         |
| **Pane**    | 窗口中的分屏      | `Ctrl+b %`         |
| **Prefix**  | 触发快捷键的前缀    | `Ctrl+b`           |

### 13.2 必知快捷键

| 操作    | 快捷键          |
| ----- | ------------ |
| 分离会话  | `Ctrl+b d`   |
| 创建窗口  | `Ctrl+b c`   |
| 垂直分屏  | `Ctrl+b %`   |
| 水平分屏  | `Ctrl+b "`   |
| 切换窗格  | `Ctrl+b 方向键` |
| 最大化窗格 | `Ctrl+b z`   |
| 关闭窗格  | `Ctrl+b x`   |
| 列出会话  | `Ctrl+b s`   |
| 帮助    | `Ctrl+b ?`   |

### 13.3 使用决策树

```
需要做什么？
    │
    ├─ 长时间任务 → 创建会话 → 分离 → 重连查看
    │
    ├─ 多任务并行 → 创建多窗口或分屏
    │
    ├─ 远程协作 → 创建会话 → 其他人 attach
    │
    └─ 自动化环境 → 编写脚本 → 一键启动会话
```

### 13.4 相关资源

- **官方文档**: https://github.com/tmux/tmux/wiki
- **快速参考**: `man tmux` 或 `Ctrl+b ?`
- **配置模板**: https://github.com/gpakosz/.tmux
- **插件集合**: https://github.com/tmux-plugins/tpm

---

**文档版本**: v1.0
**最后更新**: 2025-02-13
**维护者**: Claude Code 用户社区
