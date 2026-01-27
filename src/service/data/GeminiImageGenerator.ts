import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

export const SYSTEM_PROMPT_TEMPLATE = `Role: You are an image-generation assistant helping me (an Etsy seller) create consistent listing photos.

PRIMARY RULE:
The user provides a product reference image. That image is the single source of truth for the product’s geometry, proportions, materials, colors, and details.
Every generated image MUST depict the SAME product.

OUTPUT REQUIREMENTS:
- Generate {{COUNT}} images.
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
Generate {{COUNT}} images using shot type: {{SHOT_TYPE}}.
Use the provided product reference image as the identity anchor.`;

export const createGeminiImageGenerator = () => {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const genAI = new GoogleGenerativeAI(apiKey);

  const getSystemPrompt = (params: { type: string; count?: number }) => {
    const count = params.count || 1;
    return SYSTEM_PROMPT_TEMPLATE
      .replace(/{{COUNT}}/g, count.toString())
      .replace(/{{SHOT_TYPE}}/g, params.type);
  };

  const generateImage = async (params: { type: string; productImage?: string; background?: string; count?: number; model?: string }): Promise<{ imageUrl: string; systemInstruction: string }> => {
    const count = params.count || 1;
    const systemInstruction = getSystemPrompt({ type: params.type, count });

    const modelName = params.model || "gemini-3-pro-image-preview";
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

    const userPrompt = `${count} images. Shot type: ${params.type}.`;
    const toonPrompt = buildToonPrompt(params.type, userPrompt);

    const parts: any[] = [
      toonPrompt
    ];

    if (params.productImage) {
      parts.push(toGenerativePart(params.productImage));
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

const getPlaceholderUrl = (type: string): string => {
  return `https://placehold.jp/24/cccccc/333333/800x800.png?text=${encodeURIComponent(type)}&t=${Date.now()}`;
};

const extractImageFromResponse = (response: any): string | null => {
  const candidates = response.candidates || [];
  for (const candidate of candidates) {
    const parts = candidate.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
      if (part.fileData) {
        return part.fileData.fileUri;
      }
      if (part.text) {
        const urlMatch = part.text.match(/https?:\/\/[^\s)]+/);
        if (urlMatch) {
          return urlMatch[0];
        }
      }
    }
  }
  
  // Fallback: search anywhere in the object for something that looks like an image
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
    if (obj.mimeType && obj.data && typeof obj.data === 'string' && obj.data.length > 100) {
      return `data:${obj.mimeType};base64,${obj.data}`;
    }
    // Check for URL-like strings
    for (const key in obj) {
      try {
        const value = obj[key];
        if (typeof value === 'string') {
          if (value.startsWith('data:image')) return value;
          if (value.match(/^https?:\/\/[^\s)]+\.(png|jpg|jpeg|webp)/i)) return value;
        } else if (typeof value === 'object') {
          const found = findImageDeep(value, seen, depth + 1);
          if (found) return found;
        }
      } catch (e) {
        // Handle cases where property access might throw (rare)
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
