import { ListingRepository } from './ListingRepository';

describe('Listing Repository', () => {
  it('generates multiple images for lifestyle shots', async () => {
    let callCount = 0;
    const fakeDataLayer = {
      generateImage: async (params: any) => {
        callCount++;
        return `image_${callCount}.png`;
      }
    };
    
    const repository = new ListingRepository(fakeDataLayer);
    const params = { lifestyleCount: 3 };
    
    const result = await repository.generateImages(params);
    
    expect(callCount).toBe(3);
    expect(result.images).toEqual(['image_1.png', 'image_2.png', 'image_3.png']);
  });

  it('includes product image in data layer calls', async () => {
    let capturedParams: any[] = [];
    const fakeDataLayer = {
      generateImage: async (params: any) => {
        capturedParams.push(params);
        return 'image.png';
      }
    };
    
    const repository = new ListingRepository(fakeDataLayer);
    const productImage = 'data:image/png;base64,encoded';
    const params = { lifestyleCount: 2, productImage };
    
    await repository.generateImages(params);
    
    expect(capturedParams).toHaveLength(2);
    expect(capturedParams[0]).toEqual({
      type: 'lifestyle',
      prompt: 'a lifestyle shot of the product in a realistic setting',
      productImage,
      background: undefined
    });
    expect(capturedParams[1]).toEqual({
      type: 'lifestyle',
      prompt: 'a lifestyle shot of the product in a realistic setting',
      productImage,
      background: undefined
    });
  });

  it('generates multiple images for hero shots', async () => {
    let callCount = 0;
    const fakeDataLayer = {
      generateImage: async (params: any) => {
        callCount++;
        return `hero_${callCount}.png`;
      }
    };
    
    const repository = new ListingRepository(fakeDataLayer);
    const params = { heroCount: 2 };
    
    const result = await repository.generateImages(params);
    
    expect(callCount).toBe(2);
    expect(result.images).toEqual(['hero_1.png', 'hero_2.png']);
  });

  it('generates multiple images for close-ups', async () => {
    let callCount = 0;
    const fakeDataLayer = {
      generateImage: async (params: any) => {
        callCount++;
        return `closeup_${callCount}.png`;
      }
    };
    
    const repository = new ListingRepository(fakeDataLayer);
    const params = { closeUpsCount: 2 };
    
    const result = await repository.generateImages(params);
    
    expect(callCount).toBe(2);
    expect(result.images).toEqual(['closeup_1.png', 'closeup_2.png']);
  });

  it('provides descriptive context for shot types', async () => {
    let capturedParams: any[] = [];
    const fakeDataLayer = {
      generateImage: async (params: any) => {
        capturedParams.push(params);
        return 'image.png';
      }
    };
    
    const repository = new ListingRepository(fakeDataLayer);
    
    await repository.generateImages({ lifestyleCount: 1, heroCount: 1, closeUpsCount: 1 });
    
    expect(capturedParams[0].prompt).toContain('lifestyle');
    expect(capturedParams[1].prompt).toContain('hero');
    expect(capturedParams[2].prompt).toContain('close-up');
    expect(capturedParams[0].prompt).not.toBe('a lifestyle shot of a product');
    expect(capturedParams[1].prompt).not.toBe('a hero shot of a product');
    expect(capturedParams[2].prompt).not.toBe('a close-up shot of a product');
  });
});
