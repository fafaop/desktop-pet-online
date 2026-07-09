const port = Number(process.env.PET_SERVER_PORT || 8080);
const hostname = process.env.PET_SERVER_HOST || 'localhost';
const protocol = process.env.PET_SERVER_PROTOCOL || 'ws';

module.exports = {
  wsUrl: process.env.PET_SERVER_URL || `${protocol}://${hostname}:${port}`
};
