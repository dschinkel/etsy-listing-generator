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

  it('generates requested number of hero shots', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: ['hero1.png', 'hero2.png'] };
      }
    };
    
    const command = new GenerateListingImages(fakeListingRepository);
    const request = { heroCount: 2 };
    
    const response = await command.execute(request);
    
    expect(capturedParams).toEqual({ heroCount: 2 });
    expect(response.images).toEqual(['hero1.png', 'hero2.png']);
  });

  it('generates requested number of close-ups', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: ['closeup1.png'] };
      }
    };
    
    const command = new GenerateListingImages(fakeListingRepository);
    const request = { closeUpsCount: 1 };
    
    const response = await command.execute(request);
    
    expect(capturedParams).toEqual({ closeUpsCount: 1 });
    expect(response.images).toEqual(['closeup1.png']);
  });

  it('generates requested number of flat lay shots', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: ['flatlay1.png'] };
      }
    };
    
    const command = new GenerateListingImages(fakeListingRepository);
    const request = { flatLayCount: 1 };
    
    const response = await command.execute(request);
    
    expect(capturedParams).toEqual({ flatLayCount: 1 });
    expect(response.images).toEqual(['flatlay1.png']);
  });

  it('generates requested number of macro shots', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: ['macro1.png'] };
      }
    };
    
    const command = new GenerateListingImages(fakeListingRepository);
    const request = { macroCount: 1 };
    
    const response = await command.execute(request);
    
    expect(capturedParams).toEqual({ macroCount: 1 });
    expect(response.images).toEqual(['macro1.png']);
  });

  it('generates requested number of contextual shots', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: ['contextual1.png'] };
      }
    };
    
    const command = new GenerateListingImages(fakeListingRepository);
    const request = { contextualCount: 1 };
    
    const response = await command.execute(request);
    
    expect(capturedParams).toEqual({ contextualCount: 1 });
    expect(response.images).toEqual(['contextual1.png']);
  });
});
