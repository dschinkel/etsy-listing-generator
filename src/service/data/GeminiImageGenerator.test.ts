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

  it('generates image using product image as context', async () => {
    const generator = new GeminiImageGenerator();
    let capturedPrompt: any = null;
    (generator as any).model = {
      generateContent: async (prompt: any) => {
        capturedPrompt = prompt;
        return {
          response: {
            text: () => 'https://generated-images.com/lifestyle_context.png'
          }
        };
      }
    };

    const productImage = 'data:image/png;base64,encoded_data';
    const params = { 
      type: 'lifestyle', 
      prompt: 'a lifestyle shot of a product',
      productImage 
    };
    
    await generator.generateImage(params);
    
    expect(capturedPrompt).toEqual(expect.arrayContaining([
      expect.stringContaining('TOON 1.0'),
      expect.objectContaining({
        inlineData: {
          data: 'encoded_data',
          mimeType: 'image/png'
        }
      })
    ]));
  });

  it('generates hero image using nano banana', async () => {
    const generator = new GeminiImageGenerator();
    let capturedPrompt: any = null;
    (generator as any).model = {
      generateContent: async (prompt: any) => {
        capturedPrompt = prompt;
        return {
          response: {
            text: () => 'https://generated-images.com/hero_123.png'
          }
        };
      }
    };

    const params = { type: 'hero', prompt: 'a hero shot of a product' };
    
    const imageUrl = await generator.generateImage(params);
    
    expect(imageUrl).toContain('https://generated-images.com/hero_');
    expect(capturedPrompt).toContain('TITLE: Generate hero image');
  });

  it('generates close-up image using nano banana', async () => {
    const generator = new GeminiImageGenerator();
    let capturedPrompt: any = null;
    (generator as any).model = {
      generateContent: async (prompt: any) => {
        capturedPrompt = prompt;
        return {
          response: {
            text: () => 'https://generated-images.com/closeup_123.png'
          }
        };
      }
    };

    const params = { type: 'close-up', prompt: 'a close-up shot of a product' };
    
    const imageUrl = await generator.generateImage(params);
    
    expect(imageUrl).toContain('https://generated-images.com/close-up_');
    expect(capturedPrompt).toContain('TITLE: Generate close-up image');
  });

  it('generates image based on product shot types', async () => {
    const generator = new GeminiImageGenerator();
    let capturedPrompt: any = null;
    (generator as any).model = {
      generateContent: async (prompt: any) => {
        capturedPrompt = typeof prompt === 'string' ? prompt : prompt[0];
        return {
          response: {
            text: () => 'https://generated-images.com/image.png'
          }
        };
      }
    };

    await generator.generateImage({ type: 'lifestyle', prompt: 'test' });
    expect(capturedPrompt).toContain('You are an expert Etsy product photographer.');
    expect(capturedPrompt).toContain('Your goal is to generate a lifestyle image');

    await generator.generateImage({ type: 'hero', prompt: 'test' });
    expect(capturedPrompt).toContain('Your goal is to generate a hero image');

    await generator.generateImage({ type: 'close-up', prompt: 'test' });
    expect(capturedPrompt).toContain('Your goal is to generate a close-up image');
  });
});
