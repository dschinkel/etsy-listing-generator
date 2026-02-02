import { createGeminiImageGenerator } from './GeminiImageGenerator';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

describe('Gemini Image Generator', () => {
  const testImagePath = path.join(process.cwd(), 'test', 'product-reference.png');
  const testImageBase64 = `data:image/png;base64,${fs.readFileSync(testImagePath).toString('base64')}`;

  it('generates an image for a specific shot type and count', async () => {
    const generator = createGeminiImageGenerator();
    const params = { 
      type: 'lifestyle', 
      count: 1,
      productImages: [testImageBase64]
    };
    
    const result = await generator.generateImage(params);
    
    expect(result.imageUrl).toMatch(/^(http|data:)/);
    expect(result.imageUrl).not.toContain('placehold.jp');
    expect(result.systemInstruction).toContain('lifestyle');
    expect(result.systemInstruction).toContain('1 image(s)');
  }, 60000);

  it('populates system instruction with correct shot type and count', async () => {
    const generator = createGeminiImageGenerator();
    const shotTypes = ['hero', 'close-up'];
    
    for (const type of shotTypes) {
      const result = await generator.generateImage({ type });
      expect(result.systemInstruction).toContain(type);
      expect(result.systemInstruction).toContain('1 image(s)'); // Default count is 1
    }
  });

  it('generates an image for themed environment shot type', async () => {
    const generator = createGeminiImageGenerator();
    const result = await generator.generateImage({ type: 'themed-environment' });
    
    expect(result.systemInstruction).toContain('themed environment');
    expect(result.systemInstruction).toContain('realistic, thematic setting');
  });

  it('includes all product images in the generation request', async () => {
    const generator = createGeminiImageGenerator();
    const params = { 
      type: 'lifestyle', 
      productImages: [testImageBase64, testImageBase64]
    };
    
    const result = await generator.generateImage(params);
    expect(result.imageUrl).toMatch(/^(http|data:)/);
  });
});
