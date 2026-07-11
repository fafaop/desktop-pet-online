module.exports = {
  port: Number(process.env.PORT || 8080),
  host: process.env.HOST || 'localhost',
  bindHost: process.env.BIND_HOST || undefined,
  defaultRoom: process.env.DEFAULT_ROOM || 'lobby',
  heartbeatInterval: Number(process.env.HEARTBEAT_INTERVAL || 30000),
  maxPayload: Number(process.env.MAX_PAYLOAD_BYTES || 16 * 1024),
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
};
