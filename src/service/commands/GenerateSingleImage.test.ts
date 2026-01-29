import { createGenerateSingleImage } from './GenerateSingleImage';

describe('Generate Single Image Command', () => {
  it('orchestrates generation of a single image', async () => {
    const fakeRepository = {
      generateSingleImage: jest.fn().mockResolvedValue({ 
        image: { url: 'new.png', type: 'lifestyle' } 
      })
    };
    const command = createGenerateSingleImage(fakeRepository);
    const request = { 
      type: 'lifestyle', 
      customContext: 'Better lighting' 
    };
    
    const result = await command.execute(request);
    
    expect(result).toEqual({ image: { url: 'new.png', type: 'lifestyle' } });
    expect(fakeRepository.generateSingleImage).toHaveBeenCalledWith(request);
  });
});
