# Desktop Pet Online 🐱

多人在线桌面宠物系统。

## 项目简介

Desktop Pet Online 是一个基于 Windows 客户端 + 在线服务端架构的多人互动桌面宠物应用。

用户可以在桌面养成虚拟宠物，并通过网络实现实时聊天、多人房间、宠物同步、好友互动等功能。

## 当前 Demo 功能

- 🐱 Electron 桌面宠物窗口
- 💬 WebSocket 实时聊天
- 👥 在线用户管理
- 🔄 宠物状态同步协议
- 📡 JSON 通信协议

## 系统架构

```
Windows Client
      |
 WebSocket/WSS
      |
Game Server
      |
User Manager
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

## Demo运行

### Server

```bash
cd server
npm install
npm start
```

### Client

```bash
cd client
npm install
npm start
```

## 开发路线

### Phase 0 - 基础架构

- [x] 项目初始化
- [x] 系统架构设计
- [x] 通信协议设计

### Phase 1 - 核心 Demo

- [x] Windows桌面宠物窗口
- [x] WebSocket通信
- [x] 基础聊天
- [x] 用户协议
- [x] 宠物状态模型

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
