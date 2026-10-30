const test = require('node:test');
const assert = require('node:assert');
const app = require('../app');
 
async function withServer(fn) {
  const server = app.listen(0);
  const base = 'http://127.0.0.1:' + server.address().port;
  try {
    await fn(base);
  } finally {
    server.close();
    server.closeAllConnections();
  }
}
 
test('GET /health returns UP', async () => {
  await withServer(async (base) => {
    const res = await fetch(base + '/health');
    const body = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(body.status, 'UP');
  });
});
 
test('POST /api/events creates an event', async () => {
  await withServer(async (base) => {
    const res = await fetch(base + '/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', date: '2026-12-31', venue: 'Hall' })
    });
    assert.strictEqual(res.status, 201);
    const list = await (await fetch(base + '/api/events')).json();
    assert.ok(list.some((e) => e.name === 'Test'));
  });
});
