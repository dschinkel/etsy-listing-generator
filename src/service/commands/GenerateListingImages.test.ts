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
    const request = { 
      lifestyleCount: 1,
      heroCount: 1,
      productImage: testImageBase64 
    };
    
    const response = await command.execute(request);
    
    expect(response.images.length).toBe(2);
    expect(response.images.every(img => img.startsWith('http') || img.startsWith('data:'))).toBe(true);
    expect(response.images.every(img => !img.includes('placehold.jp'))).toBe(true);
    expect(response.systemPrompt).toBeDefined();
    expect(response.systemPrompt).toContain('Etsy seller');
  });

  it('verifies integration with real data layer through repository', async () => {
    const request = { 
      closeUpsCount: 1,
      productImage: testImageBase64
    };
    
    const response = await command.execute(request);
    
    expect(response.images.length).toBe(1);
    expect(response.systemPrompt).toContain('close-up');
  });
});
