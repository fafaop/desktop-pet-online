# First Deploy Checklist

## Recommended Baseline

- Ubuntu 22.04 or 24.04
- 1 vCPU
- 1 GB RAM
- public IPv4
- open inbound `22`, `80`, and `443`

## Server Setup

1. Install Node.js 24.x.
2. Clone the repository.
3. Enter `server/`.
4. Run `npm install`.
5. Copy `deploy/server.env.example` values into your shell or PM2 environment.
6. Start the service with PM2.
7. Verify `http://127.0.0.1:8080/healthz`.

## Reverse Proxy

1. Install Nginx.
2. Copy `deploy/nginx-desktop-pet-online.conf` into your Nginx site config.
3. Replace `your-domain` with the real domain.
4. Reload Nginx.
5. Confirm `http://your-domain/healthz`.

## TLS

1. Point the domain to the cloud server IP.
2. Install Certbot.
3. Issue a certificate for the domain.
4. Enable HTTPS in Nginx.
5. Change the client URL to `wss://your-domain/ws`.

## Client Settings

For Electron startup:

```bash
PET_SERVER_URL=wss://your-domain/ws npm start
```

For direct, no-proxy testing:

```bash
PET_SERVER_URL=ws://your-server-ip:8080/ws npm start
```

## Smoke Test

1. Open one client and login.
2. Open a second client and login.
3. Join the same room.
4. Send a chat message.
5. Join different rooms.
6. Confirm room-isolated chat behavior.
7. Feed or play with the pet and confirm state sync in the active room.
