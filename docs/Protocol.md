# Communication Protocol

## Message Format

```json
{
 "version":1,
 "type":"MESSAGE_TYPE",
 "requestId":"uuid",
 "timestamp":0,
 "data":{}
}
```

## Message Categories

### Auth

- REGISTER_REQUEST
- LOGIN_REQUEST
- LOGOUT_REQUEST

### Room

- CREATE_ROOM
- JOIN_ROOM
- LEAVE_ROOM
- ROOM_CHAT

### Pet

- PET_SYNC
- PET_UPDATE
- PET_INTERACTION

### System

- HEARTBEAT
- VERSION_CHECK
- ERROR
