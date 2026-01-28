import { createGenerateListingImages } from '../commands/GenerateListingImages';
import { createGetSystemPromptPreview } from '../commands/GetSystemPromptPreview';
import { createListingRepository } from '../repositories/ListingRepository';
import { createGeminiImageGenerator } from '../data/GeminiImageGenerator';

export const createListingController = () => {
  const dataLayer = createGeminiImageGenerator();
  const repository = createListingRepository(dataLayer);
  const generateListingImages = createGenerateListingImages(repository);
  const getSystemPromptPreview = createGetSystemPromptPreview(repository);

  const generate = async (ctx: any) => {
    try {
      const request = ctx.request.body;
      const result = await generateListingImages.execute(request);
      ctx.body = result;
      ctx.status = 200;
    } catch (error: any) {
      console.error('Error in generate:', error);
      const request = ctx.request.body;
      const preview = repository.getPromptPreview(request);
      
      ctx.status = error.status || 500;
      ctx.body = { 
        error: error.message || 'Internal Server Error',
        systemPrompt: error.systemPrompt || preview.systemPrompt,
        retryable: !!error.retryable,
        nextModel: error.nextModel
      };
    }
  };

  const getPromptPreview = async (ctx: any) => {
    try {
      const request = ctx.request.body;
      const result = await getSystemPromptPreview.execute(request);
      ctx.body = result;
      ctx.status = 200;
    } catch (error: any) {
      console.error('Error in getPromptPreview:', error);
      ctx.status = 500;
      ctx.body = { error: error.message || 'Internal Server Error' };
    }
  };

  return { generate, getPromptPreview };
};
