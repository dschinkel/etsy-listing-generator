import { createListingRepository } from './ListingRepository';

describe('Listing Repository (Client)', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('fetches templates', async () => {
    const templates = [{ name: 'Test', text: 'Test text' }];
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ templates }),
    });

    const repository = createListingRepository();
    const result = await repository.getTemplates();

    expect(result).toEqual({ templates });
    expect(global.fetch).toHaveBeenCalledWith('/listings/templates', expect.objectContaining({
      method: 'GET'
    }));
  });

  it('saves a template', async () => {
    const template = { name: 'New', text: 'New text' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ template }),
    });

    const repository = createListingRepository();
    const result = await repository.saveTemplate(template);

    expect(result).toEqual({ template });
    expect(global.fetch).toHaveBeenCalledWith('/listings/templates', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(template)
    }));
  });

  it('removes a template', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    const repository = createListingRepository();
    await repository.removeTemplate('ToRemove');

    expect(global.fetch).toHaveBeenCalledWith('/listings/templates/ToRemove', expect.objectContaining({
      method: 'DELETE'
    }));
  });

  it('requests themed environment images', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ images: [] }),
    });

    const repository = createListingRepository();
    const params = {
      themedEnvironmentCount: 1,
      themedEnvironmentBackground: 'data:image/png;base64,bg',
      themedEnvironmentCustomContext: 'In a forest'
    };

    await repository.generateImages(params);

    expect(global.fetch).toHaveBeenCalledWith('/listings/generate', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('"themedEnvironmentCount":1')
    }));
    expect(global.fetch).toHaveBeenCalledWith('/listings/generate', expect.objectContaining({
      body: expect.stringContaining('"themedEnvironmentBackground":"data:image/png;base64,bg"')
    }));
    expect(global.fetch).toHaveBeenCalledWith('/listings/generate', expect.objectContaining({
      body: expect.stringContaining('"themedEnvironmentCustomContext":"In a forest"')
    }));
  });

  it('requests images with multiple product reference images', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ images: [] }),
    });

    const repository = createListingRepository();
    const params = {
      lifestyleCount: 1,
      productImages: ['data:image/png;base64,image1', 'data:image/png;base64,image2']
    };

    await repository.generateImages(params);

    expect(global.fetch).toHaveBeenCalledWith('/listings/generate', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(params)
    }));
  });

  it('requests single image regeneration with multiple product images', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ image: { url: 'new.png', type: 'lifestyle' } }),
    });

    const repository = createListingRepository();
    const params = {
      type: 'lifestyle',
      customContext: 'Better lighting',
      productImages: ['data:image/png;base64,prod1', 'data:image/png;base64,prod2']
    };

    const result = await repository.generateSingleImage(params);

    expect(result).toEqual({ image: { url: 'new.png', type: 'lifestyle' } });
    expect(global.fetch).toHaveBeenCalledWith('/listings/generate/single', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(params)
    }));
  });
});
