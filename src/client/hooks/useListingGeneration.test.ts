import { renderHook, act } from '@testing-library/react';
import { useListingGeneration } from './useListingGeneration';

describe('Listing Generation', () => {
  it('generates multiple lifestyle shots', async () => {
    const fakeListingRepository = {
      generateImages: async () => ({ 
        images: [
          { url: 'lifestyle_1.png', type: 'lifestyle' }, 
          { url: 'lifestyle_2.png', type: 'lifestyle' }, 
          { url: 'lifestyle_3.png', type: 'lifestyle' }
        ] 
      })
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 3 });
    });
    
    expect(result.current.images).toEqual([
      { url: 'lifestyle_1.png', type: 'lifestyle' }, 
      { url: 'lifestyle_2.png', type: 'lifestyle' }, 
      { url: 'lifestyle_3.png', type: 'lifestyle' }
    ]);
  });
  it('sends product image as context', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: [{ url: 'image.png', type: 'lifestyle' }] };
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
      model: 'gemini-2.5-flash-image',
      noFallback: true
    });
  });

  it('generates hero shots', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: [{ url: 'hero_1.png', type: 'hero' }, { url: 'hero_2.png', type: 'hero' }] };
      }
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    await act(async () => {
      await result.current.generateListing({ heroCount: 2 });
    });
    
    expect(capturedParams).toEqual({ 
      heroCount: 2,
      model: 'gemini-2.5-flash-image',
      noFallback: true
    });
    expect(result.current.images).toEqual([{ url: 'hero_1.png', type: 'hero' }, { url: 'hero_2.png', type: 'hero' }]);
  });

  it('generates close-ups', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: [{ url: 'closeup_1.png', type: 'close-up' }] };
      }
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    await act(async () => {
      await result.current.generateListing({ closeUpsCount: 1 });
    });
    
    expect(capturedParams).toEqual({ 
      closeUpsCount: 1,
      model: 'gemini-2.5-flash-image',
      noFallback: true
    });
    expect(result.current.images).toEqual([{ url: 'closeup_1.png', type: 'close-up' }]);
  });

  it('removes a generated image', async () => {
    const fakeListingRepository = {
      generateImages: async () => ({ 
        images: [
          { url: '/src/assets/generated-images/image1.png', type: 'lifestyle' }, 
          { url: '/src/assets/generated-images/image2.png', type: 'lifestyle' }, 
          { url: '/src/assets/generated-images/image3.png', type: 'lifestyle' }
        ] 
      }),
      deleteImage: jest.fn().mockResolvedValue(true)
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 3 });
    });
    
    expect(result.current.images).toHaveLength(3);
    
    act(() => {
      result.current.removeImage(1); // remove image2.png
    });
    
    expect(result.current.images).toEqual([
      { url: '/src/assets/generated-images/image1.png', type: 'lifestyle' }, 
      { url: '/src/assets/generated-images/image3.png', type: 'lifestyle' }
    ]);
    expect(fakeListingRepository.deleteImage).toHaveBeenCalledWith('/src/assets/generated-images/image2.png');
  });

  it('downloads an individual image', async () => {
    const { result } = renderHook(() => useListingGeneration({}));
    expect(result.current.downloadImage).toBeDefined();
  });

  it('downloads all images as ZIP', async () => {
    const { result } = renderHook(() => useListingGeneration({}));
    expect(result.current.downloadAllImagesAsZip).toBeDefined();
  });

  it('sets error when server returns error', async () => {
    const fakeListingRepository = {
      generateImages: jest.fn().mockRejectedValue(new Error('Server Error (503): Service Unavailable'))
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1 });
    });

    expect(result.current.error).toBe('Generation failed: Server Error (503): Service Unavailable');
    expect(result.current.isGenerating).toBe(false);
  });

  it('sets error when non-503 error occurs', async () => {
    const fakeListingRepository = {
      generateImages: jest.fn().mockRejectedValue(new Error('Something went wrong'))
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1 });
    });

    expect(result.current.error).toBe('Generation failed: Something went wrong');
  });

  it('fetches system prompt preview', async () => {
    const fakeListingRepository = {
      getSystemPromptPreview: jest.fn().mockResolvedValue({ systemPrompt: 'preview prompt' })
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.fetchSystemPromptPreview({ lifestyleCount: 1 });
    });

    expect(result.current.systemPrompt).toBe('preview prompt');
    expect(fakeListingRepository.getSystemPromptPreview).toHaveBeenCalledWith({ lifestyleCount: 1 });
  });

  it('updates system prompt from error object if present', async () => {
    const errorWithPrompt: any = new Error('Something went wrong');
    errorWithPrompt.systemPrompt = 'error prompt';
    const fakeListingRepository = {
      generateImages: jest.fn().mockRejectedValue(errorWithPrompt)
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1 });
    });

    expect(result.current.systemPrompt).toBe('error prompt');
  });

  it('retries when server indicates retryable error', async () => {
    const error: any = new Error('503 Service Unavailable');
    error.retryable = true;
    error.nextModel = 'imagen-4.0-generate-001';

    const fakeListingRepository = {
      generateImages: jest.fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({ 
          images: [{ url: 'imagen_result.png', type: 'lifestyle' }], 
          model: 'imagen-4.0-generate-001',
          systemPrompt: 'imagen prompt'
        }),
      deleteImage: jest.fn()
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    // We need to use a shorter timeout for testing the delay, 
    // or mock timers. Let's mock timers.
    jest.useFakeTimers();

    let generationPromise: Promise<void>;
    await act(async () => {
      generationPromise = result.current.generateListing({ lifestyleCount: 1 });
    });

    // Check it's showing the first model
    expect(result.current.modelUsed).toBe('gemini-2.5-flash-image');
    expect(result.current.error).toContain('gemini-2.5-flash-image failed');

    // Advance time by 5 seconds
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    await act(async () => {
      await generationPromise;
    });

    expect(result.current.images).toEqual([{ url: 'imagen_result.png', type: 'lifestyle' }]);
    expect(result.current.modelUsed).toBe('imagen-4.0-generate-001');
    expect(result.current.error).toBeNull();
    expect(fakeListingRepository.generateImages).toHaveBeenCalledTimes(2);
    
    jest.useRealTimers();
  });

  it('retries when server indicates retryable error for non-503 failures', async () => {
    const error: any = new Error('Internal Server Error');
    error.retryable = true;
    error.nextModel = 'imagen-4.0-generate-001';

    const fakeListingRepository = {
      generateImages: jest.fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({ 
          images: [{ url: 'fallback_result.png', type: 'lifestyle' }], 
          model: 'imagen-4.0-generate-001',
          systemPrompt: 'fallback prompt'
        }),
      deleteImage: jest.fn()
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    jest.useFakeTimers();

    let generationPromise: Promise<void>;
    await act(async () => {
      generationPromise = result.current.generateListing({ lifestyleCount: 1 });
    });

    expect(result.current.error).toContain('gemini-2.5-flash-image failed');

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    await act(async () => {
      await generationPromise;
    });

    expect(result.current.images[0].url).toBe('fallback_result.png');
    expect(result.current.modelUsed).toBe('imagen-4.0-generate-001');
    
    jest.useRealTimers();
  });

  it('generates themed environment shots', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: [{ url: 'themed_1.png', type: 'themed-environment' }] };
      }
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    await act(async () => {
      await result.current.generateListing({ themedEnvironmentCount: 1 });
    });
    
    expect(capturedParams).toEqual(expect.objectContaining({ 
      themedEnvironmentCount: 1
    }));
    expect(result.current.images).toEqual([{ url: 'themed_1.png', type: 'themed-environment' }]);
  });

  it('retains previous images when new ones are generated', async () => {
    const fakeListingRepository = {
      generateImages: jest.fn()
        .mockResolvedValueOnce({ images: [{ url: 'image1.png', type: 'lifestyle' }] })
        .mockResolvedValueOnce({ images: [{ url: 'image2.png', type: 'hero' }] }),
      deleteImage: jest.fn().mockResolvedValue(true)
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1 });
    });
    expect(result.current.images).toHaveLength(1);
    expect(result.current.images[0].url).toBe('image1.png');

    await act(async () => {
      await result.current.generateListing({ heroCount: 1 });
    });
    expect(result.current.images).toHaveLength(2);
    expect(result.current.images[0].url).toBe('image1.png');
    expect(result.current.images[1].url).toBe('image2.png');
  });

  it('clears all images', async () => {
    const fakeListingRepository = {
      generateImages: async () => ({ images: [{ url: 'image1.png', type: 'lifestyle' }] }),
      deleteImage: jest.fn().mockResolvedValue(true)
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1 });
    });
    expect(result.current.images).toHaveLength(1);

    act(() => {
      result.current.clearImages();
    });
    expect(result.current.images).toHaveLength(0);
    expect(fakeListingRepository.deleteImage).toHaveBeenCalledWith('image1.png');
  });

  it('deletes image', async () => {
    const fakeListingRepository = {
      generateImages: async () => ({ images: [{ url: 'image1.png', type: 'lifestyle' }] }),
      deleteImage: jest.fn().mockResolvedValue(true)
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1 });
    });

    act(() => {
      result.current.removeImage(0);
    });

    expect(result.current.images).toHaveLength(0);
    expect(fakeListingRepository.deleteImage).toHaveBeenCalledWith('image1.png');
  });

  it('sets primary image and unsets others', async () => {
    const fakeListingRepository = {
      generateImages: jest.fn()
        .mockResolvedValueOnce({ 
          images: [
            { url: 'image1.png', type: 'lifestyle' },
            { url: 'image2.png', type: 'hero' }
          ] 
        }),
      deleteImage: jest.fn().mockResolvedValue(true)
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1, heroCount: 1 });
    });

    expect(result.current.images[0].isPrimary).toBeFalsy();
    expect(result.current.images[1].isPrimary).toBeFalsy();

    act(() => {
      result.current.setPrimaryImage(0);
    });

    expect(result.current.images[0].isPrimary).toBe(true);
    expect(result.current.images[1].isPrimary).toBe(false);

    act(() => {
      result.current.setPrimaryImage(1);
    });

    expect(result.current.images[0].isPrimary).toBe(false);
    expect(result.current.images[1].isPrimary).toBe(true);
  });

  it('unsets primary state if the primary image is removed', async () => {
    const fakeListingRepository = {
      generateImages: jest.fn().mockResolvedValue({ 
        images: [
          { url: 'image1.png', type: 'lifestyle' },
          { url: 'image2.png', type: 'hero' }
        ] 
      }),
      deleteImage: jest.fn().mockResolvedValue(true)
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1, heroCount: 1 });
    });

    act(() => {
      result.current.setPrimaryImage(0);
    });
    expect(result.current.images[0].isPrimary).toBe(true);

    act(() => {
      result.current.removeImage(0);
    });

    expect(result.current.images).toHaveLength(1);
    expect(result.current.images[0].url).toBe('image2.png');
    expect(result.current.images[0].isPrimary).toBeFalsy();
  });

  it('regenerates a single image', async () => {
    const fakeListingRepository = {
      generateImages: async () => ({ 
        images: [{ url: 'old_image.png', type: 'lifestyle' }] 
      }),
      generateSingleImage: jest.fn().mockResolvedValue({ 
        image: { url: 'new_image.png', type: 'lifestyle' } 
      }),
      deleteImage: jest.fn().mockResolvedValue(true)
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1 });
    });

    expect(result.current.images[0].url).toBe('old_image.png');

    await act(async () => {
      await result.current.regenerateImage(0, 'Better lighting');
    });

    expect(fakeListingRepository.generateSingleImage).toHaveBeenCalledWith(expect.objectContaining({
      type: 'lifestyle',
      customContext: 'Better lighting'
    }));
    expect(result.current.images[0].url).toBe('new_image.png');
    expect(fakeListingRepository.deleteImage).toHaveBeenCalledWith('old_image.png');
  });

  it('tracks the index of the image being regenerated', async () => {
    const fakeListingRepository = {
      generateImages: async () => ({ 
        images: [{ url: 'old.png', type: 'lifestyle' }] 
      }),
      generateSingleImage: async () => ({ 
        image: { url: 'new.png', type: 'lifestyle' } 
      }),
      deleteImage: async () => true
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1 });
    });

    let generationPromise: Promise<void>;
    act(() => {
      generationPromise = result.current.regenerateImage(0, 'context');
    });
    expect(result.current.regeneratingIndex).toBe(0);

    await act(async () => {
      await generationPromise;
    });

    expect(result.current.regeneratingIndex).toBeNull();
  });

  it('unsets generated primary images', async () => {
    const fakeListingRepository = {
      generateImages: jest.fn().mockResolvedValue({ 
        images: [
          { url: 'image1.png', type: 'lifestyle' }
        ] 
      })
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1 });
    });

    act(() => {
      result.current.setPrimaryImage(0);
    });
    expect(result.current.images[0].isPrimary).toBe(true);

    act(() => {
      result.current.clearPrimaryImage();
    });

    expect(result.current.images[0].isPrimary).toBe(false);
  });
});
