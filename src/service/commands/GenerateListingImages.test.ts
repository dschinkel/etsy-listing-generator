import { GenerateListingImages } from './GenerateListingImages';

describe('Generate Listing Images', () => {
  it('generates listing images using nano banana', async () => {
    const fakeListingRepository = {
      generateImages: async (params: any) => ({
        images: ['image1.png', 'image2.png']
      })
    };
    
    const command = new GenerateListingImages(fakeListingRepository);
    const request = { lifestyleCount: 2 };
    
    const response = await command.execute(request);
    
    expect(response.images).toEqual(['image1.png', 'image2.png']);
  });
});
