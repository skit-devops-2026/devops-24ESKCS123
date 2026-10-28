const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const scanRoutes = require('./routes/scans');

function buildApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_request, response) => {
    response.status(200).json({ status: 'ok' });
  });

  app.get('/metrics', (_request, response) => {
    const uptime = process.uptime();
    response.writeHead(200, { 'Content-Type': 'text/plain; version=0.0.4' });
    response.end(
      [
        '# HELP process_uptime_seconds Node.js process uptime in seconds.',
        '# TYPE process_uptime_seconds gauge',
        `process_uptime_seconds ${uptime}`,
        '',
      ].join('\n'),
    );
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/scans', scanRoutes);

  app.use((_request, response) => {
    response.status(404).json({ error: 'Not found' });
  });

  app.use((error, _request, response, _next) => {
    if (error.code === 11000) {
      response.status(409).json({ error: 'Email is already registered' });
      return;
    }

    if (error.name === 'ValidationError') {
      response.status(400).json({ error: error.message });
      return;
    }

    console.error(error);
    response.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = { buildApp };
