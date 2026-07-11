const port = Number(process.env.PET_SERVER_PORT || 80);
const hostname = process.env.PET_SERVER_HOST || '119.91.133.102';
const protocol = process.env.PET_SERVER_PROTOCOL || 'ws';

module.exports = {
  wsUrl: process.env.PET_SERVER_URL || `${protocol}://${hostname}${port === 80 ? '' : `:${port}`}/ws`
};
