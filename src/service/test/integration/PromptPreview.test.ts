import * as request from 'supertest';
import app from '../../app';

const supertest = (request as any).default || request;

describe('Prompt Preview Integration', () => {
  it('gets system prompt', async () => {
    const response = await supertest(app.callback())
      .post('/listings/system-prompt')
      .send({ lifestyleCount: 1 });

    expect(response.status).toBe(200);
    expect(response.body.systemPrompt).toBeDefined();
    expect(response.body.systemPrompt).toContain('lifestyle');
  });

  it('gets default prompt for empty request', async () => {
    const response = await supertest(app.callback())
      .post('/listings/system-prompt')
      .send({});

    expect(response.status).toBe(200);
    expect(response.body.systemPrompt).toContain('hero');
  });

  it('gets default prompt for missing body', async () => {
    const response = await supertest(app.callback())
      .post('/listings/system-prompt');

    expect(response.status).toBe(200);
    expect(response.body.systemPrompt).toContain('hero');
  });

  it('fails for GET request', async () => {
    const response = await supertest(app.callback())
      .get('/listings/system-prompt');

    expect(response.status).toBe(405);
    expect(response.body.error).toContain('Use POST instead');
  });
});
