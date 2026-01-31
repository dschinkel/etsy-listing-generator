import { saveImageToAssets, resolveLocalImageUrl } from '../lib/assetManager';

export const createListingRepository = (dataLayer: any) => {
  const generateImages = async (params: { 
    lifestyleCount?: number, 
    heroCount?: number,
    closeUpsCount?: number,
    flatLayCount?: number,
    macroCount?: number,
    contextualCount?: number,
    themedEnvironmentCount?: number,
    productImages?: string[],
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
    lifestyleCreateSimilar?: boolean,
    heroCreateSimilar?: boolean,
    closeUpsCreateSimilar?: boolean,
    flatLayCreateSimilar?: boolean,
    macroCreateSimilar?: boolean,
    contextualCreateSimilar?: boolean,
    themedEnvironmentCreateSimilar?: boolean,
    temperature?: number,
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
    productImages?: string[],
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
    lifestyleCreateSimilar?: boolean,
    heroCreateSimilar?: boolean,
    closeUpsCreateSimilar?: boolean,
    flatLayCreateSimilar?: boolean,
    macroCreateSimilar?: boolean,
    contextualCreateSimilar?: boolean,
    themedEnvironmentCreateSimilar?: boolean,
    temperature?: number,
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
      lifestyleCreateSimilar: params.lifestyleCreateSimilar,
      heroCreateSimilar: params.heroCreateSimilar,
      closeUpsCreateSimilar: params.closeUpsCreateSimilar,
      flatLayCreateSimilar: params.flatLayCreateSimilar,
      macroCreateSimilar: params.macroCreateSimilar,
      contextualCreateSimilar: params.contextualCreateSimilar,
      themedEnvironmentCreateSimilar: params.themedEnvironmentCreateSimilar,
      temperature: params.temperature,
      model: params.model,
      hasProductImage: !!(params.productImages && params.productImages.length > 0)
    });
    const images: { url: string; type: string }[] = [];
    const preview = getPromptPreview(params);
    let systemPrompt = preview.systemPrompt;

    const resolvedProductImages = params.productImages 
      ? await Promise.all(params.productImages.map(img => resolveLocalImageUrl(img)))
      : undefined;
    
    const resolveBg = async (bg?: string) => bg ? await resolveLocalImageUrl(bg) : undefined;
    
    const [
      lifestyleBackground,
      heroBackground,
      closeUpsBackground,
      flatLayBackground,
      macroBackground,
      contextualBackground,
      themedEnvironmentBackground
    ] = await Promise.all([
      resolveBg(params.lifestyleBackground),
      resolveBg(params.heroBackground),
      resolveBg(params.closeUpsBackground),
      resolveBg(params.flatLayBackground),
      resolveBg(params.macroBackground),
      resolveBg(params.contextualBackground),
      resolveBg(params.themedEnvironmentBackground)
    ]);
    
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

    await generateShotTypeImages('lifestyle', params.lifestyleCount, resolvedProductImages, lifestyleBackground, images, collectPrompt, params.model, params.lifestyleCustomContext, undefined, params.lifestyleCreateSimilar, params.temperature);
    await generateShotTypeImages('hero', params.heroCount, resolvedProductImages, heroBackground, images, collectPrompt, params.model, params.heroCustomContext, undefined, params.heroCreateSimilar, params.temperature);
    await generateShotTypeImages('close-up', params.closeUpsCount, resolvedProductImages, closeUpsBackground, images, collectPrompt, params.model, params.closeUpsCustomContext, undefined, params.closeUpsCreateSimilar, params.temperature);
    await generateShotTypeImages('flat-lay', params.flatLayCount, resolvedProductImages, flatLayBackground, images, collectPrompt, params.model, params.flatLayCustomContext, undefined, params.flatLayCreateSimilar, params.temperature);
    await generateShotTypeImages('macro', params.macroCount, resolvedProductImages, macroBackground, images, collectPrompt, params.model, params.macroCustomContext, undefined, params.macroCreateSimilar, params.temperature);
    await generateShotTypeImages('contextual', params.contextualCount, resolvedProductImages, contextualBackground, images, collectPrompt, params.model, params.contextualCustomContext, undefined, params.contextualCreateSimilar, params.temperature);
    await generateShotTypeImages('themed-environment', params.themedEnvironmentCount, resolvedProductImages, themedEnvironmentBackground, images, collectPrompt, params.model, params.themedEnvironmentCustomContext, undefined, params.themedEnvironmentCreateSimilar, params.temperature);

    return { images, systemPrompt, model: params.model };
  };

  const generateShotTypeImages = async (
    type: string, 
    count: number = 0, 
    productImages?: string[], 
    background?: string, 
    images: { url: string; type: string }[] = [], 
    onResult?: (res: any) => void,
    model?: string,
    customContext?: string,
    systemPrompt?: string,
    createSimilar?: boolean,
    temperature?: number
  ) => {
    const runGeneration = async () => {
      let retries = 0;
      const maxRetries = 2;
      let success = false;
      
      while (!success && retries <= maxRetries) {
        try {
          const seed = createSimilar ? Math.floor(Math.random() * 2147483647) : undefined;
          const result = await dataLayer.generateImage({ 
            type,
            productImages,
            background,
            count: 1,
            model,
            customContext,
            systemPrompt,
            seed,
            temperature
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
    productImages?: string[],
    background?: string,
    model?: string,
    systemPrompt?: string,
    temperature?: number
  }) => {
    let image: { url: string; type: string } | null = null;
    let systemPromptUsed = '';
    
    const resolvedProductImages = params.productImages 
      ? await Promise.all(params.productImages.map(img => resolveLocalImageUrl(img)))
      : undefined;
    
    const background = params.background ? await resolveLocalImageUrl(params.background) : undefined;

    await generateShotTypeImages(
      params.type, 
      1, 
      resolvedProductImages, 
      background, 
      [], // We don't need the images array here, we'll capture it via onResult
      (res) => {
        image = { url: res.imageUrl, type: params.type };
        systemPromptUsed = res.systemInstruction;
      },
      params.model,
      params.customContext,
      params.systemPrompt,
      undefined,
      params.temperature
    );

    if (!image) {
      throw new Error('Failed to generate single image');
    }

    return { image, systemPrompt: systemPromptUsed };
  };

  return { 
    generateImages, 
    getPromptPreview, 
    generateSingleImage,
    archiveImages: async (imageUrls: string[], target?: 'archived' | 'uploads') => {
      const { archiveImageFiles } = await import('../lib/assetManager');
      await archiveImageFiles(imageUrls, target);
    },
    getArchivedUploads: async () => {
      const { getArchivedUploadFiles } = await import('../lib/assetManager');
      return await getArchivedUploadFiles();
    }
  };
};
