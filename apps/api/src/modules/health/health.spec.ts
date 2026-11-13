import request from 'supertest';
import { initApp } from '@/app';

describe('GET /api/v1/health', () => {
  const app = initApp();

  it('returns ok status', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: 'ok' });
    expect(typeof response.body.uptime).toBe('number');
  });

  it('returns a 404 error response for unknown routes', async () => {
    const response = await request(app).get('/api/v1/does-not-exist');

    expect(response.status).toBe(404);
    expect(response.body.error).toMatchObject({ statusCode: 404 });
  });
});
