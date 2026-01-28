import { createListingRepository } from './ListingRepository';

describe('Listing Repository Fallback', () => {
  it('retries with next model when primary fails with 503', async () => {
    const mockDataLayer = {
      generateImage: jest.fn()
        .mockRejectedValueOnce({ status: 503, message: 'Overloaded' })
        .mockResolvedValueOnce({ imageUrl: 'http://image1.com', systemInstruction: 'imagen prompt' }),
      getSystemPrompt: jest.fn().mockReturnValue('mock prompt')
    };
    
    const repository = createListingRepository(mockDataLayer);
    const result = await repository.generateImages({ lifestyleCount: 1 });
    
    expect(mockDataLayer.generateImage).toHaveBeenCalledTimes(2);
    expect(mockDataLayer.generateImage).toHaveBeenNthCalledWith(1, expect.objectContaining({ model: 'gemini-3-pro-image-preview' }));
    expect(mockDataLayer.generateImage).toHaveBeenNthCalledWith(2, expect.objectContaining({ model: 'imagen-4.0-generate-001' }));
    expect(result.images).toEqual([{ url: 'http://image1.com', type: 'lifestyle' }]);
    expect(result.model).toBe('imagen-4.0-generate-001');
  });

  it('retries through all levels if needed', async () => {
    const mockDataLayer = {
      generateImage: jest.fn()
        .mockRejectedValueOnce(new Error('503 Service Unavailable'))
        .mockRejectedValueOnce(new Error('canceled'))
        .mockResolvedValueOnce({ imageUrl: 'http://image_gpt.com', systemInstruction: 'gpt prompt' }),
      getSystemPrompt: jest.fn().mockReturnValue('mock prompt')
    };
    
    const repository = createListingRepository(mockDataLayer);
    const result = await repository.generateImages({ lifestyleCount: 1 });
    
    expect(mockDataLayer.generateImage).toHaveBeenCalledTimes(3);
    expect(mockDataLayer.generateImage).toHaveBeenNthCalledWith(1, expect.objectContaining({ model: 'gemini-3-pro-image-preview' }));
    expect(mockDataLayer.generateImage).toHaveBeenNthCalledWith(2, expect.objectContaining({ model: 'imagen-4.0-generate-001' }));
    expect(mockDataLayer.generateImage).toHaveBeenNthCalledWith(3, expect.objectContaining({ model: 'gpt-image-1.5' }));
    expect(result.model).toBe('gpt-image-1.5');
  });

  it('throws the last error if all models fail', async () => {
    const mockDataLayer = {
      generateImage: jest.fn()
        .mockRejectedValue(new Error('overloaded')),
      getSystemPrompt: jest.fn().mockReturnValue('mock prompt')
    };
    
    const repository = createListingRepository(mockDataLayer);
    
    await expect(repository.generateImages({ lifestyleCount: 1 }))
      .rejects.toThrow('overloaded');
    
    expect(mockDataLayer.generateImage).toHaveBeenCalledTimes(3);
  });

  it('retries when error status is "canceled"', async () => {
    const mockDataLayer = {
      generateImage: jest.fn()
        .mockRejectedValueOnce({ status: 'canceled', message: 'Request aborted' })
        .mockResolvedValueOnce({ imageUrl: 'http://image_after_cancel.com', systemInstruction: 'recovered prompt' }),
      getSystemPrompt: jest.fn().mockReturnValue('mock prompt')
    };
    
    const repository = createListingRepository(mockDataLayer);
    const result = await repository.generateImages({ lifestyleCount: 1 });
    
    expect(mockDataLayer.generateImage).toHaveBeenCalledTimes(2);
    expect(result.images).toEqual([{ url: 'http://image_after_cancel.com', type: 'lifestyle' }]);
  });
});
