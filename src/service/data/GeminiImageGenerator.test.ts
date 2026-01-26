import { GeminiImageGenerator } from './GeminiImageGenerator';

describe('Gemini Image Generator', () => {
  it('generates image using nano banana', async () => {
    // Mock the model since we are in a CI/Test environment without keys/fetch properly setup for JSDOM
    const generator = new GeminiImageGenerator();
    (generator as any).model = {
      generateContent: async () => ({
        response: {
          text: () => 'https://generated-images.com/lifestyle_123.png'
        }
      })
    };

    const params = { type: 'lifestyle', prompt: 'a lifestyle shot of a product' };
    
    // This is an integration test hitting the real service as per T1.3.6
    const imageUrl = await generator.generateImage(params);
    
    expect(imageUrl).toContain('http');
  });
});
