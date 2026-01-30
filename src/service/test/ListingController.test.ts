import * as request from 'supertest';
import * as path from 'path';
import * as fs from 'fs';

const testDbPath = path.join(process.cwd(), 'src', 'db', 'context-templates.test.json');
process.env.TEMPLATE_DB_PATH = testDbPath;

// Using require to ensure env var is set before app initializes controller
const app = require('../app').default;

const supertest = (request as any).default || request;

describe('Listing Controller', () => {
  afterAll(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

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

  it('removes a template', async () => {
    const template = { name: 'ToRemove', text: 'Text' };
    await supertest(app.callback())
      .post('/listings/templates')
      .send(template);

    const response = await supertest(app.callback())
      .delete('/listings/templates/ToRemove');

    expect(response.status).toBe(200);
    
    const listResponse = await supertest(app.callback())
      .get('/listings/templates');
    const templates = listResponse.body.templates;
    expect(templates.find((t: any) => t.name === 'ToRemove')).toBeUndefined();
  });

  it('create listing', async () => {
    const listingData = {
      title: 'Test Etsy Listing',
      description: 'Test Description',
      price: '19.99',
      quantity: 1,
      shop_id: '12345',
      images: ['/src/assets/generated-images/test.png']
    };

    const response = await supertest(app.callback())
      .post('/listings/push-to-etsy')
      .send(listingData);

    expect(response.status).toBe(201);
    expect(response.body.url).toBeDefined();
  });

  it('gets shop id', async () => {
    process.env.ETSY_SHOP_ID = '56358327';
    const response = await supertest(app.callback())
      .get('/listings/shop-id');

    expect(response.status).toBe(200);
    expect(response.body.shop_id).toBe('56358327');
  });
});
