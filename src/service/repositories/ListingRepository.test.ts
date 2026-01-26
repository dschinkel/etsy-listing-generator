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
});
