import { GenerateListingImages } from './GenerateListingImages';

describe('Generate Listing Images', () => {
  it('generates requested number of lifestyle shots', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: ['image1.png', 'image2.png', 'image3.png'] };
      }
    };
    
    const command = new GenerateListingImages(fakeListingRepository);
    const request = { lifestyleCount: 3 };
    
    const response = await command.execute(request);
    
    expect(capturedParams).toEqual({ lifestyleCount: 3 });
    expect(response.images).toEqual(['image1.png', 'image2.png', 'image3.png']);
  });

  it('passes product image to repository', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: ['image1.png'] };
      }
    };
    
    const command = new GenerateListingImages(fakeListingRepository);
    const request = { 
      lifestyleCount: 1, 
      productImage: 'data:image/png;base64,encoded' 
    };
    
    await command.execute(request);
    
    expect(capturedParams).toEqual(request);
  });
});
