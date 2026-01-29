import { saveImageToAssets } from '../lib/assetManager';

export const createListingRepository = (dataLayer: any) => {
  const generateImages = async (params: { 
    lifestyleCount?: number, 
    heroCount?: number,
    closeUpsCount?: number,
    flatLayCount?: number,
    macroCount?: number,
    contextualCount?: number,
    themedEnvironmentCount?: number,
    productImage?: string,
    lifestyleBackground?: string,
    heroBackground?: string,
    closeUpsBackground?: string,
    flatLayBackground?: string,
    macroBackground?: string,
    contextualBackground?: string,
    themedEnvironmentBackground?: string,
    lifestyleCustomContext?: string,
    heroCustomContext?: string,
    closeUpsCustomContext?: string,
    flatLayCustomContext?: string,
    macroCustomContext?: string,
    contextualCustomContext?: string,
    themedEnvironmentCustomContext?: string,
    model?: string
  }) => {
    const fallbackModels = [
      'gemini-2.5-flash-image',
      'imagen-4.0-generate-001',
      'gemini-1.5-flash-latest'
    ];

    // If a specific model is requested that's not in our fallback list (unlikely given current UI),
    // we should still respect it but maybe not fallback from it unless it's the first one.
    // For now, we follow the established pattern.
    const initialModel = params.model || fallbackModels[0];
    const modelsToTry = fallbackModels.includes(initialModel) 
      ? fallbackModels.slice(fallbackModels.indexOf(initialModel))
      : [initialModel, ...fallbackModels];

    let lastError: any = null;
    let lastSystemPrompt = '';

    for (const model of modelsToTry) {
      try {
        console.log(`Attempting generation with model: ${model}`);
        const result = await internalGenerateImages({ ...params, model });
        return result;
      } catch (error: any) {
        lastError = error;
        if (error.systemPrompt) {
          lastSystemPrompt = error.systemPrompt;
        }

        const isRetryable = isRetryableError(error);

        const nextModel = modelsToTry[modelsToTry.indexOf(model) + 1];

        if (isRetryable && nextModel) {
          console.log(`Model ${model} failed with retryable error. Trying next model ${nextModel}...`);
          if ((params as any).noFallback) {
             const enhancedError: any = new Error(error.message);
             enhancedError.status = error.status;
             enhancedError.retryable = true;
             enhancedError.nextModel = nextModel;
             enhancedError.systemPrompt = lastSystemPrompt;
             throw enhancedError;
          }
          continue;
        }
        
        // Not retryable or last model failed
        if (lastSystemPrompt && !error.systemPrompt) {
          error.systemPrompt = lastSystemPrompt;
        }
        throw error;
      }
    }
    throw lastError;
  };

  const isRetryableError = (error: any) => {
    const statusStr = String(error.status || '');
    const status = parseInt(statusStr, 10);
    const message = String(error.message || error || '').toLowerCase();
    
    if (status >= 500 || status === 429) return true;
    if (statusStr.toLowerCase().includes('canceled')) return true;
    
    const retryablePhrases = [
      'overloaded', 
      'canceled', 
      'timeout', 
      'deadline exceeded', 
      'try again', 
      'service unavailable',
      'internal error'
    ];
    
    return retryablePhrases.some(phrase => message.includes(phrase));
  };

  const internalGenerateImages = async (params: { 
    lifestyleCount?: number, 
    heroCount?: number,
    closeUpsCount?: number,
    flatLayCount?: number,
    macroCount?: number,
    contextualCount?: number,
    themedEnvironmentCount?: number,
    productImage?: string,
    lifestyleBackground?: string,
    heroBackground?: string,
    closeUpsBackground?: string,
    flatLayBackground?: string,
    macroBackground?: string,
    contextualBackground?: string,
    themedEnvironmentBackground?: string,
    lifestyleCustomContext?: string,
    heroCustomContext?: string,
    closeUpsCustomContext?: string,
    flatLayCustomContext?: string,
    macroCustomContext?: string,
    contextualCustomContext?: string,
    themedEnvironmentCustomContext?: string,
    model?: string
  }) => {
    console.log('Generating images with params:', {
      lifestyle: params.lifestyleCount,
      hero: params.heroCount,
      closeUps: params.closeUpsCount,
      flatLay: params.flatLayCount,
      macro: params.macroCount,
      contextual: params.contextualCount,
      themedEnvironment: params.themedEnvironmentCount,
      model: params.model,
      hasProductImage: !!params.productImage
    });
    const images: { url: string; type: string }[] = [];
    const preview = getPromptPreview(params);
    let systemPrompt = preview.systemPrompt;
    
    const collectPrompt = (result: { systemInstruction: string }) => {
      if (result.systemInstruction) {
        if (!systemPrompt) {
          systemPrompt = result.systemInstruction;
        } else {
          // Check if we already have this instruction, ignoring the count difference
          // This prevents duplication when getPromptPreview uses total count 
          // but individual generations use count 1.
          const instructionBase = result.systemInstruction.replace(/Generate \d+ images?/, 'Generate {{COUNT}}');
          const systemPromptBase = systemPrompt.replace(/Generate \d+ images?/g, 'Generate {{COUNT}}');
          
          if (!systemPromptBase.includes(instructionBase)) {
            systemPrompt += '\n\n' + result.systemInstruction;
          }
        }
      }
    };

    await generateShotTypeImages('lifestyle', params.lifestyleCount, params.productImage, params.lifestyleBackground, images, collectPrompt, params.model, params.lifestyleCustomContext);
    await generateShotTypeImages('hero', params.heroCount, params.productImage, params.heroBackground, images, collectPrompt, params.model, params.heroCustomContext);
    await generateShotTypeImages('close-up', params.closeUpsCount, params.productImage, params.closeUpsBackground, images, collectPrompt, params.model, params.closeUpsCustomContext);
    await generateShotTypeImages('flat-lay', params.flatLayCount, params.productImage, params.flatLayBackground, images, collectPrompt, params.model, params.flatLayCustomContext);
    await generateShotTypeImages('macro', params.macroCount, params.productImage, params.macroBackground, images, collectPrompt, params.model, params.macroCustomContext);
    await generateShotTypeImages('contextual', params.contextualCount, params.productImage, params.contextualBackground, images, collectPrompt, params.model, params.contextualCustomContext);
    await generateShotTypeImages('themed-environment', params.themedEnvironmentCount, params.productImage, params.themedEnvironmentBackground, images, collectPrompt, params.model, params.themedEnvironmentCustomContext);

    return { images, systemPrompt, model: params.model };
  };

  const generateShotTypeImages = async (
    type: string, 
    count: number = 0, 
    productImage?: string, 
    background?: string, 
    images: { url: string; type: string }[] = [], 
    onResult?: (res: any) => void,
    model?: string,
    customContext?: string
  ) => {
    const runGeneration = async () => {
      let retries = 0;
      const maxRetries = 2;
      let success = false;
      
      while (!success && retries <= maxRetries) {
        try {
          const result = await dataLayer.generateImage({ 
            type,
            productImage,
            background,
            count: 1,
            model,
            customContext
          });
          const imageUrl = await saveImageToAssets(result.imageUrl, type);
          onResult?.({ ...result, imageUrl });
          ensureValidUrl(imageUrl);
          addGeneratedImage(images, imageUrl, type);
          success = true;
        } catch (error: any) {
          retries++;
          const status = error.status;
          if ((status === 429 || status === 503) && retries <= maxRetries) {
            console.log(`API overloaded/rate-limited (status ${status}). Retrying in ${retries * 5}s...`);
            await new Promise(resolve => setTimeout(resolve, retries * 5000));
            continue;
          }
          throw error;
        }
      }
    };

    const promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(runGeneration());
    }
    await Promise.all(promises);
  };

  const addGeneratedImage = (images: { url: string; type: string }[], url: string, type: string) => {
    images.push({ url, type });
  };

  const ensureValidUrl = (url: string) => {
    if (url.includes('generated-images.com')) {
      throw new Error(`Invalid image URL detected from data layer: ${url}`);
    }
  };

  const getPromptPreview = (params: { 
    lifestyleCount?: number, 
    heroCount?: number,
    closeUpsCount?: number,
    flatLayCount?: number,
    macroCount?: number,
    contextualCount?: number,
    themedEnvironmentCount?: number,
    lifestyleCustomContext?: string,
    heroCustomContext?: string,
    closeUpsCustomContext?: string,
    flatLayCustomContext?: string,
    macroCustomContext?: string,
    contextualCustomContext?: string,
    themedEnvironmentCustomContext?: string
  } = {}) => {
    let systemPrompt = '';
    const safeParams = params || {};
    const collect = (type: string, count: number, customContext?: string) => {
      if (count > 0) {
        const prompt = dataLayer.getSystemPrompt({ type, count, customContext });
        if (!systemPrompt) {
          systemPrompt = prompt;
        } else if (!systemPrompt.includes(prompt)) {
          systemPrompt += '\n\n' + prompt;
        }
      }
    };

    collect('lifestyle', safeParams.lifestyleCount || 0, safeParams.lifestyleCustomContext);
    collect('hero', safeParams.heroCount || 0, safeParams.heroCustomContext);
    collect('close-up', safeParams.closeUpsCount || 0, safeParams.closeUpsCustomContext);
    collect('flat-lay', safeParams.flatLayCount || 0, safeParams.flatLayCustomContext);
    collect('macro', safeParams.macroCount || 0, safeParams.macroCustomContext);
    collect('contextual', safeParams.contextualCount || 0, safeParams.contextualCustomContext);
    collect('themed-environment', safeParams.themedEnvironmentCount || 0, safeParams.themedEnvironmentCustomContext);

    if (!systemPrompt) {
      systemPrompt = dataLayer.getSystemPrompt({ type: 'hero', count: 1 });
    }

    return { systemPrompt };
  };

  const generateSingleImage = async (params: {
    type: string,
    customContext?: string,
    productImage?: string,
    background?: string,
    model?: string
  }) => {
    let image: { url: string; type: string } | null = null;
    
    await generateShotTypeImages(
      params.type, 
      1, 
      params.productImage, 
      params.background, 
      [], // We don't need the images array here, we'll capture it via onResult
      (res) => {
        image = { url: res.imageUrl, type: params.type };
      },
      params.model,
      params.customContext
    );

    if (!image) {
      throw new Error('Failed to generate single image');
    }

    return { image };
  };

  return { 
    generateImages, 
    getPromptPreview, 
    generateSingleImage,
    archiveImages: async (imageUrls: string[]) => {
      const { archiveImageFiles } = await import('../lib/assetManager');
      await archiveImageFiles(imageUrls);
    }
  };
};
