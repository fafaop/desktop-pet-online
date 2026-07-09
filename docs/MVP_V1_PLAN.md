# Desktop Pet Online MVP v1.0 Plan

## Goal

Build a playable multiplayer desktop pet demo.

## MVP Features

### Client

- Electron desktop pet window
- User login
- Online lobby
- Room view
- Pet rendering
- Pet status display

### Server

- WebSocket gateway
- User session management
- Room management
- Chat routing
- Pet state synchronization

### Protocol

Message types:

- LOGIN
- ROOM_CREATE
- ROOM_JOIN
- CHAT
- PET_UPDATE
- USER_SYNC

## Development Order

1. Complete project runtime structure
2. Implement server websocket core
3. Implement client connection layer
4. Add room and chat system
5. Add pet synchronization
6. Package playable demo

## Future

v1.1:

- Friend system
- Pet growth
- More animations

v2.0:

- Persistent database
- Cloud deployment
- Cross platform support
