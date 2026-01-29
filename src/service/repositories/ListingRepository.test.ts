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
    const fakeDataLayer = {
      generateImage: jest.fn().mockImplementation(({ type }) => Promise.resolve({ imageUrl: `data:image/png;base64,${type}`, systemInstruction: `prompt for ${type}` })),
      getSystemPrompt: jest.fn().mockReturnValue('mock prompt')
    };
    const repository = createListingRepository(fakeDataLayer);
    const params = { 
      lifestyleCount: 1,
      heroCount: 1,
      productImage: testImageBase64 
    };
    
    const result = await repository.generateImages(params);
    
    expect(result.images).toHaveLength(2);
    expect(result.images[0].type).toBe('lifestyle');
    expect(result.images[1].type).toBe('hero');
    expect(fakeDataLayer.generateImage).toHaveBeenCalledTimes(2);
  });

  it('handles zero counts correctly', async () => {
    const dataLayer = createGeminiImageGenerator();
    const repository = createListingRepository(dataLayer);
    const params = { lifestyleCount: 0, heroCount: 0 };
    
    const result = await repository.generateImages(params);
    
    expect(result.images.length).toBe(0);
    expect(result.systemPrompt).toContain('Role: You are an image-generation assistant');
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

  it('orchestrates generation of themed environment shots', async () => {
    const fakeDataLayer = {
      generateImage: jest.fn().mockImplementation(({ type }) => Promise.resolve({ imageUrl: `data:image/png;base64,${type}`, systemInstruction: `prompt for ${type}` })),
      getSystemPrompt: jest.fn().mockReturnValue('mock prompt')
    };
    const repository = createListingRepository(fakeDataLayer);
    const params = { 
      themedEnvironmentCount: 1,
      themedEnvironmentCustomContext: 'In a forest'
    };
    
    const result = await repository.generateImages(params);
    
    expect(result.images).toHaveLength(1);
    expect(result.images[0].type).toBe('themed-environment');
    expect(fakeDataLayer.generateImage).toHaveBeenCalledWith(expect.objectContaining({
      type: 'themed-environment',
      customContext: 'In a forest'
    }));
  });

  it('generates a single image', async () => {
    const fakeDataLayer = {
      generateImage: jest.fn().mockImplementation(({ type }) => Promise.resolve({ imageUrl: `data:image/png;base64,${type}`, systemInstruction: `prompt for ${type}` })),
      getSystemPrompt: jest.fn().mockReturnValue('mock prompt')
    };
    const repository = createListingRepository(fakeDataLayer);
    const params = { 
      type: 'lifestyle',
      customContext: 'Better lighting'
    };
    
    const result = await repository.generateSingleImage(params);
    
    expect(result.image.type).toBe('lifestyle');
    expect(result.image.url).toContain('/assets/generated-images/lifestyle');
    expect(fakeDataLayer.generateImage).toHaveBeenCalledWith(expect.objectContaining({
      type: 'lifestyle',
      customContext: 'Better lighting'
    }));
  });
});
