const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { buildApp } = require('../src/app');

test('health endpoint returns ok status', async () => {
  const app = buildApp();
  const response = await request(app).get('/health');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'ok' });
});

test('metrics endpoint returns Prometheus plaintext', async () => {
  const app = buildApp();
  const response = await request(app).get('/metrics');

  assert.equal(response.status, 200);
  assert.match(response.text, /process_uptime_seconds/);
});

test('protected scan endpoint rejects missing token', async () => {
  const app = buildApp();
  const response = await request(app).get('/api/scans');

  assert.equal(response.status, 401);
  assert.equal(response.body.error, 'Authentication required');
});
