# Desktop Pet Online v0.1 Architecture

## Runtime Architecture

```
Electron Client
    |
 WebSocket
    |
Game Server
    |
+-------------+
| UserManager |
| RoomManager |
| Message     |
| PetSync     |
+-------------+
```

## Message Flow

Chat:

Client -> Server -> Room -> Clients

Pet Sync:

Client PetModel -> Server PetSyncManager -> Room Broadcast -> Other Clients

## Current Demo Capability

- Multiple client connection
- Room based communication
- Chat broadcast
- Pet state synchronization foundation
