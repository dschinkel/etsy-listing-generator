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
    model?: string
  }) => {
    const response = await fetchWithTimeout('/listings/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      let errorDetail = '';
      try {
        const errorJson = await response.json();
        errorDetail = errorJson.error || errorJson.message || JSON.stringify(errorJson);
      } catch (e) {
        errorDetail = await response.text();
      }
      throw new Error(`Server Error (${response.status}): ${errorDetail}`);
    }

    return await response.json();
  };

  const getSystemPromptPreview = async (params: {
    lifestyleCount?: number,
    heroCount?: number,
    closeUpsCount?: number,
    flatLayCount?: number,
    macroCount?: number,
    contextualCount?: number
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
