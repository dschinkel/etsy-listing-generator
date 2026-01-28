import * as request from 'supertest';
import app from '../app';

const supertest = (request as any).default || request;

describe('Listing Controller', () => {
  it('lists templates', async () => {
    const response = await supertest(app.callback())
      .get('/listings/templates');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.templates)).toBe(true);
  });

  it('saves a new template', async () => {
    const template = { name: 'Kitchen', text: 'In a modern kitchen' };
    const response = await supertest(app.callback())
      .post('/listings/templates')
      .send(template);

    expect(response.status).toBe(201);
    expect(response.body.template).toBeDefined();
    expect(response.body.template.name).toBe('Kitchen');
    expect(response.body.template.text).toBe('In a modern kitchen');
  });
});
