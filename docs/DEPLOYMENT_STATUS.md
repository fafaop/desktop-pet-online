# Deployment status

Last verified: 2026-07-11 (Asia/Shanghai)

## Server

- Host: `119.91.133.102`
- Application directory: `/opt/desktop-pet-online/server`
- systemd unit: `desktop-pet-online.service`
- Application listener: `127.0.0.1:8080`
- Public reverse proxy: Caddy on TCP 80
- Routes: `/healthz` and `/ws`
- Caddy backup: `/etc/caddy/Caddyfile.backup-20260711154518`

## Verified on the host

- Server tests: 3/3 passing
- Dependency audit: 0 vulnerabilities
- systemd: enabled and active, restart count 0
- Caddy configuration: valid and active
- HTTP health through Caddy: `{"ok":true,"version":"0.1.0"}`
- WebSocket through Caddy: `WELCOME` and `HEARTBEAT_ACK` received

## Public network

Tencent Cloud inbound TCP 80 was opened and externally verified on 2026-07-11.

Port 8080 remains closed because the Node.js service is intentionally bound to
loopback and exposed through Caddy only.

Verified public endpoints:

```text
http://119.91.133.102/healthz
ws://119.91.133.102/ws
```

For public distribution, add a domain and TLS in Caddy, then use
`wss://your-domain/ws` in the client.
