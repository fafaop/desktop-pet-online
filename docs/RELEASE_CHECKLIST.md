# v0.1 release checklist

## Automated gates

- [x] `npm ci && npm test && npm audit` passes in `server/`
- [x] `npm ci && npm test && npm audit` passes in `client/`
- [x] `npm run dist` creates NSIS and portable Windows artifacts
- [x] Health, room isolation, input validation and renderer security tests pass

## Staging gates

- [x] Deploy the server as a loopback-only systemd service behind Caddy
- [x] Open Tencent Cloud security-group inbound TCP 80 and verify public access
- [x] Verify packaged client connects to the public WebSocket endpoint with a clean profile
- [ ] Deploy the server behind TLS and verify `https://host/healthz`
- [ ] Connect two clean Windows machines over `wss://`
- [ ] Verify login, room switching, chat and pet synchronization
- [ ] Restart the server and verify clients reconnect and restore profile/room
- [ ] Exercise 30 minutes of idle heartbeat operation

## Distribution gates

- [x] Replace the development/default icon with final product artwork
- [ ] Sign installer and executable with a trusted Windows code-signing certificate
- [ ] Scan artifacts with Microsoft Defender
- [x] Generate SHA-256 checksums (`client/dist/SHA256SUMS.txt`); publish them with the release
- [ ] Tag the exact tested commit as `v0.1.0`
- [ ] Attach release notes and known limitations

## Known v0.1 limitations

- Guest identity only; no account ownership guarantee
- In-memory state is lost on server restart
- One Node.js server instance; no Redis/shared session layer
- No chat history, friends, auto-update or telemetry
