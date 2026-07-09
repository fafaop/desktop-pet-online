# Desktop Pet Online Demo Flow

## Login

Client -> Server

LOGIN(username)

Server creates user session.

## Room

Client joins room:

ROOM_JOIN(roomId)

## Chat

CHAT messages are broadcast inside the room.

## Pet Sync

PET_UPDATE updates pet state and broadcasts state changes.

## Heartbeat

Client sends HEARTBEAT periodically.

Server removes expired sessions.
