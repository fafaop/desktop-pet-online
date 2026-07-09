# WebSocket Message Protocol

## Message Format

```json
{
  "type": "message_type",
  "data": {}
}
```

## Message Types

### login

Client login request.

```json
{
  "type": "login",
  "data": {
    "user_id": "user001"
  }
}
```

### chat

Chat message broadcast.

```json
{
  "type": "chat",
  "data": {
    "content": "hello"
  }
}
```

### pet_state

Pet synchronization message.

```json
{
  "type": "pet_state",
  "data": {
    "state": "idle"
  }
}
```
