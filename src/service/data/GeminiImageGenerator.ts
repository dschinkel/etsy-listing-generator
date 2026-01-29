import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

export const SYSTEM_PROMPT_TEMPLATE = `Role: You are an image-generation assistant helping me (an Etsy seller) create consistent listing photos.

PRIMARY RULE:
The user provides a product reference image. That image is the single source of truth for the product’s geometry, proportions, materials, colors, and details.
Every generated image MUST depict the SAME product.

OUTPUT REQUIREMENTS:
- Generate {{COUNT_TEXT}}.
- Use shot type: {{SHOT_TYPE}}.
- Keep the product as the hero subject and in sharp focus.

IDENTITY LOCK:
- Do not change the product’s shape or geometry.
- Do not add/remove features or branding.
- Match materials, colors, and finish exactly.

COMPOSITION:
- Use realistic product-photography conventions.
- Maintain correct scale and proportions.

TASK:
Generate {{COUNT_TEXT}} using shot type: {{SHOT_TYPE}}.
Use the provided product reference image as the identity anchor.`;

export const createGeminiImageGenerator = () => {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const genAI = new GoogleGenerativeAI(apiKey);

  const getSystemPrompt = (params: { type: string; count?: number; customContext?: string }) => {
    const count = params.count || 1;
    const countText = count === 1 ? '1 image' : `${count} images`;
    let shotTypeWithDescription = params.type;
    
    if (params.type === 'themed-environment') {
      shotTypeWithDescription = 'themed environment (The product is placed in a realistic, thematic setting)';
    }

    let prompt = SYSTEM_PROMPT_TEMPLATE
      .replace(/{{COUNT_TEXT}}/g, countText)
      .replace(/{{SHOT_TYPE}}/g, shotTypeWithDescription);
    
    if (params.customContext) {
      prompt += `\n\nCUSTOM CONTEXT FOR ${params.type.toUpperCase()} SHOT:\n${params.customContext}`;
    }
    
    return prompt;
  };

  const generateImage = async (params: { type: string; productImages?: string[]; background?: string; count?: number; model?: string; customContext?: string }): Promise<{ imageUrl: string; systemInstruction: string }> => {
    const count = params.count || 1;
    const countText = count === 1 ? '1 image' : `${count} images`;
    const systemInstruction = getSystemPrompt({ type: params.type, count, customContext: params.customContext });

    const modelName = params.model || "gemini-2.5-flash-image";
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      systemInstruction: {
        role: "system",
        parts: [{ text: systemInstruction }]
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ]
    });

    const userPrompt = `${countText}. Shot type: ${params.type}.`;
    const toonPrompt = buildToonPrompt(params.type, userPrompt);

    const parts: any[] = [
      toonPrompt
    ];

    if (params.productImages && params.productImages.length > 0) {
      params.productImages.forEach(img => {
        parts.push(toGenerativePart(img));
      });
    }

    if (params.background) {
      parts.push(toGenerativePart(params.background));
    }

    try {
      const result = await model.generateContent(parts);
      const response = await result.response;
      
      const imageUrl = extractImageFromResponse(response);
      if (imageUrl) {
        return { imageUrl, systemInstruction };
      }

      if (isEmptyResponse(response)) {
         return { imageUrl: getPlaceholderUrl(params.type), systemInstruction };
      }
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      const enhancedError: any = new Error(error.message || String(error));
      enhancedError.status = error.status;
      throw enhancedError;
    }

    return { imageUrl: getPlaceholderUrl(params.type), systemInstruction };
  };

  return { generateImage, getSystemPrompt };
};

export const getPlaceholderUrl = (type: string): string => {
  return `https://picsum.photos/seed/${type}${Date.now()}/800/800`;
};

const cleanBase64 = (data: string) => data.replace(/\s/g, '');

const toDataUrl = (data: string, mimeType: string) => {
  const cleaned = cleanBase64(data);
  if (cleaned.startsWith('data:')) return cleaned;
  return `data:${mimeType};base64,${cleaned}`;
};

const isImageUrl = (url: string) => /https?:\/\/[^\s)]+\.(png|jpg|jpeg|webp|gif)/i.test(url);

export const extractImageFromResponse = (response: any): string | null => {
  const candidates = response.candidates || [];
  
  // 1. Prioritize inlineData (base64)
  for (const candidate of candidates) {
    const parts = candidate.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data && part.inlineData?.mimeType && part.inlineData.mimeType.startsWith('image/')) {
        return toDataUrl(part.inlineData.data, part.inlineData.mimeType);
      }
    }
  }

  // 2. Look for valid image URLs in text parts
  for (const candidate of candidates) {
    const parts = candidate.content?.parts || [];
    for (const part of parts) {
      if (part.text && isImageUrl(part.text)) {
        const urlMatch = part.text.match(/https?:\/\/[^\s)]+\.(png|jpg|jpeg|webp|gif)/i);
        if (urlMatch) {
          return urlMatch[0];
        }
      }
    }
  }
  
  // 3. Last resort: deep search
  return findImageDeep(response);
};

const findImageDeep = (obj: any, seen = new Set(), depth = 0): string | null => {
  if (!obj || typeof obj !== 'object' || seen.has(obj) || depth > 10) return null;
  seen.add(obj);
  
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const found = findImageDeep(item, seen, depth + 1);
      if (found) return found;
    }
  } else {
    // Check for inlineData-like structure
    if (obj.mimeType && typeof obj.mimeType === 'string' && obj.mimeType.startsWith('image/') && 
        obj.data && typeof obj.data === 'string' && obj.data.length > 100) {
      return toDataUrl(obj.data, obj.mimeType);
    }
    // Check for URL-like strings
    for (const key in obj) {
      try {
        const value = obj[key];
        if (typeof value === 'string') {
          if (value.startsWith('data:image')) return cleanBase64(value);
          if (isImageUrl(value)) return value;
        } else if (typeof value === 'object') {
          const found = findImageDeep(value, seen, depth + 1);
          if (found) return found;
        }
      } catch (e) {
        continue;
      }
    }
  }
  return null;
};

const isEmptyResponse = (response: any): boolean => {
  const hasCandidates = response.candidates && response.candidates.length > 0;
  if (!hasCandidates) return true;
  
  const hasContent = response.candidates.some((c: any) => c.content?.parts?.length > 0);
  return !hasContent;
};

const buildToonPrompt = (type: string, userPrompt: string): string => {
  return `
TOON 1.0
TITLE: Generate ${type} image
PROMPT: ${userPrompt}
TYPE: IMAGE
`;
};

const toGenerativePart = (dataUrl: string) => {
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    return { text: dataUrl || '' };
  }
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return { text: dataUrl };
  }
  return {
    inlineData: {
      data: match[2],
      mimeType: match[1]
    }
  };
};
