# Desktop Pet Online 🐱

多人在线桌面宠物系统。

## 项目简介

Desktop Pet Online 是一个基于 Windows 客户端 + 在线服务端架构的多人互动桌面宠物应用。

用户可以在桌面养成虚拟宠物，并通过网络实现实时聊天、多人房间、宠物同步、好友互动等功能。

## 核心功能规划

- 🐱 桌面宠物引擎
- 💬 实时聊天系统
- 🌐 多人房间系统
- 🔄 宠物状态同步
- 🎨 宠物皮肤系统
- 🎁 道具成长系统
- 👥 好友社交系统
- 🔄 自动更新系统

## 系统架构

```
Windows Client
      |
 WebSocket/WSS
      |
Game Server
      |
Database
```

## 项目结构

```text
desktop-pet-online/
├── client/      # Windows客户端
├── server/      # 服务端
├── common/      # 公共协议
├── docs/        # 设计文档
├── assets/      # 资源文件
└── scripts/     # 工具脚本
```

## 开发路线

### Phase 0 - 基础架构

- [x] 项目初始化
- [x] 系统架构设计
- [x] 通信协议设计

### Phase 1 - 核心 Demo

- [ ] Windows桌面宠物
- [ ] 用户系统
- [ ] WebSocket通信
- [ ] 基础聊天

### Phase 2 - 多人在线

- [ ] 房间系统
- [ ] 多人宠物同步
- [ ] 群聊

### Phase 3 - 社交化

- [ ] 好友系统
- [ ] 皮肤系统
- [ ] 成长系统

## License

MIT
