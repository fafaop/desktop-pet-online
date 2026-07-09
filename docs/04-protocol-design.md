# Desktop Pet Online 通信协议设计

## 1. 协议目标

定义客户端与服务端之间的数据交换规范，保证：

- 消息可靠传输
- 协议可扩展
- 支持版本兼容
- 支持实时互动

## 2. 通信方式

初期方案：

```
Client <---- WebSocket/TCP ----> Server
```

选择原因：

- 支持长连接
- 低延迟
- 适合实时聊天和状态同步

## 3. 消息结构

统一消息格式：

```json
{
  "version": "1.0",
  "type": "CHAT_MESSAGE",
  "requestId": "uuid",
  "timestamp": 1234567890,
  "data": {}
}
```

字段说明：

|字段|说明|
|-|-|
|version|协议版本|
|type|消息类型|
|requestId|请求唯一ID|
|timestamp|时间戳|
|data|业务数据|

## 4. 消息类型

### 登录

```
LOGIN_REQUEST
LOGIN_RESPONSE
```

数据：

```json
{
 "username":"user",
 "token":"xxx"
}
```

### 心跳

```
HEARTBEAT_REQUEST
HEARTBEAT_RESPONSE
```

用于检测连接状态。

### 聊天消息

```
CHAT_MESSAGE
```

支持：

- 单聊
- 群聊
- 离线消息

### 用户状态

```
USER_STATUS_SYNC
```

同步：

- 在线状态
- 活跃状态

### 宠物同步

```
PET_SYNC
```

同步：

- 宠物位置
- 当前动作
- 属性变化

## 5. 可靠性设计

### 消息序列

每条消息包含：

```
sequenceId
```

用于：

- 去重
- 顺序保证
- 重传

### 重连机制

客户端：

```
disconnect
 |
 retry
 |
 reconnect
 |
 sync state
```

## 6. 错误码设计

示例：

|错误码|说明|
|-|-|
|1000|成功|
|1001|参数错误|
|2001|认证失败|
|3001|服务器异常|

## 7. 协议扩展

未来支持：

- Protobuf二进制协议
- 文件传输
- 语音消息
- 实时多人互动
