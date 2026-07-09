module.exports = {
  apps: [
    {
      name: 'desktop-pet-online-server',
      script: 'src/server.js',
      cwd: __dirname,
      env: {
        PORT: '8080',
        HOST: 'your-domain-or-ip',
        BIND_HOST: '0.0.0.0',
        DEFAULT_ROOM: 'lobby'
      }
    }
  ]
};
