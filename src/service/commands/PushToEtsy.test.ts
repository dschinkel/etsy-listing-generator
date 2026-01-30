import { createPushToEtsy } from './PushToEtsy';

describe('Push To Etsy', () => {
  it('create listing', async () => {
    const fakeEtsyRepository = {
      createListing: jest.fn().mockResolvedValue({ listing_id: '123' }),
      uploadImage: jest.fn().mockResolvedValue({ success: true })
    };

    const pushToEtsy = createPushToEtsy(fakeEtsyRepository);

    const listingData = {
      title: 'Test Etsy Listing',
      description: 'Test Description',
      price: '19.99',
      quantity: 1,
      shop_id: '12345',
      images: ['/src/assets/generated-images/test.png']
    };

    const result = await pushToEtsy.execute(listingData);

    expect(fakeEtsyRepository.createListing).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Test Etsy Listing',
      shop_id: '12345'
    }));
    expect(fakeEtsyRepository.uploadImage).toHaveBeenCalledWith('12345', '123', '/src/assets/generated-images/test.png');
    expect(result.url).toBe('https://www.etsy.com/listing/123');
  });
});
