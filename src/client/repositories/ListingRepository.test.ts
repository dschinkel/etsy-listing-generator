import { createListingRepository } from './ListingRepository';

describe('Listing Repository (Client)', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('fetches templates from api', async () => {
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

  it('saves a template via api', async () => {
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
});
