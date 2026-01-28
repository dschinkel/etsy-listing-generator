import { fetchWithTimeout } from '../lib/utils';

export const createListingRepository = () => {
  const generateImages = async (params: { 
    lifestyleCount?: number, 
    heroCount?: number, 
    closeUpsCount?: number,
    flatLayCount?: number,
    macroCount?: number,
    contextualCount?: number,
    productImage?: string | null,
    lifestyleBackground?: string | null,
    heroBackground?: string | null,
    closeUpsBackground?: string | null,
    flatLayBackground?: string | null,
    macroBackground?: string | null,
    contextualBackground?: string | null,
    lifestyleCustomContext?: string,
    heroCustomContext?: string,
    closeUpsCustomContext?: string,
    flatLayCustomContext?: string,
    macroCustomContext?: string,
    contextualCustomContext?: string,
    model?: string
  }) => {
    const response = await fetchWithTimeout('/listings/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      let errorDetail = '';
      let systemPrompt = '';
      let retryable = false;
      let nextModel = '';
      try {
        const errorJson = await response.json();
        errorDetail = errorJson.error || errorJson.message || JSON.stringify(errorJson);
        systemPrompt = errorJson.systemPrompt || '';
        retryable = !!errorJson.retryable;
        nextModel = errorJson.nextModel || '';
      } catch (e) {
        errorDetail = await response.text();
      }
      const error: any = new Error(`Server Error (${response.status}): ${errorDetail}`);
      error.systemPrompt = systemPrompt;
      error.retryable = retryable;
      error.nextModel = nextModel;
      throw error;
    }

    return await response.json();
  };

  const getSystemPromptPreview = async (params: {
    lifestyleCount?: number,
    heroCount?: number,
    closeUpsCount?: number,
    flatLayCount?: number,
    macroCount?: number,
    contextualCount?: number,
    lifestyleCustomContext?: string,
    heroCustomContext?: string,
    closeUpsCustomContext?: string,
    flatLayCustomContext?: string,
    macroCustomContext?: string,
    contextualCustomContext?: string
  }) => {
    const response = await fetchWithTimeout('/listings/system-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      return { systemPrompt: '' };
    }

    return await response.json();
  };

  return { generateImages, getSystemPromptPreview };
};
