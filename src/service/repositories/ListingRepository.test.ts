import { createListingRepository } from './ListingRepository';
import { createGeminiImageGenerator } from '../data/GeminiImageGenerator';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

describe('Listing Repository', () => {
  const testImagePath = path.join(process.cwd(), 'test', 'product-reference.png');
  const testImageBase64 = `data:image/png;base64,${fs.readFileSync(testImagePath).toString('base64')}`;

  it('orchestrates generation of different shot types', async () => {
    const dataLayer = createGeminiImageGenerator();
    const repository = createListingRepository(dataLayer);
    const params = { 
      lifestyleCount: 1, 
      heroCount: 1,
      productImage: testImageBase64 
    };
    
    const result = await repository.generateImages(params);
    
    expect(result.images.length).toBe(2);
    expect(result.images.every(url => url.startsWith('http') || url.startsWith('data:'))).toBe(true);
    expect(result.images.every(url => !url.includes('placehold.jp'))).toBe(true);
    expect(result.systemPrompt).toContain('lifestyle');
    // We only capture the first system prompt in the repository currently, 
    // which is fine as they are all based on the same template.
  });

  it('handles zero counts correctly', async () => {
    const dataLayer = createGeminiImageGenerator();
    const repository = createListingRepository(dataLayer);
    const params = { lifestyleCount: 0, heroCount: 0 };
    
    const result = await repository.generateImages(params);
    
    expect(result.images.length).toBe(0);
    expect(result.systemPrompt).toBe('');
  });
});
