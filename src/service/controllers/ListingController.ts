import { createGenerateListingImages } from '../commands/GenerateListingImages';
import { createGetSystemPromptPreview } from '../commands/GetSystemPromptPreview';
import { createGetContextTemplates } from '../commands/GetContextTemplates';
import { createSaveContextTemplate } from '../commands/SaveContextTemplate';
import { createListingRepository } from '../repositories/ListingRepository';
import { createContextTemplateRepository } from '../repositories/ContextTemplateRepository';
import { createGeminiImageGenerator } from '../data/GeminiImageGenerator';
import * as path from 'path';

export const createListingController = () => {
  const dataLayer = createGeminiImageGenerator();
  const repository = createListingRepository(dataLayer);
  
  const templateDbPath = path.join(process.cwd(), 'src', 'db', 'context-templates.json');
  const templateRepository = createContextTemplateRepository(templateDbPath);

  const generateListingImages = createGenerateListingImages(repository);
  const getSystemPromptPreview = createGetSystemPromptPreview(repository);
  const getContextTemplates = createGetContextTemplates(templateRepository);
  const saveContextTemplate = createSaveContextTemplate(templateRepository);

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

  const getTemplates = async (ctx: any) => {
    try {
      const templates = await getContextTemplates.execute();
      ctx.body = { templates };
      ctx.status = 200;
    } catch (error: any) {
      console.error('Error in getTemplates:', error);
      ctx.status = 500;
      ctx.body = { error: error.message || 'Internal Server Error' };
    }
  };

  const saveTemplate = async (ctx: any) => {
    try {
      const template = ctx.request.body;
      await saveContextTemplate.execute(template);
      ctx.body = { template };
      ctx.status = 201;
    } catch (error: any) {
      console.error('Error in saveTemplate:', error);
      ctx.status = 500;
      ctx.body = { error: error.message || 'Internal Server Error' };
    }
  };

  return { generate, getPromptPreview, getTemplates, saveTemplate };
};
