import { createGenerateListingImages } from '../commands/GenerateListingImages';
import { createListingRepository } from '../repositories/ListingRepository';
import { createGeminiImageGenerator } from '../data/GeminiImageGenerator';

export const createListingController = () => {
  const dataLayer = createGeminiImageGenerator();
  const repository = createListingRepository(dataLayer);
  const generateListingImages = createGenerateListingImages(repository);

  const generate = async (ctx: any) => {
    const request = ctx.request.body;
    const result = await generateListingImages.execute(request);
    ctx.body = result;
    ctx.status = 200;
  };

  return { generate };
};
