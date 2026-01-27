import * as request from 'supertest';
import app from '../../app';

const supertest = (request as any).default || request;

describe('Generate Listing Images Error Handling', () => {
  it('returns system prompt even when zero images are requested', async () => {
    const requestBody = {
      lifestyleCount: 0,
      heroCount: 0
    };

    const response = await supertest(app.callback())
      .post('/listings/generate')
      .send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body.images).toEqual([]);
    expect(response.body.systemPrompt).toBeDefined();
    expect(response.body.systemPrompt).toContain('Role: You are an image-generation assistant');
  });

  // Note: Testing real error response with systemPrompt is hard without mocking the data layer,
  // but we can at least verify the controller logic if we had a way to force an error.
});
