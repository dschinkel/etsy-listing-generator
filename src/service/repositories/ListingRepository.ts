export const createListingRepository = (dataLayer: any) => {
  const generateImages = async (params: { 
    lifestyleCount?: number, 
    heroCount?: number,
    closeUpsCount?: number,
    flatLayCount?: number,
    macroCount?: number,
    contextualCount?: number,
    productImage?: string,
    lifestyleBackground?: string,
    heroBackground?: string,
    closeUpsBackground?: string,
    flatLayBackground?: string,
    macroBackground?: string,
    contextualBackground?: string,
    model?: string
  }) => {
    console.log('Generating images with params:', {
      lifestyle: params.lifestyleCount,
      hero: params.heroCount,
      closeUps: params.closeUpsCount,
      flatLay: params.flatLayCount,
      macro: params.macroCount,
      contextual: params.contextualCount,
      model: params.model,
      hasProductImage: !!params.productImage
    });
    const images: string[] = [];
    const preview = getPromptPreview(params);
    let systemPrompt = preview.systemPrompt;
    
    const collectPrompt = (result: { systemInstruction: string }) => {
      if (result.systemInstruction) {
        if (!systemPrompt) {
          systemPrompt = result.systemInstruction;
        } else if (!systemPrompt.includes(result.systemInstruction)) {
          systemPrompt += '\n\n' + result.systemInstruction;
        }
      }
    };

    await generateShotTypeImages('lifestyle', params.lifestyleCount, params.productImage, params.lifestyleBackground, images, collectPrompt, params.model);
    await generateShotTypeImages('hero', params.heroCount, params.productImage, params.heroBackground, images, collectPrompt, params.model);
    await generateShotTypeImages('close-up', params.closeUpsCount, params.productImage, params.closeUpsBackground, images, collectPrompt, params.model);
    await generateShotTypeImages('flat-lay', params.flatLayCount, params.productImage, params.flatLayBackground, images, collectPrompt, params.model);
    await generateShotTypeImages('macro', params.macroCount, params.productImage, params.macroBackground, images, collectPrompt, params.model);
    await generateShotTypeImages('contextual', params.contextualCount, params.productImage, params.contextualBackground, images, collectPrompt, params.model);

    return { images, systemPrompt };
  };

  const generateShotTypeImages = async (
    type: string, 
    count: number = 0, 
    productImage?: string, 
    background?: string, 
    images: string[] = [], 
    onResult?: (res: any) => void,
    model?: string
  ) => {
    for (let i = 0; i < count; i++) {
      const result = await dataLayer.generateImage({ 
        type,
        productImage,
        background,
        count: 1,
        model
      });
      const imageUrl = result.imageUrl;
      onResult?.(result);
      ensureValidUrl(imageUrl);
      images.push(imageUrl);
    }
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
    contextualCount?: number
  } = {}) => {
    let systemPrompt = '';
    const safeParams = params || {};
    const collect = (type: string, count: number) => {
      if (count > 0) {
        const prompt = dataLayer.getSystemPrompt({ type, count });
        if (!systemPrompt) {
          systemPrompt = prompt;
        } else if (!systemPrompt.includes(prompt)) {
          systemPrompt += '\n\n' + prompt;
        }
      }
    };

    collect('lifestyle', safeParams.lifestyleCount || 0);
    collect('hero', safeParams.heroCount || 0);
    collect('close-up', safeParams.closeUpsCount || 0);
    collect('flat-lay', safeParams.flatLayCount || 0);
    collect('macro', safeParams.macroCount || 0);
    collect('contextual', safeParams.contextualCount || 0);

    if (!systemPrompt) {
      systemPrompt = dataLayer.getSystemPrompt({ type: 'hero', count: 1 });
    }

    return { systemPrompt };
  };

  return { generateImages, getPromptPreview };
};
