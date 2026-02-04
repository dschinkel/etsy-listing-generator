import { createGenerateListingImages } from '../commands/GenerateListingImages';
import { createGenerateSingleImage } from '../commands/GenerateSingleImage';
import { createArchiveListingImages } from '../commands/ArchiveListingImages';
import { createGetSystemPromptPreview } from '../commands/GetSystemPromptPreview';
import { createGetSystemPromptVersions } from '../commands/GetSystemPromptVersions';
import { createGetEditPromptVersions } from '../commands/GetEditPromptVersions';
import { createSaveEditPromptVersion } from '../commands/SaveEditPromptVersion';
import { createRemoveEditPromptVersion } from '../commands/RemoveEditPromptVersion';
import { createGetContextTemplates } from '../commands/GetContextTemplates';
import { createSaveContextTemplate } from '../commands/SaveContextTemplate';
import { createRemoveContextTemplate } from '../commands/RemoveContextTemplate';
import { createPushToEtsy } from '../commands/PushToEtsy';
import { createSaveListingImage } from '../commands/SaveListingImage';
import { createListingRepository } from '../repositories/ListingRepository';
import { createContextTemplateRepository } from '../repositories/ContextTemplateRepository';
import { createSystemPromptRepository } from '../repositories/SystemPromptRepository';
import { createEditPromptRepository } from '../repositories/EditPromptRepository';
import { createEtsyRepository } from '../repositories/EtsyRepository';
import { createGeminiImageGenerator } from '../data/GeminiImageGenerator';
import { deleteImageFromAssets } from '../lib/assetManager';
import * as path from 'path';

export const createListingController = () => {
  const dataLayer = createGeminiImageGenerator();
  const repository = createListingRepository(dataLayer);
  
  // Mock Etsy data layer for now
  const etsyDataLayer = {
    createListing: async (data: any) => ({ listing_id: 'fake-id-' + Date.now() }),
    uploadImage: async (shopId: string, listingId: string, imageUrl: string) => ({ success: true })
  };
  const etsyRepository = createEtsyRepository(etsyDataLayer);
  
  const templateDbPath = process.env.TEMPLATE_DB_PATH || path.join(process.cwd(), 'src', 'db', 'context-templates.json');
  const templateRepository = createContextTemplateRepository(templateDbPath);

  const promptVersionsDbPath = process.env.PROMPT_VERSIONS_DB_PATH || path.join(process.cwd(), 'src', 'db', 'system-prompt-versions.json');
  const systemPromptRepository = createSystemPromptRepository(promptVersionsDbPath);

  const editPromptVersionsDbPath = process.env.EDIT_PROMPT_VERSIONS_DB_PATH || path.join(process.cwd(), 'src', 'db', 'edit-prompt-versions.json');
  const editPromptRepository = createEditPromptRepository(editPromptVersionsDbPath);

  const generateListingImages = createGenerateListingImages(repository);
  const getSystemPromptPreview = createGetSystemPromptPreview(repository);
  const getSystemPromptVersions = createGetSystemPromptVersions(systemPromptRepository);
  const getEditPromptVersions = createGetEditPromptVersions(editPromptRepository);
  const saveEditPromptVersion = createSaveEditPromptVersion(editPromptRepository);
  const removeEditPromptVersion = createRemoveEditPromptVersion(editPromptRepository);
  const getContextTemplates = createGetContextTemplates(templateRepository);
  const saveContextTemplate = createSaveContextTemplate(templateRepository);
  const removeContextTemplate = createRemoveContextTemplate(templateRepository);
  const generateSingleImage = createGenerateSingleImage(repository);
  const archiveListingImages = createArchiveListingImages(repository);
  const saveListingImage = createSaveListingImage(repository);
  const pushToEtsy = createPushToEtsy(etsyRepository);

  const generate = async (ctx: any) => {
    try {
      const request = ctx.request.body;
      const isZeroCount = !request.lifestyleCount && !request.heroCount && !request.closeUpsCount && 
                          !request.flatLayCount && !request.macroCount && !request.contextualCount && 
                          !request.themedEnvironmentCount && (!request.editSpecifications || request.editSpecifications.length === 0);
      
      if (isZeroCount) {
        const preview = repository.getPromptPreview(request);
        ctx.body = { images: [], systemPrompt: preview.systemPrompt };
        ctx.status = 200;
        return;
      }

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

  const generateSingle = async (ctx: any) => {
    try {
      const request = ctx.request.body;
      const result = await generateSingleImage.execute(request);
      ctx.body = result;
      ctx.status = 200;
    } catch (error: any) {
      console.error('Error in generateSingle:', error);
      ctx.status = error.status || 500;
      ctx.body = { error: error.message || 'Internal Server Error' };
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

  const getPromptVersions = async (ctx: any) => {
    try {
      const versions = await getSystemPromptVersions.execute();
      ctx.body = { versions };
      ctx.status = 200;
    } catch (error: any) {
      console.error('Error in getPromptVersions:', error);
      ctx.status = 500;
      ctx.body = { error: error.message || 'Internal Server Error' };
    }
  };

  const getEditPromptVersionsHandler = async (ctx: any) => {
    try {
      const versions = await getEditPromptVersions.execute();
      ctx.body = { versions };
      ctx.status = 200;
    } catch (error: any) {
      console.error('Error in getEditPromptVersions:', error);
      ctx.status = 500;
      ctx.body = { error: error.message || 'Internal Server Error' };
    }
  };

  const saveEditPromptVersionHandler = async (ctx: any) => {
    try {
      const version = ctx.request.body;
      await saveEditPromptVersion.execute(version);
      ctx.body = { version };
      ctx.status = 201;
    } catch (error: any) {
      console.error('Error in saveEditPromptVersion:', error);
      ctx.status = 500;
      ctx.body = { error: error.message || 'Internal Server Error' };
    }
  };

  const removeEditPromptVersionHandler = async (ctx: any) => {
    try {
      const { name } = ctx.params;
      await removeEditPromptVersion.execute(name);
      ctx.status = 200;
      ctx.body = { success: true };
    } catch (error: any) {
      console.error('Error in removeEditPromptVersion:', error);
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

  const removeTemplate = async (ctx: any) => {
    try {
      const { name } = ctx.params;
      await removeContextTemplate.execute(name);
      ctx.status = 200;
      ctx.body = { success: true };
    } catch (error: any) {
      console.error('Error in removeTemplate:', error);
      ctx.status = 500;
      ctx.body = { error: error.message || 'Internal Server Error' };
    }
  };

  const deleteImage = async (ctx: any) => {
    try {
      const { url } = ctx.request.body;
      if (!url) {
        ctx.status = 400;
        ctx.body = { error: 'Image URL is required' };
        return;
      }
      await deleteImageFromAssets(url);
      ctx.status = 200;
      ctx.body = { success: true };
    } catch (error: any) {
      console.error('Error in deleteImage:', error);
      ctx.status = 500;
      ctx.body = { error: error.message || 'Internal Server Error' };
    }
  };

  const archive = async (ctx: any) => {
    try {
      const request = ctx.request.body;
      const result = await archiveListingImages.execute(request);
      ctx.body = result;
      ctx.status = 200;
    } catch (error: any) {
      console.error('Error in archive:', error);
      ctx.status = error.status || 500;
      ctx.body = { error: error.message || 'Internal Server Error' };
    }
  };

  const saveGeneratedImage = async (ctx: any) => {
    try {
      const request = ctx.request.body;
      const result = await saveListingImage.execute(request);
      ctx.body = result;
      ctx.status = 200;
    } catch (error: any) {
      console.error('Error in saveGeneratedImage:', error);
      ctx.status = error.status || 500;
      ctx.body = { error: error.message || 'Internal Server Error' };
    }
  };

  const getArchivedUploads = async (ctx: any) => {
    try {
      const images = await repository.getArchivedUploads();
      ctx.body = { images };
      ctx.status = 200;
    } catch (error: any) {
      console.error('Error in getArchivedUploads:', error);
      ctx.status = 500;
      ctx.body = { error: error.message || 'Internal Server Error' };
    }
  };

  const getShopId = async (ctx: any) => {
    try {
      ctx.body = { shop_id: process.env.ETSY_SHOP_ID || '' };
      ctx.status = 200;
    } catch (error: any) {
      console.error('Error in getShopId:', error);
      ctx.status = 500;
      ctx.body = { error: error.message || 'Internal Server Error' };
    }
  };

  const publish = async (ctx: any) => {
    try {
      const listingData = ctx.request.body;
      const result = await pushToEtsy.execute(listingData);
      ctx.status = 201;
      ctx.body = result;
    } catch (error: any) {
      console.error('Error in publish:', error);
      ctx.status = error.status || 500;
      ctx.body = { error: error.message || 'Internal Server Error' };
    }
  };

  return { generate, generateSingle, getPromptPreview, getPromptVersions, getEditPromptVersions: getEditPromptVersionsHandler, saveEditPromptVersion: saveEditPromptVersionHandler, removeEditPromptVersion: removeEditPromptVersionHandler, getTemplates, saveTemplate, removeTemplate, deleteImage, archive, saveGeneratedImage, getArchivedUploads, getShopId, publish };
};
