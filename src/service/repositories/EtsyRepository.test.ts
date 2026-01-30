import { createEtsyRepository } from './EtsyRepository';

describe('Etsy Repository', () => {
  it('publish listing', async () => {
    const fakeDataLayer = {
      createListing: jest.fn().mockResolvedValue({ listing_id: '123' }),
      uploadImage: jest.fn().mockResolvedValue({ success: true })
    };

    const repository = createEtsyRepository(fakeDataLayer);

    const listingData = { title: 'Test' };
    const result = await repository.createListing(listingData);

    expect(fakeDataLayer.createListing).toHaveBeenCalledWith(listingData);
    expect(result.listing_id).toBe('123');

    await repository.uploadImage('shop1', '123', 'img.png');
    expect(fakeDataLayer.uploadImage).toHaveBeenCalledWith('shop1', '123', 'img.png');
  });
});
