# Desktop Pet Online v0.1

The supported release architecture is Electron 43 + Node.js 22+ + WebSocket.
The Go, C#, WPF and Qt directories contain historical prototypes and are not
included by the Electron builder.

Only the explicitly whitelisted files in `client/package.json` form the v0.1
client runtime. Other client modules are historical prototypes, are excluded
from the application package and must not be used as protocol references.

## Included

- Guest nickname sessions
- Room creation, joining and isolated chat
- Local pet feed/play interactions
- Remote pet state events
- Heartbeat, reconnect and profile/room restoration
- Payload validation, message rate limiting and health endpoint
- Windows NSIS and portable build configuration
- Product icon and SHA-256 checksum generation
- Persistent server URL, nickname and room preferences
- Independent always-on-top pet window with autonomous movement and dragging
- Pet chat bubbles and feed/play/head-pat/rest interactions
- Persistent pet position and roaming pause state

## Run

```powershell
cd server
npm ci
npm test
npm start
```

```powershell
cd client
npm ci
npm test
npm start
```

Set `PET_SERVER_URL=wss://your-domain/ws` for production clients. Server
environment variables are documented in `deploy/server.env.example`.

New installations default to `ws://119.91.133.102/ws`. Existing installations
keep their saved server preference and can change it in Connection settings.

## Build

```powershell
cd client
npm run dist
```

Artifacts are written under `client/dist`. They are unsigned development
artifacts until a Windows code-signing certificate is configured.

## Protocol

The authoritative v0.1 protocol is `common/protocol/v1.md`.
