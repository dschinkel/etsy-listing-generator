import * as request from 'supertest';
import app from '../../app';
import * as fs from 'fs';
import * as path from 'path';

const supertest = (request as any).default || request;

describe('Four Lifestyle Shots Integration', () => {
  const testImagePath = path.join(process.cwd(), 'test', 'product-reference.png');
  const testImageBase64 = `data:image/png;base64,${fs.readFileSync(testImagePath).toString('base64')}`;

  it('generates 4 lifestyle images successfully', async () => {
    const requestBody = {
      lifestyleCount: 4,
      heroCount: 0,
      closeUpsCount: 0,
      flatLayCount: 0,
      macroCount: 0,
      contextualCount: 0,
      productImages: [testImageBase64],
    };

    const response = await supertest(app.callback())
      .post('/listings/generate')
      .send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body.images).toBeDefined();
    expect(response.body.images.length).toBe(4);
    response.body.images.forEach((img: any) => {
      expect(img.type).toBe('lifestyle');
      expect(img.url).toMatch(/^(\/|http|data:)/);
    });
  }, 300000); // Increase timeout for image generation
});
