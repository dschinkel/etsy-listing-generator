import * as request from 'supertest';
import app from '../../app';
import * as fs from 'fs';
import * as path from 'path';

const supertest = (request as any).default || request;

describe('Gemini Image Generator Integration', () => {
  const testImagePath = path.join(process.cwd(), 'test', 'product-reference.png');
  const testImageBase64 = `data:image/png;base64,${fs.readFileSync(testImagePath).toString('base64')}`;

  it('generates images using gemini', async () => {
    const count = 1;
    const requestBody = {
      lifestyleCount: count,
      heroCount: 0,
      closeUpsCount: 0,
      productImage: testImageBase64,
      lifestyleBackground: testImageBase64
    };

    const response = await supertest(app.callback())
      .post('/listings/generate')
      .send(requestBody);

    expect(response.status).toBe(200);
    expect(response.body.images).toBeDefined();
    expect(Array.isArray(response.body.images)).toBe(true);
    expect(response.body.images.length).toBeGreaterThan(0);
    expect(response.body.images[0]).toMatch(/^(http|data:)/);
    expect(response.body.images[0]).not.toContain('placehold.jp');
    
    expect(response.body.systemPrompt).toBeDefined();
    expect(response.body.systemPrompt).toContain('Etsy seller');
    expect(response.body.systemPrompt).toContain('lifestyle');
  });
});
