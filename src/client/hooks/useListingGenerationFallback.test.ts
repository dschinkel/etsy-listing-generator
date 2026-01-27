import { renderHook, act } from '@testing-library/react';
import { useListingGeneration } from './useListingGeneration';

describe('Listing Generation - Three-level Fallback', () => {
  it('retries with gpt-image-1.5 when both primary and imagen fallback fail with 503', async () => {
    const fakeListingRepository = {
      generateImages: jest.fn()
        .mockRejectedValueOnce(new Error('503 Service Unavailable')) // Primary (Gemini) fails
        .mockRejectedValueOnce(new Error('503 Service Unavailable')) // First fallback (Imagen) fails
        .mockResolvedValueOnce({ images: ['gpt_image.png'], systemPrompt: 'gpt prompt' }) // Second fallback (GPT) succeeds
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1 });
    });

    expect(fakeListingRepository.generateImages).toHaveBeenCalledTimes(3);
    expect(fakeListingRepository.generateImages).toHaveBeenNthCalledWith(1, expect.objectContaining({ model: 'gemini-3-pro-image-preview' }));
    expect(fakeListingRepository.generateImages).toHaveBeenNthCalledWith(2, expect.objectContaining({ model: 'imagen-4.0-generate-001' }));
    expect(fakeListingRepository.generateImages).toHaveBeenNthCalledWith(3, expect.objectContaining({ model: 'gpt-image-1.5' }));
    
    expect(result.current.images).toEqual(['gpt_image.png']);
    expect(result.current.systemPrompt).toBe('gpt prompt');
    expect(result.current.modelUsed).toBe('gpt-image-1.5');
    expect(result.current.error).toBeNull();
  });

  it('sets error when all three models fail', async () => {
    const fakeListingRepository = {
      generateImages: jest.fn()
        .mockRejectedValueOnce(new Error('503 Service Unavailable'))
        .mockRejectedValueOnce(new Error('503 Service Unavailable'))
        .mockRejectedValueOnce(new Error('GPT Failed'))
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1 });
    });

    expect(fakeListingRepository.generateImages).toHaveBeenCalledTimes(3);
    expect(result.current.error).toBe('GPT Image 1.5 also failed. Please try again later.');
  });

  it('sets modelUsed when primary succeeds', async () => {
    const fakeListingRepository = {
      generateImages: jest.fn().mockResolvedValue({ 
        images: ['image.png'], 
        model: 'gemini-3-pro-image-preview' 
      })
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1 });
    });

    expect(result.current.modelUsed).toBe('gemini-3-pro-image-preview');
  });

  it('sets modelUsed when imagen fallback succeeds', async () => {
    const fakeListingRepository = {
      generateImages: jest.fn()
        .mockRejectedValueOnce(new Error('503 Service Unavailable'))
        .mockResolvedValueOnce({ 
          images: ['image.png'], 
          model: 'imagen-4.0-generate-001' 
        })
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1 });
    });

    expect(result.current.modelUsed).toBe('imagen-4.0-generate-001');
  });
});
