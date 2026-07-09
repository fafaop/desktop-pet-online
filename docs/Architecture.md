# Desktop Pet Online Architecture

## Overview

Desktop Pet Online adopts Client + Server architecture.

```
Client
 |
WebSocket
 |
Gateway
 |
Service Layer
 |
Database
```

## Client Modules

```
client/
├── Core
├── Network
├── Pet
├── Room
├── User
└── UI
```

Responsibilities:

- UI rendering
- Pet animation
- Local interaction
- Network communication

## Server Modules

```
server/
├── gateway
├── auth
├── room
├── pet
├── social
└── storage
```

Responsibilities:

- User authentication
- Room management
- Message broadcast
- Pet synchronization
- Data persistence

## Communication

WebSocket is used for real-time communication.

Message format:

```json
{
  "type":"MESSAGE_TYPE",
  "requestId":"uuid",
  "data":{}
}
```
