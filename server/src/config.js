module.exports = {
  port: Number(process.env.PORT || 8080),
  host: process.env.HOST || 'localhost',
  defaultRoom: process.env.DEFAULT_ROOM || 'lobby',
  heartbeatInterval: 30000
};
