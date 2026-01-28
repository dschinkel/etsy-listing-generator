import { renderHook, act } from '@testing-library/react';
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
