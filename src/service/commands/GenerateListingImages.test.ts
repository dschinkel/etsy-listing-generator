import { createGenerateListingImages } from './GenerateListingImages';
import { createListingRepository } from '../repositories/ListingRepository';
import { createGeminiImageGenerator } from '../data/GeminiImageGenerator';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

describe('Generate Listing Images', () => {
  const testImagePath = path.join(process.cwd(), 'test', 'product-reference.png');
  const testImageBase64 = `data:image/png;base64,${fs.readFileSync(testImagePath).toString('base64')}`;
  
  const dataLayer = createGeminiImageGenerator();
  const repository = createListingRepository(dataLayer);
  const command = createGenerateListingImages(repository);

  it('executes generation for requested shot types using real parameters', async () => {
    const requestBody = { 
      lifestyleCount: 1,
      productImages: [testImageBase64] 
    };
    
    const response = await command.execute(requestBody as any);
    
    expect(response.images.length).toBe(1);
    expect(response.images.every(img => img.url.startsWith('/') || img.url.startsWith('http') || img.url.startsWith('data:'))).toBe(true);
    expect(response.images.every(img => !img.url.includes('placehold.jp'))).toBe(true);
    expect(response.systemPrompt).toBeDefined();
    expect(response.systemPrompt).toContain('Etsy seller');
  });

  it('executes generation with multiple product reference images', async () => {
    let capturedRequest = null;
    const fakeRepository = {
      generateImages: async (request: any) => {
        capturedRequest = request;
        return { images: [] };
      }
    };

    const commandWithFake = createGenerateListingImages(fakeRepository);
    const requestBody = {
      lifestyleCount: 1,
      productImages: [testImageBase64, testImageBase64]
    };

    await commandWithFake.execute(requestBody as any);

    expect(capturedRequest).toEqual(expect.objectContaining({
      productImages: [testImageBase64, testImageBase64]
    }));
  });
});
