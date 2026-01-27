/**
 * @jest-environment node
 */
import * as request from 'supertest';
import app from '../app';

const supertest = (request as any).default || request;

describe('Listings Integration', () => {
  it('generates images using real gemini api', async () => {
    const requestBody = {
      lifestyleCount: 1,
      heroCount: 0,
      closeUpsCount: 0,
      productImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      lifestyleBackground: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
    };

    const response = await supertest(app.callback())
      .post('/listings/generate')
      .send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body.images).toBeDefined();
    expect(Array.isArray(response.body.images)).toBe(true);
    expect(response.body.images.length).toBeGreaterThan(0);
    expect(response.body.images[0]).toContain('http');
  }, 30000); // Increase timeout for real API call
});
