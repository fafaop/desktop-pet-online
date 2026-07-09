# Desktop Pet Online MVP 设计

## 1. MVP目标

完成一个可运行的桌面宠物联机 Demo，验证核心体验：

- Windows 桌面宠物展示
- 用户登录
- 实时通信
- 基础聊天
- 宠物状态同步

## 2. MVP功能范围

## Client

```
client/
├── UI
├── Pet Engine
├── Network
├── Storage
└── Config
```

功能：

### Desktop Pet

- 透明窗口
- 桌面悬浮显示
- 基础动作播放

### Pet State Machine

状态：

```
Idle
 |
 +--> Walk
 |
 +--> Happy
 |
 +--> Sleep
```

### Network

支持：

- 连接服务器
- 登录认证
- 心跳保持
- 消息收发

## 3. Server

```
server/
├── gateway
├── auth
├── user
├── message
└── storage
```

功能：

- WebSocket连接管理
- 用户认证
- 消息转发
- 数据保存

## 4. MVP通信流程

### 登录

```
Client
 |
 | LOGIN_REQUEST
 v
Gateway
 |
 v
Auth Service
 |
 v
Database
```

### 聊天

```
Client A
 |
 v
Message Service
 |
 v
Client B
```

## 5. 不包含功能

第一版暂不实现：

- AI宠物行为
- 复杂养成系统
- 商城
- 多人地图
- 音视频通信

## 6. MVP验收标准

- 客户端可启动
- 宠物可显示
- 两个客户端可登录
- 用户之间可发送消息
- 宠物状态可同步
