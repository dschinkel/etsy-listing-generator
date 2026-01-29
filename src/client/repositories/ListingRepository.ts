import { fetchWithTimeout } from '../lib/utils';

export const createListingRepository = () => {
  const generateImages = async (params: { 
    lifestyleCount?: number, 
    heroCount?: number, 
    closeUpsCount?: number,
    flatLayCount?: number,
    macroCount?: number,
    contextualCount?: number,
    themedEnvironmentCount?: number,
    productImage?: string | null,
    lifestyleBackground?: string | null,
    heroBackground?: string | null,
    closeUpsBackground?: string | null,
    flatLayBackground?: string | null,
    macroBackground?: string | null,
    contextualBackground?: string | null,
    themedEnvironmentBackground?: string | null,
    lifestyleCustomContext?: string,
    heroCustomContext?: string,
    closeUpsCustomContext?: string,
    flatLayCustomContext?: string,
    macroCustomContext?: string,
    contextualCustomContext?: string,
    themedEnvironmentCustomContext?: string,
    model?: string
  }) => {
    const response = await fetchWithTimeout('/listings/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      await handleErrorResponse(response);
    }

    return await response.json();
  };

  const handleErrorResponse = async (response: Response) => {
    const text = await response.text();
    let errorDetail = text;
    let systemPrompt = '';
    let retryable = false;
    let nextModel = '';

    try {
      const errorJson = JSON.parse(text);
      errorDetail = errorJson.error || errorJson.message || JSON.stringify(errorJson);
      systemPrompt = errorJson.systemPrompt || '';
      retryable = !!errorJson.retryable;
      nextModel = errorJson.nextModel || '';
    } catch (e) {
      // Use raw text as errorDetail if not JSON
    }

    const error: any = new Error(`Server Error (${response.status}): ${errorDetail}`);
    error.systemPrompt = systemPrompt;
    error.retryable = retryable;
    error.nextModel = nextModel;
    throw error;
  };

  const getSystemPromptPreview = async (params: {
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

  const getTemplates = async () => {
    const response = await fetchWithTimeout('/listings/templates', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      return { templates: [] };
    }

    return await response.json();
  };

  const saveTemplate = async (template: { name: string; text: string }) => {
    const response = await fetchWithTimeout('/listings/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to save template: ${text}`);
    }

    return await response.json();
  };

  const removeTemplate = async (name: string) => {
    const response = await fetchWithTimeout(`/listings/templates/${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to remove template: ${text}`);
    }

    return await response.json();
  };

  const deleteImage = async (url: string) => {
    const response = await fetchWithTimeout('/listings/images', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Failed to delete image: ${text}`);
    }

    return response.ok;
  };

  return { generateImages, getSystemPromptPreview, getTemplates, saveTemplate, removeTemplate, deleteImage };
};
