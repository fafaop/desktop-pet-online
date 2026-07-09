# Deploy Server

## Overview

The current server is a Node.js WebSocket service.

- WebSocket: `ws://host:port`
- Health check: `http://host:port/healthz`

## Environment Variables

```bash
PORT=8080
HOST=your-domain-or-ip
BIND_HOST=0.0.0.0
DEFAULT_ROOM=lobby
```

`HOST` is the client-facing address used in logs.

`BIND_HOST` controls which interface the server listens on.

For cloud deployment, use `BIND_HOST=0.0.0.0`.

## Ubuntu Quick Start

```bash
sudo apt update
sudo apt install -y git curl
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs
```

```bash
git clone git@github.com:fafaop/desktop-pet-online.git
cd desktop-pet-online/server
npm install
```

```bash
PORT=8080 HOST=your-domain-or-ip BIND_HOST=0.0.0.0 npm start
```

## PM2

Install PM2:

```bash
sudo npm install -g pm2
```

Start the service:

```bash
cd server
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## Verify

Health check:

```bash
curl http://127.0.0.1:8080/healthz
```

Expected response:

```json
{"ok":true}
```

## Client Connection

For local Electron startup:

```bash
PET_SERVER_URL=ws://your-domain-or-ip:8080 npm start
```

If you later place Nginx in front of the service and terminate TLS there, the client URL can become:

```bash
PET_SERVER_URL=wss://your-domain/ws npm start
```

## Notes

- Open the server port in the cloud firewall or security group.
- Use Nginx or another reverse proxy if you want TLS and a stable `wss://` endpoint.
- The current WebSocket server accepts upgrade requests on any path, so `/ws` can be proxied to the same upstream port.
