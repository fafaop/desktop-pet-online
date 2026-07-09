# Desktop Pet Online Demo Run

## Server

```bash
cd server
npm install
npm start
```

Optional environment variables:

```bash
PORT=8080
HOST=localhost
DEFAULT_ROOM=lobby
```

## Client

```bash
cd client
npm install
npm start
```

Optional environment variables:

```bash
PET_SERVER_URL=ws://localhost:8080
PET_SERVER_PROTOCOL=ws
PET_SERVER_HOST=localhost
PET_SERVER_PORT=8080
```

## Demo Flow

1. Start the server.
2. Start multiple clients.
3. Login each client with a nickname.
4. Join the same room or separate rooms.
5. Send chat messages.
6. Synchronize pet state inside the active room.
