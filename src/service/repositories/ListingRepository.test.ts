import { ListingRepository } from './ListingRepository';

describe('Listing Repository', () => {
  it('generates listing images', async () => {
    const fakeDataLayer = {
      generateImage: async (params: any) => 'image_from_nano_banana.png'
    };
    
    const repository = new ListingRepository(fakeDataLayer);
    const params = { type: 'lifestyle' };
    
    const result = await repository.generateListingImages(params);
    
    expect(result).toEqual({ images: ['image_from_nano_banana.png'] });
  });
});
