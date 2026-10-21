const http = require('node:http');

const port = Number(process.env.PORT || 3000);

const server = http.createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/health') {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  if (request.method === 'GET' && request.url === '/metrics') {
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
    return;
  }

  response.writeHead(404, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(port, '0.0.0.0', () => {
  console.log(`TrustLens backend listening on port ${port}`);
});
