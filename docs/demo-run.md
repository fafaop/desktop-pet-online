# Desktop Pet Online Demo

## Start Server

```bash
cd server
go mod tidy
go run main.go
```

Server:

```
ws://localhost:8080/ws
```

## Start Client

Open:

```
client/demo_client.html
```

Features:

- WebSocket connection
- User login
- Heartbeat
- Multi-client chat broadcast
- Pet state message channel

## Demo Flow

Client A login

Client B login

A sends chat

Server broadcasts to all clients.
