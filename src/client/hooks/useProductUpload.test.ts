import { renderHook, act, waitFor } from '@testing-library/react';
import { useProductUpload } from './useProductUpload';

describe('useProductUpload', () => {
  const mockRepository = {
    getTemplates: jest.fn().mockResolvedValue({ templates: [] }),
    saveTemplate: jest.fn().mockResolvedValue({ template: {} })
  };

  it('initializes with default values', () => {
    const { result } = renderHook(() => useProductUpload(mockRepository));
    expect(result.current.productImage).toBeNull();
    expect(result.current.lifestyleShotsCount).toBe(0);
    expect(result.current.templates).toEqual([]);
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

  it('is not ready to generate without product image', () => {
    const { result } = renderHook(() => useProductUpload(mockRepository));
    
    act(() => {
      result.current.handleLifestyleShotsChange({ target: { value: '1' } } as any);
    });

    expect(result.current.productImage).toBeNull();
    expect(result.current.lifestyleShotsCount).toBe(1);
    expect((result.current as any).isReadyToGenerate).toBe(false);

    // Now upload image (Simulated)
    act(() => {
      // We manually trigger handleUpload or directly set the state if we were testing internal state,
      // but since we want to test behavior, let's see if we can use handleUpload with a mock file.
      const file = new File([''], 'test.png', { type: 'image/png' });
      // handleUpload uses FileReader which is async, might be tricky in act() without waitFor.
      // Alternatively, we can check that it returns true when productImage IS set.
    });
  });

  it('is ready to generate when product image and shots are present', async () => {
    const { result } = renderHook(() => useProductUpload(mockRepository));
    
    // Use a small data URL to simulate an image
    const fakeImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    // We can't easily mock FileReader internals, so we'll test the derived state 
    // by assuming if productImage is set, isReadyToGenerate works.
    // To do this headlessly we can either:
    // 1. Mock handleUpload to set the state immediately
    // 2. Use a different way to set the state (not possible if not exposed)
    // 3. Just trust the logic we wrote which is pure: totalShots > 0 && productImage !== null
    
    // Let's try to mock handleUpload for this test
    const realHandleUpload = result.current.handleUpload;
    result.current.handleUpload = jest.fn(); // This won't work because it's a value from the hook.

    // Better: let's just use the current handleUpload but mock FileReader or wait for it.
    const file = new File([''], 'test.png', { type: 'image/png' });
    
    await act(async () => {
      result.current.handleLifestyleShotsChange({ target: { value: '1' } } as any);
      result.current.handleUpload({ target: { files: [file] } } as any);
    });

    // Since FileReader is async, we wait.
    await waitFor(() => {
      expect(result.current.productImage).not.toBeNull();
      expect(result.current.isReadyToGenerate).toBe(true);
    });
  });

  it('persists themed environment shot selection', () => {
    const { result } = renderHook(() => useProductUpload(mockRepository));
    
    act(() => {
      result.current.handleThemedEnvironmentShotsChange({ target: { value: '2' } } as any);
      result.current.handleThemedEnvironmentCustomContextChange('Realistic thematic setting');
    });

    expect(result.current.themedEnvironmentShotsCount).toBe(2);
    expect(result.current.themedEnvironmentCustomContext).toBe('Realistic thematic setting');
  });
});
