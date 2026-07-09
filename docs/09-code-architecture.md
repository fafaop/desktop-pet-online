# Desktop Pet Online 代码架构设计

## 1. 设计原则

- 模块解耦
- 业务与UI分离
- 协议统一
- 支持后续扩展

# 2. Client代码结构

```
client/
├── src/
├── UI/
├── Core/
│   ├── PetEngine
│   ├── EventBus
│   └── Config
├── Network/
├── Storage/
└── Resources/
```

## 模块职责

### UI

负责：

- 界面展示
- 用户输入
- 页面交互

### PetEngine

负责：

- 宠物状态管理
- 动作调度
- 行为逻辑

### EventBus

用于模块间通信：

```
UI
 |
Event
 |
PetEngine
```

### Network

负责：

- WebSocket连接
- 消息发送
- 重连处理

# 3. Server代码结构

```
server/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── gateway/
│   ├── service/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── message/
│   │   └── pet/
│   ├── repository/
│   └── model/
└── config/
```

## 模块职责

### Gateway

- 长连接管理
- 消息路由
- 会话维护

### Service

业务处理层：

- 用户
- 消息
- 宠物

### Repository

数据访问层：

- SQLite
- PostgreSQL

## 4. 开发规范

- Feature独立提交
- 公共协议统一维护
- 接口优先设计
- 保持向后兼容
