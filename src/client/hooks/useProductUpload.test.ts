import { renderHook, act, waitFor } from '@testing-library/react';
import { useProductUpload } from './useProductUpload';

describe('useProductUpload', () => {
  const mockRepository = {
    getTemplates: jest.fn().mockResolvedValue({ templates: [] }),
    saveTemplate: jest.fn().mockResolvedValue({ template: {} }),
    getArchivedUploads: jest.fn().mockResolvedValue({ images: [] })
  };

  it('initializes with default values', () => {
    const { result } = renderHook(() => useProductUpload(mockRepository));
    expect(result.current.productImages).toEqual([]);
    expect(result.current.lifestyleShotsCount).toBe(0);
    expect(result.current.templates).toEqual([]);
    expect(result.current.archivedUploads).toEqual([]);
  });

  it('loads archived uploads on initialization', async () => {
    const images = ['archived1.png', 'archived2.png'];
    mockRepository.getArchivedUploads.mockResolvedValueOnce({ images });

    const { result } = renderHook(() => useProductUpload(mockRepository));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.archivedUploads).toEqual(images);
    expect(mockRepository.getArchivedUploads).toHaveBeenCalled();
  });

  it('allows uploading up to 2 reference images', async () => {
    const { result } = renderHook(() => useProductUpload(mockRepository));
    const fakeImage1 = 'data:image/png;base64,image1';
    const fakeImage2 = 'data:image/png;base64,image2';
    const fakeImage3 = 'data:image/png;base64,image3';

    let currentImage = fakeImage1;
    const mockReader = {
      readAsDataURL: jest.fn(function(this: any) {
        this.onloadend();
      }),
      get result() { return currentImage; }
    };
    jest.spyOn(global, 'FileReader').mockImplementation(() => mockReader as any);

    const file1 = new File([''], 'test1.png', { type: 'image/png' });
    const file2 = new File([''], 'test2.png', { type: 'image/png' });
    const file3 = new File([''], 'test3.png', { type: 'image/png' });

    await act(async () => {
      currentImage = fakeImage1;
      result.current.handleUpload({ target: { files: [file1] } } as any);
    });
    expect(result.current.productImages).toEqual([fakeImage1]);

    await act(async () => {
      currentImage = fakeImage2;
      result.current.handleUpload({ target: { files: [file2] } } as any);
    });
    expect(result.current.productImages).toEqual([fakeImage1, fakeImage2]);

    await act(async () => {
      currentImage = fakeImage3;
      result.current.handleUpload({ target: { files: [file3] } } as any);
    });
    // Should still be 2 images
    expect(result.current.productImages).toEqual([fakeImage1, fakeImage2]);

    (global.FileReader as jest.Mock).mockRestore();
  });

  it('loads templates on initialization', async () => {
    const templates = [{ name: 'Test', text: 'Test text' }];
    mockRepository.getTemplates.mockResolvedValueOnce({ templates });

    const { result } = renderHook(() => useProductUpload(mockRepository));

    // Wait for useEffect to trigger fetch
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.templates).toEqual(templates);
    expect(mockRepository.getTemplates).toHaveBeenCalled();
  });

  it('saves a new template', async () => {
    const newTemplate = { name: 'Kitchen', text: 'In a kitchen' };
    mockRepository.saveTemplate.mockResolvedValueOnce({ template: newTemplate });
    
    const { result } = renderHook(() => useProductUpload(mockRepository));

    await act(async () => {
      await result.current.saveContextTemplate('Kitchen', 'In a kitchen');
    });

    expect(mockRepository.saveTemplate).toHaveBeenCalledWith(newTemplate);
    expect(result.current.templates).toContainEqual(newTemplate);
  });

  it('removes a template', async () => {
    const templates = [{ name: 'ToRemove', text: 'Text' }];
    mockRepository.getTemplates.mockResolvedValueOnce({ templates });
    const mockRemoveTemplate = jest.fn().mockResolvedValue({ success: true });
    const repositoryWithRemove = { ...mockRepository, removeTemplate: mockRemoveTemplate };

    const { result } = renderHook(() => useProductUpload(repositoryWithRemove));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.templates).toEqual(templates);

    await act(async () => {
      await result.current.removeContextTemplate('ToRemove');
    });

    expect(mockRemoveTemplate).toHaveBeenCalledWith('ToRemove');
    expect(result.current.templates).toEqual([]);
  });

  it('is not ready to generate without product images', () => {
    const { result } = renderHook(() => useProductUpload(mockRepository));
    
    act(() => {
      result.current.handleLifestyleShotsChange({ target: { value: '1' } } as any);
    });

    expect(result.current.productImages).toEqual([]);
    expect(result.current.lifestyleShotsCount).toBe(1);
    expect((result.current as any).isReadyToGenerate).toBe(false);
  });

  it('is ready to generate when product images and shots are present', async () => {
    const { result } = renderHook(() => useProductUpload(mockRepository));
    
    // Use a small data URL to simulate an image
    const fakeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    // Mock FileReader to trigger onload immediately with our fake image
    const mockReader = {
      readAsDataURL: jest.fn(function(this: any) {
        this.onloadend();
      }),
      get result() { return fakeImage; }
    };
    jest.spyOn(global, 'FileReader').mockImplementation(() => mockReader as any);

    const file = new File([''], 'test.png', { type: 'image/png' });
    
    await act(async () => {
      result.current.handleLifestyleShotsChange({ target: { value: '1' } } as any);
      result.current.handleUpload({ target: { files: [file] } } as any);
    });

    expect(result.current.productImages[0]).toBe(fakeImage);
    expect(result.current.isReadyToGenerate).toBe(true);

    (global.FileReader as jest.Mock).mockRestore();
  });

  it('persists themed environment shot selection', () => {
    const { result } = renderHook(() => useProductUpload(mockRepository));
    
    act(() => {
      result.current.handleThemedEnvironmentShotsChange({ target: { value: '2' } } as any);
    });

    expect(result.current.themedEnvironmentShotsCount).toBe(2);

    act(() => {
      result.current.handleThemedEnvironmentCustomContextChange('Realistic thematic setting');
    });

    expect(result.current.themedEnvironmentCustomContext).toBe('Realistic thematic setting');
    expect(result.current.themedEnvironmentShotsCount).toBe(2); // Should remain 2, not 1
  });

  it('allows removing an individual product image', async () => {
    const { result } = renderHook(() => useProductUpload(mockRepository));
    const fakeImage1 = 'data:image/png;base64,image1';
    const fakeImage2 = 'data:image/png;base64,image2';

    let currentImage = fakeImage1;
    const mockReader = {
      readAsDataURL: jest.fn(function(this: any) {
        this.onloadend();
      }),
      get result() { return currentImage; }
    };
    jest.spyOn(global, 'FileReader').mockImplementation(() => mockReader as any);

    const file1 = new File([''], 'test1.png', { type: 'image/png' });
    const file2 = new File([''], 'test2.png', { type: 'image/png' });

    await act(async () => {
      currentImage = fakeImage1;
      result.current.handleUpload({ target: { files: [file1] } } as any);
      currentImage = fakeImage2;
      result.current.handleUpload({ target: { files: [file2] } } as any);
    });

    expect(result.current.productImages).toEqual([fakeImage1, fakeImage2]);

    act(() => {
      result.current.handleRemoveProductImage(0);
    });

    expect(result.current.productImages).toEqual([fakeImage2]);

    (global.FileReader as jest.Mock).mockRestore();
  });

  it('resets shot counts', () => {
    const { result } = renderHook(() => useProductUpload(mockRepository));
    
    act(() => {
      result.current.handleLifestyleShotsChange({ target: { value: '3' } } as any);
      result.current.handleHeroShotsChange({ target: { value: '2' } } as any);
    });

    expect(result.current.lifestyleShotsCount).toBe(3);
    expect(result.current.heroShotsCount).toBe(2);

    act(() => {
      (result.current as any).resetCounts();
    });

    expect(result.current.lifestyleShotsCount).toBe(0);
    expect(result.current.heroShotsCount).toBe(0);
  });

  it('deletes product image from server when removed', async () => {
    const mockDeleteImage = jest.fn().mockResolvedValue(true);
    const repository = { ...mockRepository, deleteImage: mockDeleteImage };
    const { result } = renderHook(() => useProductUpload(repository));
    
    const serverImageUrl = '/src/assets/generated-images/product.png';
    
    await act(async () => {
      const mockReader = {
        readAsDataURL: jest.fn(function(this: any) {
          this.onloadend();
        }),
        get result() { return serverImageUrl; }
      };
      const spy = jest.spyOn(global, 'FileReader').mockImplementation(() => mockReader as any);
      
      const file = new File([''], 'test.png', { type: 'image/png' });
      result.current.handleUpload({ target: { files: [file] } } as any);
      spy.mockRestore();
    });

    expect(result.current.productImages[0]).toBe(serverImageUrl);

    await act(async () => {
      result.current.handleRemoveProductImage(0);
    });

    expect(result.current.productImages).toEqual([]);
    expect(mockDeleteImage).toHaveBeenCalledWith(serverImageUrl);
  });

  it('archives an individual product image', async () => {
    const mockArchiveImages = jest.fn().mockResolvedValue({ success: true });
    const repository = { ...mockRepository, archiveImages: mockArchiveImages };
    const { result } = renderHook(() => useProductUpload(repository));
    
    const fakeImage = 'data:image/png;base64,image1';
    
    await act(async () => {
      const mockReader = {
        readAsDataURL: jest.fn(function(this: any) {
          this.onloadend();
        }),
        get result() { return fakeImage; }
      };
      jest.spyOn(global, 'FileReader').mockImplementation(() => mockReader as any);
      const file = new File([''], 'test.png', { type: 'image/png' });
      result.current.handleUpload({ target: { files: [file] } } as any);
      (global.FileReader as jest.Mock).mockRestore();
    });

    await act(async () => {
      await result.current.archiveProductImage(0);
    });

    expect(mockArchiveImages).toHaveBeenCalledWith([fakeImage], 'uploads');
  });
});
