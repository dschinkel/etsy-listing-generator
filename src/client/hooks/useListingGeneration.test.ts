import { renderHook, act } from '@testing-library/react';
import { useListingGeneration } from './useListingGeneration';

describe('Listing Generation', () => {
  it('generates listing images for lifestyle shots', async () => {
    const fakeListingRepository = {
      generateImages: async () => ['lifestyle_1.png', 'lifestyle_2.png']
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 2 });
    });
    
    expect(result.current.images).toEqual(['lifestyle_1.png', 'lifestyle_2.png']);
  });
});
