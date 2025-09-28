module.exports = {
  apps: [
    {
      name: 'dcfv-bdc-tool',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5004
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5004
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 5004
      },
      log_file: './logs/dcfv-bdc-combined.log',
      out_file: './logs/dcfv-bdc-out.log',
      error_file: './logs/dcfv-bdc-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true
    }
  ]
};