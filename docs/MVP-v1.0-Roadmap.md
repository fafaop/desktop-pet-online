# Desktop Pet Online MVP v1.0 Roadmap

## 目标

将项目推进到可试玩 MVP 版本，核心目标：

- Windows 桌面宠物客户端可运行
- 多用户在线连接
- 实时聊天
- 房间内宠物同步
- 基础宠物状态成长

## MVP 功能范围

### Client

- Electron 桌面窗口
- 透明置顶宠物展示
- 宠物基础动画状态
- 用户登录/游客进入
- WebSocket 长连接
- 聊天 UI
- 在线用户列表

### Server

- WebSocket Gateway
- 用户 Session 管理
- 房间管理
- 消息广播
- 宠物状态同步

### Protocol

消息统一 JSON 格式：

```json
{
  "type": "chat",
  "uid": "user001",
  "timestamp": 0,
  "data": {}
}
```

## MVP 版本验收标准

- [ ] 两个客户端可以同时在线
- [ ] 用户可以加入同一房间
- [ ] 聊天消息实时同步
- [ ] 宠物位置/状态同步
- [ ] 服务端异常恢复
- [ ] Windows 打包运行

## 后续版本

v1.1:

- 好友系统
- 私聊
- 宠物背包

v1.2:

- 宠物成长系统
- 商店系统
- 皮肤系统

