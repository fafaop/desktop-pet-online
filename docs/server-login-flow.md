# Login Flow

## Client Login

Client sends:

```json
{
  "type":"login",
  "data":{
    "user_id":"user001",
    "name":"player"
  }
}
```

## Server Processing

1. Parse login message
2. Create User object
3. Register UserManager
4. Bind websocket Session
5. Return login_response

## Heartbeat

Client periodically sends:

```json
{
  "type":"heartbeat"
}
```

Server updates last active timestamp.

Timeout clients are removed.
