// C:\inetpub\wwwroot\moonshot-frontend\moonshot-frontend\ecosystem.config.js
module.exports = {
  apps: [{
    name: 'moonshot-frontend',
    script: './server.js',
    cwd: './',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: 'localhost'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    log_file: './logs/combined.log',
    time: true
  }]
};