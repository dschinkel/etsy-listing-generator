import { renderHook, act } from '@testing-library/react';
import { useListingGeneration } from './useListingGeneration';

describe('Listing Generation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useListingGeneration({}));
    expect(result.current.etsyFormData.taxonomy_id).toBe('69154');
    expect(result.current.etsyFormData.category).toBe('Accessories > Keychains & Lanyards > Keychains');
    expect(result.current.etsyFormData.price).toBe('11.99');
    expect(result.current.etsyFormData.quantity).toBe('10');
  });

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
  it('sends product images as context', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: [{ url: 'image.png', type: 'lifestyle' }] };
      }
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    const base64Images = ['data:image/png;base64,image1', 'data:image/png;base64,image2'];
    
    await act(async () => {
      await result.current.generateListing({ 
        lifestyleCount: 1,
        productImages: base64Images 
      });
    });
    
    expect(capturedParams).toMatchObject({ 
      lifestyleCount: 1, 
      productImages: base64Images,
      model: 'gemini-3-pro-image-preview',
      noFallback: true,
      temperature: 1
    });
  });

  it('uses selected model for generation', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: [{ url: 'image.png', type: 'lifestyle' }] };
      }
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    await act(async () => {
      result.current.setSelectedModel('gemini-2.5-flash-image');
    });

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1 });
    });
    
    expect(capturedParams).toMatchObject({ 
      model: 'gemini-2.5-flash-image',
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
    
    expect(capturedParams).toMatchObject({ 
      heroCount: 2,
      model: 'gemini-3-pro-image-preview',
      noFallback: true,
      temperature: 1
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
    
    expect(capturedParams).toMatchObject({ 
      closeUpsCount: 1,
      model: 'gemini-3-pro-image-preview',
      noFallback: true,
      temperature: 1
    });
    expect(result.current.images).toEqual([{ url: 'closeup_1.png', type: 'close-up' }]);
  });

  it('sends editSpecifications when generating', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: [{ url: 'custom_1.png', type: 'custom' }] };
      }
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    await act(async () => {
      await result.current.generateListing({ 
        editSpecifications: [{ field: 'Name', value: 'New Name' }]
      });
    });
    
    expect(capturedParams).toMatchObject({ 
      editSpecifications: [{ field: 'Name', value: 'New Name' }]
    });
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

  it('fetches system prompt preview only when parameters change', async () => {
    const fakeListingRepository = {
      getSystemPromptPreview: jest.fn().mockResolvedValue({ systemPrompt: 'preview prompt' })
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.fetchSystemPromptPreview({ lifestyleCount: 1 });
    });

    expect(result.current.systemPrompt).toBe('preview prompt');
    expect(fakeListingRepository.getSystemPromptPreview).toHaveBeenCalledTimes(1);

    // Call again with same params
    await act(async () => {
      await result.current.fetchSystemPromptPreview({ lifestyleCount: 1 });
    });

    // Should not have called repository again
    expect(fakeListingRepository.getSystemPromptPreview).toHaveBeenCalledTimes(1);

    // Call with different params
    await act(async () => {
      await result.current.fetchSystemPromptPreview({ lifestyleCount: 2 });
    });

    expect(fakeListingRepository.getSystemPromptPreview).toHaveBeenCalledTimes(2);
  });

  it('does not overwrite sent prompt with preview right after generation', async () => {
    const fakeListingRepository = {
      generateImages: jest.fn().mockResolvedValue({ 
        images: [{ url: 'img.png', type: 'lifestyle' }], 
        systemPrompt: 'ACTUAL SENT PROMPT' 
      }),
      getSystemPromptPreview: jest.fn().mockResolvedValue({ systemPrompt: 'PREVIEW PROMPT' })
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    const params = { lifestyleCount: 1 };

    // 1. Get initial preview
    await act(async () => {
      await result.current.fetchSystemPromptPreview(params);
    });
    expect(result.current.systemPrompt).toBe('PREVIEW PROMPT');
    expect(fakeListingRepository.getSystemPromptPreview).toHaveBeenCalledTimes(1);

    // 2. Generate images
    await act(async () => {
      await result.current.generateListing(params);
    });
    expect(result.current.systemPrompt).toBe('ACTUAL SENT PROMPT');

    // 3. Try to fetch preview with same params (this mimics what App.tsx useEffect might do)
    await act(async () => {
      await result.current.fetchSystemPromptPreview(params);
    });

    // 4. Prompt should STILL be the ACTUAL SENT PROMPT, not the PREVIEW PROMPT
    expect(result.current.systemPrompt).toBe('ACTUAL SENT PROMPT');
    expect(fakeListingRepository.getSystemPromptPreview).toHaveBeenCalledTimes(1); // No new call
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
    expect(result.current.modelUsed).toBe('gemini-3-pro-image-preview');
    expect(result.current.error).toContain('gemini-3-pro-image-preview failed');

    // Advancing timers should be wrapped in act
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

    expect(result.current.error).toContain('gemini-3-pro-image-preview failed');

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

  it('publish listing', async () => {
    const fakeListingRepository = {
      publishListing: jest.fn().mockResolvedValue({ success: true, url: 'https://etsy.com/listing/123' }),
      getShopId: jest.fn().mockResolvedValue({ shop_id: '12345' })
    };

    const listingData = {
      title: 'Test Listing',
      description: 'Test Description',
      price: '19.99',
      quantity: '10',
      sku: 'SKU123',
      shop_id: '12345',
      who_made: 'i_did',
      when_made: 'recently',
      is_supply: true,
      personalization: 'engraving',
      category: 'Jewelry',
      tags: 'handmade,silver',
      shipping_profile: 'Standard',
      product_type: 'physical',
      readiness: 'active',
      taxonomy_id: '1234'
    };

    const selectedImages = ['image1.png', 'image2.png'];

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      // Set all the form data
      Object.entries(listingData).forEach(([field, value]) => {
        result.current.updateEtsyFormData(field, value);
      });
    });

    await act(async () => {
      await result.current.publishToEtsy(selectedImages);
    });

    expect(fakeListingRepository.publishListing).toHaveBeenCalledWith(expect.objectContaining({
      ...listingData,
      images: selectedImages
    }));
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
      await result.current.regenerateImage(0, 'Better lighting', ['prod1', 'prod2']);
    });

    expect(fakeListingRepository.generateSingleImage).toHaveBeenCalledWith(expect.objectContaining({
      type: 'lifestyle',
      customContext: 'Better lighting',
      productImages: expect.arrayContaining(['prod1', 'prod2', 'old_image.png'])
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

  it('appends custom context to system prompt and sends it with product images during regeneration', async () => {
    const fakeListingRepository = {
      generateImages: async () => ({ 
        images: [{ url: 'old.png', type: 'lifestyle' }],
        systemPrompt: 'Original system prompt'
      }),
      generateSingleImage: jest.fn().mockResolvedValue({ 
        image: { url: 'new.png', type: 'lifestyle' },
        systemPrompt: 'Original system prompt\nCustom context'
      }),
      deleteImage: async () => true
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    const productImages = ['prod1', 'prod2'];

    await act(async () => {
      await result.current.generateListing({ 
        lifestyleCount: 1,
        productImages
      });
    });

    expect(result.current.systemPrompt).toBe('Original system prompt');

    await act(async () => {
      await result.current.regenerateImage(0, 'Custom context', productImages);
    });

    // Verify it was called with the appended system prompt and product images
    expect(fakeListingRepository.generateSingleImage).toHaveBeenCalledWith(expect.objectContaining({
      systemPrompt: 'Original system prompt\nCustom context',
      productImages: expect.arrayContaining(['prod1', 'prod2', 'old.png'])
    }));
    
    // Verify systemPrompt state was updated
    expect(result.current.systemPrompt).toBe('Original system prompt\nCustom context');
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

  it('archives all images', async () => {
    const fakeListingRepository = {
      generateImages: async () => ({ 
        images: [
          { url: 'image1.png', type: 'lifestyle' },
          { url: 'image2.png', type: 'hero' }
        ] 
      }),
      archiveImages: jest.fn().mockResolvedValue({ success: true }),
      saveImage: jest.fn().mockImplementation((url) => Promise.resolve({ url }))
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1, heroCount: 1 });
    });

    await act(async () => {
      await result.current.archiveAllImages();
    });

    expect(fakeListingRepository.archiveImages).toHaveBeenCalledWith(['image1.png', 'image2.png']);
  });

  it('archives an individual listing image', async () => {
    const fakeListingRepository = {
      generateImages: async () => ({ 
        images: [
          { url: 'image1.png', type: 'lifestyle' },
          { url: 'image2.png', type: 'hero' }
        ] 
      }),
      archiveImages: jest.fn().mockResolvedValue({ success: true }),
      saveImage: jest.fn().mockImplementation((url) => Promise.resolve({ url }))
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1, heroCount: 1 });
    });

    await act(async () => {
      await result.current.archiveImage(1); // Archive image2.png
    });

    expect(fakeListingRepository.archiveImages).toHaveBeenCalledWith(['image2.png']);
  });

  it('tracks archived state for individual images', async () => {
    const fakeListingRepository = {
      generateImages: async () => ({ 
        images: [{ url: 'image1.png', type: 'lifestyle' }] 
      }),
      archiveImages: jest.fn().mockResolvedValue({ success: true }),
      saveImage: jest.fn().mockImplementation((url) => Promise.resolve({ url }))
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1 });
    });

    expect(result.current.images[0].isArchived).toBeFalsy();

    await act(async () => {
      await result.current.archiveImage(0);
    });

    expect(result.current.images[0].isArchived).toBe(true);
  });

  it('tracks archived state for all images when archived together', async () => {
    const fakeListingRepository = {
      generateImages: async () => ({ 
        images: [
          { url: 'image1.png', type: 'lifestyle' },
          { url: 'image2.png', type: 'hero' }
        ] 
      }),
      archiveImages: jest.fn().mockResolvedValue({ success: true }),
      saveImage: jest.fn().mockImplementation((url) => Promise.resolve({ url }))
    };

    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1, heroCount: 1 });
    });

    await act(async () => {
      await result.current.archiveAllImages();
    });

    expect(result.current.images[0].isArchived).toBe(true);
    expect(result.current.images[1].isArchived).toBe(true);
  });

  it('manages temperature state and passes it to generateListing', async () => {
    let capturedParams = null;
    const fakeListingRepository = {
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: [{ url: 'image.png', type: 'lifestyle' }] };
      }
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    expect(result.current.temperature).toBe(1.0); // Default value

    act(() => {
      result.current.setTemperature(0.5);
    });
    
    expect(result.current.temperature).toBe(0.5);

    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1 });
    });
    
    expect(capturedParams).toEqual(expect.objectContaining({ 
      temperature: 0.5
    }));
  });

  it('saves a generated image and updates the url and isSaved state', async () => {
    const fakeListingRepository = {
      generateImages: async () => ({ 
        images: [{ url: 'temp_image.png', type: 'lifestyle' }] 
      }),
      saveImage: jest.fn().mockResolvedValue({ url: 'saved_image.png' })
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1 });
    });
    
    expect(result.current.images[0].url).toBe('temp_image.png');
    expect(result.current.images[0].isSaved).toBeFalsy();
    
    await act(async () => {
      await result.current.saveImage(0);
    });
    
    expect(fakeListingRepository.saveImage).toHaveBeenCalledWith('temp_image.png', 'lifestyle');
    expect(result.current.images[0].url).toBe('saved_image.png');
    expect(result.current.images[0].isSaved).toBe(true);
  });

  it('preserves seeds in images state after generation', async () => {
    const fakeListingRepository = {
      generateImages: async () => ({ 
        images: [
          { url: 'image1.png', type: 'lifestyle', seed: 12345 },
          { url: 'image2.png', type: 'hero', seed: 67890 }
        ] 
      })
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    await act(async () => {
      await result.current.generateListing({ lifestyleCount: 1, heroCount: 1 });
    });
    
    expect(result.current.images[0].seed).toBe(12345);
    expect(result.current.images[1].seed).toBe(67890);
  });

  it('exposes currentSeeds immediately when generation starts', async () => {
    const fakeListingRepository = {
      generateImages: jest.fn().mockImplementation(() => new Promise(resolve => {
        // Delay resolution to check state during generation
        setTimeout(() => resolve({ images: [] }), 100);
      }))
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    let generationPromise: Promise<void>;
    act(() => {
      generationPromise = result.current.generateListing({ 
        lifestyleCount: 2, 
        lifestyleCreateSimilar: true 
      });
    });
    
    expect(result.current.currentSeeds).toHaveLength(2);
    expect(typeof result.current.currentSeeds[0]).toBe('number');
    
    await act(async () => {
      await generationPromise!;
    });
    
    expect(result.current.currentSeeds).toHaveLength(0);
  });

  it('allows adding manual images to the listing', async () => {
    const { result } = renderHook(() => useListingGeneration({}));
    
    act(() => {
      result.current.addManualImages(['data:image/png;base64,manual1', 'data:image/png;base64,manual2']);
    });
    
    expect(result.current.images).toHaveLength(2);
    expect(result.current.images[0]).toMatchObject({
      url: 'data:image/png;base64,manual1',
      type: 'manual',
      isSaved: false
    });
    expect(result.current.images[1]).toMatchObject({
      url: 'data:image/png;base64,manual2',
      type: 'manual',
      isSaved: false
    });
  });

  it('manages edit prompt versions and persists selection to localStorage', async () => {
    let capturedParams = null;
    const versions = [
      { version: 'v1', template: 't1', lineTemplate: 'l1' },
      { version: 'v2', template: 't2', lineTemplate: 'l2' }
    ];
    const fakeListingRepository = {
      getEditPromptVersions: jest.fn().mockResolvedValue({ versions }),
      generateImages: async (params: any) => {
        capturedParams = params;
        return { images: [] };
      }
    };
    
    // Pre-set localStorage
    localStorage.setItem('lastEditPromptVersion', 'v2');
    
    const { result, rerender } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    // Wait for useEffect
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.editPromptVersions).toEqual(versions);
    expect(result.current.selectedEditPromptVersion).toBe('v2'); // Loaded from localStorage

    act(() => {
      result.current.setSelectedEditPromptVersion('v1');
    });

    expect(localStorage.getItem('lastEditPromptVersion')).toBe('v1');

    await act(async () => {
      await result.current.generateListing({ editSpecifications: [{ field: 'Name', value: 'Test' }] });
    });

    expect(capturedParams).toMatchObject({
      editPromptTemplate: 't1',
      editPromptLineTemplate: 'l1'
    });
  });

  it('saves a new edit prompt version', async () => {
    const versions = [{ version: 'v1', template: 't1', lineTemplate: 'l1' }];
    const newVersion = { version: 'v2', template: 't2', lineTemplate: 'l2' };
    const fakeListingRepository = {
      getEditPromptVersions: jest.fn().mockResolvedValue({ versions }),
      saveEditPromptVersion: jest.fn().mockResolvedValue({ version: newVersion })
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.saveEditPromptVersion(newVersion);
    });

    expect(fakeListingRepository.saveEditPromptVersion).toHaveBeenCalledWith(newVersion);
    expect(result.current.editPromptVersions).toContainEqual(newVersion);
    expect(result.current.selectedEditPromptVersion).toBe('v2');
  });

  it('removes an edit prompt version', async () => {
    const versions = [
      { version: 'v1', template: 't1', lineTemplate: 'l1' },
      { version: 'v2', template: 't2', lineTemplate: 'l2' }
    ];
    const fakeListingRepository = {
      getEditPromptVersions: jest.fn().mockResolvedValue({ versions }),
      removeEditPromptVersion: jest.fn().mockResolvedValue({ success: true })
    };
    
    const { result } = renderHook(() => useListingGeneration(fakeListingRepository));
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    act(() => {
      result.current.setSelectedEditPromptVersion('v2');
    });

    await act(async () => {
      await result.current.removeEditPromptVersion('v2');
    });

    expect(fakeListingRepository.removeEditPromptVersion).toHaveBeenCalledWith('v2');
    expect(result.current.editPromptVersions).toHaveLength(1);
    expect(result.current.editPromptVersions[0].version).toBe('v1');
    expect(result.current.selectedEditPromptVersion).toBe('v1');
  });
});
