import { GeminiImageGenerator } from './GeminiImageGenerator';

describe('Gemini Image Generator', () => {
  it('generates image using nano banana', async () => {
    const generator = new GeminiImageGenerator();
    const params = { type: 'lifestyle', prompt: 'a lifestyle shot of a product' };
    
    // This is an integration test hitting the real service as per T1.3.6
    const imageUrl = await generator.generateImage(params);
    
    expect(imageUrl).toContain('http');
  });
});
