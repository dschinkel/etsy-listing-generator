import { createGenerateSingleImage } from './GenerateSingleImage';

describe('Generate Single Image Command', () => {
  it('executes generation with multiple product reference images', async () => {
    let capturedRequest = null;
    const fakeRepository = {
      generateSingleImage: async (request: any) => {
        capturedRequest = request;
        return { image: { url: 'new.png', type: 'lifestyle' } };
      }
    };

    const command = createGenerateSingleImage(fakeRepository);
    const request = {
      type: 'lifestyle',
      productImages: ['image1', 'image2']
    };

    await command.execute(request as any);

    expect(capturedRequest).toEqual(expect.objectContaining({
      productImages: ['image1', 'image2']
    }));
  });
});
