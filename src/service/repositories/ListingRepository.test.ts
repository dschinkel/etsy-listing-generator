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
      prompt: 'a lifestyle shot of a product',
      productImage
    });
    expect(capturedParams[1]).toEqual({
      type: 'lifestyle',
      prompt: 'a lifestyle shot of a product',
      productImage
    });
  });
});
