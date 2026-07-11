# Desktop Pet Online v0.1.0

First release candidate of the Windows multiplayer desktop-pet demo.

## Highlights

- Transparent, always-on-top Electron pet window
- Original beige round-headed desktop pet inspired by a soft hand-drawn style
- Autonomous multi-display roaming, drag positioning and pause/resume
- Pet interaction menu: feed, play, head pat, rest, control panel and quit
- Safe chat bubbles displayed beside the pet
- Persistent pet position and roaming preference
- Guest nickname and persistent connection preferences
- Room creation, joining and isolated real-time chat
- Local feed/play interactions and remote pet state updates
- Automatic WebSocket reconnect and heartbeat
- Default public demo gateway at `ws://119.91.133.102/ws`
- Windows installer and portable executable

## Security

- Electron 43 renderer sandbox and context isolation
- Narrow preload API; renderer has no Node.js access
- Content Security Policy and text-only rendering for user content
- External navigation, popup windows and page permissions denied
- Server-owned room routing, validated payloads and bounded pet fields
- 16 KiB payload limit, message rate limit and `/ws`-only upgrades

## Operations

- `/healthz` server health endpoint
- PM2 and Nginx deployment templates
- Automated client/server tests and Windows package smoke test
- GitHub Actions test and unsigned packaging workflow
- SHA-256 checksums for release artifacts

## Known limitations

- Guest identities are not accounts
- Server state is in memory and resets on restart
- One server instance; no shared Redis/session layer
- No chat history, friends, auto-update or telemetry
- Windows artifacts are unsigned until a code-signing certificate is configured

See `docs/RELEASE_CHECKLIST.md` before public distribution.
