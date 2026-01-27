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
      productImage: testImageBase64 
    };
    
    const result = await repository.generateImages(params);
    
    expect(result.images.length).toBe(1);
    expect(result.images.every(url => url.startsWith('http') || url.startsWith('data:'))).toBe(true);
    expect(result.images.every(url => !url.includes('placehold.jp'))).toBe(true);
    expect(result.systemPrompt).toContain('lifestyle');
  });

  it('handles zero counts correctly', async () => {
    const dataLayer = createGeminiImageGenerator();
    const repository = createListingRepository(dataLayer);
    const params = { lifestyleCount: 0, heroCount: 0 };
    
    const result = await repository.generateImages(params);
    
    expect(result.images.length).toBe(0);
    expect(result.systemPrompt).toBe('');
  });

  it('provides a prompt preview based on parameters', async () => {
    const dataLayer = createGeminiImageGenerator();
    const repository = createListingRepository(dataLayer);
    
    const result = await repository.getPromptPreview({ lifestyleCount: 1 });
    
    expect(result.systemPrompt).toContain('lifestyle');
    expect(result.systemPrompt).toContain('1');
  });

  it('provides a default prompt preview when no counts are specified', async () => {
    const dataLayer = createGeminiImageGenerator();
    const repository = createListingRepository(dataLayer);
    
    const result = await repository.getPromptPreview({});
    
    expect(result.systemPrompt).toContain('hero');
    expect(result.systemPrompt).toContain('1');
  });
});
