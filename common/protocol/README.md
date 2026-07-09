# Common Protocol

Desktop Pet Online communication protocol.

## Message Format

```json
{
  "type": "message_type",
  "userId": "user_id",
  "timestamp": 0,
  "data": {}
}
```

## Message Types

| Type | Description |
|---|---|
| login | user login |
| chat | chat message |
| room_join | join room |
| room_leave | leave room |
| pet_update | pet state update |

## Pet State

```json
{
  "state": "idle",
  "emotion": "happy",
  "position": {
    "x":0,
    "y":0
  }
}
```
