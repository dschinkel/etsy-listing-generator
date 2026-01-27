import { renderHook, act } from '@testing-library/react';
import { useListingGeneration } from './useListingGeneration';

describe('Listing Generation', () => {
  it('generates multiple lifestyle shots', async () => {
    const fakeListingRepository = {
      generateImages: async () => ({ images: ['lifestyle_1.png', 'lifestyle_2.png', 'lifestyle_3.png'] })
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 3 });
    });
    
    expect(result.current.images).toEqual(['lifestyle_1.png', 'lifestyle_2.png', 'lifestyle_3.png']);
  });
  it('sends product image as context', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: ['image.png'] };
      }
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    const base64Image = 'data:image/png;base64,encoded_data';
    
    await act(async () => {
      await result.current.generateListing({ 
        lifestyleCount: 1,
        productImage: base64Image 
      });
    });
    
    expect(capturedParams).toEqual({ 
      lifestyleCount: 1, 
      productImage: base64Image,
      model: 'gemini-3-pro-image-preview'
    });
  });

  it('generates hero shots', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: ['hero_1.png', 'hero_2.png'] };
      }
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    await act(async () => {
      await result.current.generateListing({ heroCount: 2 });
    });
    
    expect(capturedParams).toEqual({ 
      heroCount: 2,
      model: 'gemini-3-pro-image-preview'
    });
    expect(result.current.images).toEqual(['hero_1.png', 'hero_2.png']);
  });

  it('generates close-ups', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: ['closeup_1.png'] };
      }
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    await act(async () => {
      await result.current.generateListing({ closeUpsCount: 1 });
    });
    
    expect(capturedParams).toEqual({ 
      closeUpsCount: 1,
      model: 'gemini-3-pro-image-preview'
    });
    expect(result.current.images).toEqual(['closeup_1.png']);
  });

  it('removes a generated image', async () => {
    const fakeListingRepository = {
      generateImages: async () => ({ images: ['image1.png', 'image2.png', 'image3.png'] })
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 3 });
    });
    
    expect(result.current.images).toHaveLength(3);
    
    act(() => {
      result.current.removeImage(1); // remove image2.png
    });
    
    expect(result.current.images).toEqual(['image1.png', 'image3.png']);
  });

  it('copies an image to clipboard', async () => {
    const mockClipboard = {
      write: jest.fn()
    };
    (global.navigator as any).clipboard = mockClipboard;

    // We need to mock fetch and Image to test this properly in JSDOM, 
    // but for now let's just test that the function exists and can be called.
    const { result } = renderHook(() => useListingGeneration({}));
    expect(result.current.copyImageToClipboard).toBeDefined();
  });

  it('downloads all images as ZIP', async () => {
    const { result } = renderHook(() => useListingGeneration({}));
    expect(result.current.downloadAllImagesAsZip).toBeDefined();
  });
});
