# Desktop Pet Online 服务端设计

## 1. 服务端定位

服务端负责用户管理、消息转发、在线状态维护以及宠物数据同步。

设计目标：

- 高并发连接支持
- 服务模块解耦
- 数据可靠存储
- 支持后续扩展

## 2. 服务端架构

```
server/
│
├── gateway
├── auth-service
├── user-service
├── message-service
├── pet-service
├── database
└── cache
```

## 3. Gateway 网关

负责客户端连接入口。

功能：

- TCP/WebSocket连接
- 用户会话管理
- 消息路由
- 心跳检测

流程：

```
Client
 |
 v
Gateway
 |
 +--> User Service
 |
 +--> Message Service
```

## 4. Authentication Service

负责：

- 用户登录
- Token生成
- 身份验证
- 会话安全

## 5. User Service

管理：

- 用户信息
- 好友关系
- 在线状态

## 6. Message Service

负责实时消息。

支持：

- 单聊
- 群聊
- 离线消息
- 消息确认

消息流程：

```
User A
 |
 v
Message Service
 |
 v
User B
```

## 7. Pet Service

负责宠物相关数据：

- 宠物属性
- 状态同步
- 动作事件
- 成长数据

## 8. Database

保存：

- 用户数据
- 宠物数据
- 聊天记录
- 配置数据

## 9. Cache

用于：

- 在线用户缓存
- Session管理
- 高频数据读取

## 10. 后续扩展

支持：

- 服务拆分
- 消息队列
- 集群部署
- 负载均衡
