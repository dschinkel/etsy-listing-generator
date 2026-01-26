import { renderHook, act } from '@testing-library/react';
import { useListingGeneration } from './useListingGeneration';

describe('Listing Generation', () => {
  it('generates multiple lifestyle shots', async () => {
    const fakeListingRepository = {
      generateImages: async () => ['lifestyle_1.png', 'lifestyle_2.png', 'lifestyle_3.png']
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
        return ['image.png'];
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
      productImage: base64Image 
    });
  });
});
