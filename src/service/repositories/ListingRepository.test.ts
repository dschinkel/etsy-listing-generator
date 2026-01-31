import { createListingRepository } from './ListingRepository';
import { createGeminiImageGenerator } from '../data/GeminiImageGenerator';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

describe('Listing Repository', () => {
  const testImagePath = path.join(process.cwd(), 'test', 'product-reference.png');
  const testImageBase64 = `data:image/png;base64,${fs.readFileSync(testImagePath).toString('base64')}`;

  it('orchestrates generation of different shot types with multiple product images', async () => {
    const fakeDataLayer = {
      generateImage: jest.fn().mockImplementation(({ type }) => Promise.resolve({ imageUrl: `data:image/png;base64,${type}`, systemInstruction: `prompt for ${type}` })),
      getSystemPrompt: jest.fn().mockReturnValue('mock prompt')
    };
    const repository = createListingRepository(fakeDataLayer);
    const params = { 
      lifestyleCount: 1,
      heroCount: 1,
      productImages: [testImageBase64, testImageBase64] 
    };
    
    const result = await repository.generateImages(params);
    
    expect(result.images).toHaveLength(2);
    expect(fakeDataLayer.generateImage).toHaveBeenCalledWith(expect.objectContaining({
      productImages: [testImageBase64, testImageBase64]
    }));
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

  it('generates a single image with temperature', async () => {
    const fakeDataLayer = {
      generateImage: jest.fn().mockImplementation(({ type }) => Promise.resolve({ imageUrl: `data:image/png;base64,${type}`, systemInstruction: `prompt for ${type}` })),
      getSystemPrompt: jest.fn().mockReturnValue('mock prompt')
    };
    const repository = createListingRepository(fakeDataLayer);
    const params = { 
      type: 'lifestyle',
      temperature: 0.9
    };
    
    await repository.generateSingleImage(params);
    
    expect(fakeDataLayer.generateImage).toHaveBeenCalledWith(expect.objectContaining({
      type: 'lifestyle',
      temperature: 0.9
    }));
  });

  it('passes a seed when createSimilar is enabled', async () => {
    const fakeDataLayer = {
      generateImage: jest.fn().mockImplementation(({ type }) => Promise.resolve({ imageUrl: `data:image/png;base64,${type}`, systemInstruction: `prompt for ${type}` })),
      getSystemPrompt: jest.fn().mockReturnValue('mock prompt')
    };
    const repository = createListingRepository(fakeDataLayer);
    const params = { 
      lifestyleCount: 1,
      lifestyleCreateSimilar: true
    };
    
    await repository.generateImages(params);
    
    expect(fakeDataLayer.generateImage).toHaveBeenCalledWith(expect.objectContaining({
      type: 'lifestyle',
      seed: expect.any(Number)
    }));
  });

  it('passes temperature to the data layer', async () => {
    const fakeDataLayer = {
      generateImage: jest.fn().mockImplementation(({ type }) => Promise.resolve({ imageUrl: `data:image/png;base64,${type}`, systemInstruction: `prompt for ${type}` })),
      getSystemPrompt: jest.fn().mockReturnValue('mock prompt')
    };
    const repository = createListingRepository(fakeDataLayer);
    const params = { 
      lifestyleCount: 1,
      temperature: 0.7
    };
    
    await repository.generateImages(params);
    
    expect(fakeDataLayer.generateImage).toHaveBeenCalledWith(expect.objectContaining({
      temperature: 0.7
    }));
  });
});
