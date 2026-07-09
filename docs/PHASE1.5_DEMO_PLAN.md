# Phase 1.5 Demo Implementation Plan

## Goal

Upgrade Desktop Pet Online from a communication skeleton into a presentable multiplayer demo.

## Features

### User

- Anonymous login
- User ID generation
- Online status
- Nickname management

### Chat

- Private message
- Room message
- Message timestamp
- JSON protocol definition

### Room

- Create room
- Join room
- Leave room
- Broadcast events

### Pet Sync

Pet state synchronization:

```json
{
  "type": "pet_update",
  "userId": "10001",
  "pet": {
    "state": "idle",
    "x": 100,
    "y": 200
  }
}
```

## Development Order

1. Complete server websocket framework
2. Implement room manager
3. Implement client room UI
4. Add pet synchronization
5. Add basic pet animation

