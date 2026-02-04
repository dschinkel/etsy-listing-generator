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
    lifestyleNoImage?: boolean,
    heroNoImage?: boolean,
    closeUpsNoImage?: boolean,
    flatLayNoImage?: boolean,
    macroNoImage?: boolean,
    contextualNoImage?: boolean,
    themedEnvironmentNoImage?: boolean,
    lifestyleCreateSimilar?: boolean,
    heroCreateSimilar?: boolean,
    closeUpsCreateSimilar?: boolean,
    flatLayCreateSimilar?: boolean,
    macroCreateSimilar?: boolean,
    contextualCreateSimilar?: boolean,
    themedEnvironmentCreateSimilar?: boolean,
    editSpecifications?: {field: string, value: string}[],
    editCount?: number,
    seeds?: number[],
    temperature?: number,
    model?: string,
    systemPromptTemplate?: string,
    editPromptTemplate?: string,
    editPromptLineTemplate?: string
  }) => {
    const fallbackModels = [
      'gemini-3-pro-image-preview',
      'gemini-2.5-flash-image'
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
    lifestyleNoImage?: boolean,
    heroNoImage?: boolean,
    closeUpsNoImage?: boolean,
    flatLayNoImage?: boolean,
    macroNoImage?: boolean,
    contextualNoImage?: boolean,
    themedEnvironmentNoImage?: boolean,
    lifestyleCreateSimilar?: boolean,
    heroCreateSimilar?: boolean,
    closeUpsCreateSimilar?: boolean,
    flatLayCreateSimilar?: boolean,
    macroCreateSimilar?: boolean,
    contextualCreateSimilar?: boolean,
    themedEnvironmentCreateSimilar?: boolean,
    editSpecifications?: {field: string, value: string}[],
    editCount?: number,
    seeds?: number[],
    temperature?: number,
    model?: string,
    systemPromptTemplate?: string,
    editPromptTemplate?: string,
    editPromptLineTemplate?: string
  }) => {
    console.log('Generating images with params:', {
      lifestyle: params.lifestyleCount,
      hero: params.heroCount,
      closeUps: params.closeUpsCount,
      flatLay: params.flatLayCount,
      macro: params.macroCount,
      contextual: params.contextualCount,
      themedEnvironment: params.themedEnvironmentCount,
      editSpecifications: params.editSpecifications,
      lifestyleNoImage: params.lifestyleNoImage,
      heroNoImage: params.heroNoImage,
      closeUpsNoImage: params.closeUpsNoImage,
      flatLayNoImage: params.flatLayNoImage,
      macroNoImage: params.macroNoImage,
      contextualNoImage: params.contextualNoImage,
      themedEnvironmentNoImage: params.themedEnvironmentNoImage,
      editCount: params.editCount,
      lifestyleCreateSimilar: params.lifestyleCreateSimilar,
      heroCreateSimilar: params.heroCreateSimilar,
      closeUpsCreateSimilar: params.closeUpsCreateSimilar,
      flatLayCreateSimilar: params.flatLayCreateSimilar,
      macroCreateSimilar: params.macroCreateSimilar,
      contextualCreateSimilar: params.contextualCreateSimilar,
      themedEnvironmentCreateSimilar: params.themedEnvironmentCreateSimilar,
      temperature: params.temperature,
      model: params.model,
      systemPromptTemplate: !!params.systemPromptTemplate,
      editPromptTemplate: !!params.editPromptTemplate,
      hasProductImage: !!(params.productImages && params.productImages.length > 0)
    });
    const images: { url: string; type: string; seed?: number }[] = [];
    let systemPrompt = '';

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

    let seedIndex = 0;
    const getNextSeed = () => {
      if (params.seeds && seedIndex < params.seeds.length) {
        return params.seeds[seedIndex++];
      }
      return undefined;
    };
    
    const collectPrompt = (result: { systemInstruction: string }) => {
      if (result.systemInstruction) {
        if (!systemPrompt) {
          systemPrompt = result.systemInstruction;
        } else {
          // Check if we already have this instruction, ignoring the count and nonce difference
          const instructionBase = result.systemInstruction
            .replace(/Generate \d+ images?/, 'Generate {{COUNT}}')
            .replace(/NONCE: NONCE-[a-z0-9]+-\d+/, 'NONCE: {{NONCE}}');
          const systemPromptBase = systemPrompt
            .replace(/Generate \d+ images?/g, 'Generate {{COUNT}}')
            .replace(/NONCE: NONCE-[a-z0-9]+-\d+/g, 'NONCE: {{NONCE}}');
          
          if (!systemPromptBase.includes(instructionBase)) {
            systemPrompt += '\n\n' + result.systemInstruction;
          }
        }
      }
    };

    await generateShotTypeImages('lifestyle', params.lifestyleCount, resolvedProductImages, lifestyleBackground, images, collectPrompt, params.model, params.lifestyleCustomContext, undefined, params.lifestyleCreateSimilar, params.temperature, params.systemPromptTemplate, undefined, undefined, getNextSeed, params.lifestyleNoImage);
    await generateShotTypeImages('hero', params.heroCount, resolvedProductImages, heroBackground, images, collectPrompt, params.model, params.heroCustomContext, undefined, params.heroCreateSimilar, params.temperature, params.systemPromptTemplate, undefined, undefined, getNextSeed, params.heroNoImage);
    await generateShotTypeImages('close-up', params.closeUpsCount, resolvedProductImages, closeUpsBackground, images, collectPrompt, params.model, params.closeUpsCustomContext, undefined, params.closeUpsCreateSimilar, params.temperature, params.systemPromptTemplate, undefined, undefined, getNextSeed, params.closeUpsNoImage);
    await generateShotTypeImages('flat-lay', params.flatLayCount, resolvedProductImages, flatLayBackground, images, collectPrompt, params.model, params.flatLayCustomContext, undefined, params.flatLayCreateSimilar, params.temperature, params.systemPromptTemplate, undefined, undefined, getNextSeed, params.flatLayNoImage);
    await generateShotTypeImages('macro', params.macroCount, resolvedProductImages, macroBackground, images, collectPrompt, params.model, params.macroCustomContext, undefined, params.macroCreateSimilar, params.temperature, params.systemPromptTemplate, undefined, undefined, getNextSeed, params.macroNoImage);
    await generateShotTypeImages('contextual', params.contextualCount, resolvedProductImages, contextualBackground, images, collectPrompt, params.model, params.contextualCustomContext, undefined, params.contextualCreateSimilar, params.temperature, params.systemPromptTemplate, undefined, undefined, getNextSeed, params.contextualNoImage);
    await generateShotTypeImages('themed-environment', params.themedEnvironmentCount, resolvedProductImages, themedEnvironmentBackground, images, collectPrompt, params.model, params.themedEnvironmentCustomContext, undefined, params.themedEnvironmentCreateSimilar, params.temperature, params.systemPromptTemplate, undefined, undefined, getNextSeed, params.themedEnvironmentNoImage);

    if (params.editSpecifications && params.editSpecifications.length > 0) {
      await generateShotTypeImages('edit', params.editCount || 1, resolvedProductImages, undefined, images, collectPrompt, params.model, undefined, undefined, false, params.temperature, params.systemPromptTemplate, params.editPromptTemplate, params.editPromptLineTemplate, getNextSeed, false, params.editSpecifications);
    }

    return { images, systemPrompt, model: params.model };
  };

  const generateShotTypeImages = async (
    type: string, 
    count: number = 0, 
    productImages?: string[], 
    background?: string, 
    images: { url: string; type: string; seed?: number }[] = [], 
    onResult?: (res: any) => void,
    model?: string,
    customContext?: string,
    systemPrompt?: string,
    createSimilar?: boolean,
    temperature?: number,
    systemPromptTemplate?: string,
    editPromptTemplate?: string,
    editPromptLineTemplate?: string,
    getNextSeed?: () => number | undefined,
    skipProductImage?: boolean,
    editSpecifications?: {field: string, value: string}[]
  ) => {
    const runGeneration = async (indexInType: number) => {
      let retries = 0;
      const maxRetries = 2;
      let success = false;
      const clientSeed = getNextSeed ? getNextSeed() : undefined;
      const initialSeed = clientSeed !== undefined ? clientSeed : (createSimilar ? Math.floor(Math.random() * 2147483647) : undefined);
      
      if (initialSeed !== undefined) {
        console.log(`Seed for ${type} generation: ${initialSeed} (Source: ${clientSeed !== undefined ? 'client' : 'create-similar'})`);
      }

      if (customContext) {
        console.log(`Using Custom Context for ${type}: "${customContext}"`);
      }

      if (skipProductImage) {
        console.log(`Skipping product image for ${type} (TEXT-ONLY MODE)`);
      }
      
      while (!success && retries <= maxRetries) {
        try {
          const seed = initialSeed;
          
          // Re-generate system instruction if it wasn't explicitly provided, 
          // to ensure a fresh nonce for every single image generation.
          const currentSystemPrompt = systemPrompt || dataLayer.getSystemPrompt({
            type,
            count: 1,
            customContext,
            systemPromptTemplate,
            editPromptTemplate,
            editPromptLineTemplate,
            editSpecifications
          });

          const result = await dataLayer.generateImage({ 
            type,
            productImages,
            background,
            count: 1,
            model,
            customContext,
            systemPrompt: currentSystemPrompt,
            systemPromptTemplate,
            editPromptTemplate,
            editPromptLineTemplate,
            seed,
            temperature,
            skipProductImage,
            editSpecifications
          });
          const imageUrl = result.imageUrl;
          onResult?.({ ...result, imageUrl });
          ensureValidUrl(imageUrl);
          addGeneratedImage(images, imageUrl, type, result.seed);
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
      promises.push(runGeneration(i));
    }
    await Promise.all(promises);
  };

  const addGeneratedImage = (images: { url: string; type: string; seed?: number }[], url: string, type: string, seed?: number) => {
    images.push({ url, type, seed });
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
    themedEnvironmentCustomContext?: string,
    editSpecifications?: {field: string, value: string}[],
    editCount?: number,
    systemPromptTemplate?: string,
    editPromptTemplate?: string,
    editPromptLineTemplate?: string
  } = {}) => {
    let systemPrompt = '';
    const safeParams = params || {};
    const collect = (type: string, count: number, customContext?: string, editSpecifications?: {field: string, value: string}[]) => {
      if (count > 0) {
        const prompt = dataLayer.getSystemPrompt({ 
          type, 
          count, 
          customContext,
          systemPromptTemplate: safeParams.systemPromptTemplate,
          editPromptTemplate: safeParams.editPromptTemplate,
          editPromptLineTemplate: safeParams.editPromptLineTemplate,
          editSpecifications
        });
        console.log(`Preview prompt generated for ${type} with context: ${customContext ? 'YES' : 'NO'}`);
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
    collect('edit', (safeParams.editSpecifications && safeParams.editSpecifications.length > 0) ? (safeParams.editCount || 1) : 0, undefined, safeParams.editSpecifications);

    if (!systemPrompt) {
      systemPrompt = dataLayer.getSystemPrompt({ 
        type: 'none', 
        count: 1,
        systemPromptTemplate: safeParams.systemPromptTemplate
      });
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
    temperature?: number,
    systemPromptTemplate?: string,
    editPromptTemplate?: string,
    editPromptLineTemplate?: string
  }) => {
    let image: { url: string; type: string; seed?: number } | null = null;
    let systemPromptUsed = '';
    
    const resolvedProductImages = params.productImages 
      ? await Promise.all(params.productImages.map(img => resolveLocalImageUrl(img)))
      : undefined;
    
    const background = params.background ? await resolveLocalImageUrl(params.background) : undefined;

    // Use a fresh system prompt for single image generation too, to ensure SCENE OVERRIDE is present
    const forcedSystemPrompt = dataLayer.getSystemPrompt({
      type: params.type,
      count: 1,
      customContext: params.customContext,
      systemPromptTemplate: params.systemPromptTemplate,
      editPromptTemplate: params.editPromptTemplate,
      editPromptLineTemplate: params.editPromptLineTemplate
    });

    await generateShotTypeImages(
      params.type, 
      1, 
      resolvedProductImages, 
      background, 
      [], // We don't need the images array here, we'll capture it via onResult
      (res) => {
        image = { url: res.imageUrl, type: params.type, seed: res.seed };
        systemPromptUsed = res.systemInstruction;
      },
      params.model,
      params.customContext,
      forcedSystemPrompt, // Pass the newly generated prompt
      undefined,
      params.temperature,
      params.systemPromptTemplate,
      params.editPromptTemplate,
      params.editPromptLineTemplate
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
    saveImage: async (imageUrl: string, type: string) => {
      return await saveImageToAssets(imageUrl, type);
    },
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
