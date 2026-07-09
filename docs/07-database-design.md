# Desktop Pet Online 数据库设计

## 1. 数据库目标

保存用户、好友、消息以及宠物相关数据。

设计原则：

- 数据结构清晰
- 支持扩展
- 保证一致性

## 2. 用户表 user

表：user

字段：

|字段|说明|
|-|-|
|id|用户ID|
|username|用户名|
|password_hash|密码摘要|
|nickname|昵称|
|avatar|头像|
|created_time|创建时间|

## 3. 好友关系表 friend

表：friend

字段：

|字段|说明|
|-|-|
|user_id|用户|
|friend_id|好友|
|status|关系状态|

状态：

- pending
- accepted
- blocked

## 4. 消息表 message

字段：

|字段|说明|
|-|-|
|id|消息ID|
|sender_id|发送者|
|receiver_id|接收者|
|type|消息类型|
|content|内容|
|timestamp|时间|

## 5. 宠物表 pet

字段：

|字段|说明|
|-|-|
|id|宠物ID|
|owner_id|主人|
|name|名称|
|level|等级|
|exp|经验|
|status|状态|

## 6. 宠物状态表 pet_state

保存实时状态：

|字段|说明|
|-|-|
|pet_id|宠物|
|position|位置|
|action|动作|
|energy|能量|

## 7. 在线状态

初期：

内存维护。

扩展：

```
Redis
```

保存：

- online
- offline
- last_active_time

## 8. 数据扩展

后续支持：

- 道具系统
- 商城系统
- 宠物技能
- 用户成就
