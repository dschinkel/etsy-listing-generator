import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";

export const SYSTEM_PROMPT_TEMPLATE = `Role: You are an image-generation assistant helping an Etsy seller create consistent listing photos.

PRODUCT IDENTITY RULE (CRITICAL):
The user provides a product reference image.
That image is the single source of truth ONLY for the product itself:
its geometry, proportions, materials, colors, surface finish, text style, and details.

The reference image does NOT define the environment, setting, or scene.
The environment must be newly generated for each image and must strictly follow any provided SCENE OVERRIDE.

Do not reuse, approximate, or reference the environment, lighting, camera angle,
or setting from the reference image. The reference image defines the product only.

OUTPUT REQUIREMENTS:
- Generate {{IMAGE_COUNT}} image(s).
- Shot type: {{SHOT_TYPE}}.
- The product must be the hero subject and in sharp focus.

IDENTITY LOCK:
- Do not change the product’s shape, geometry, proportions, or design.
- Do not add or remove features, icons, or branding.
- Match materials, colors, finish, and text styling exactly to the reference image.

COMPOSITION:
- Use realistic product-photography conventions.
- Maintain correct scale and proportions.
- No people present.

SCENE AND ENVIRONMENT:
(IMPORTANT: Prioritize any provided SCENE OVERRIDE text above all else.)
CONTEXTUAL SCENE RULES:
`;

export const EDIT_PROMPT_TEMPLATE = `EDIT MODE — TEXT REPLACEMENT ONLY

You are editing an existing image. This is NOT a redraw and NOT a re-illustration.

The provided image is the final, approved product design.
You must preserve the image pixel-for-pixel except where text is explicitly replaced.

OUTPUT REQUIREMENTS:
- Generate {{IMAGE_COUNT}} image(s).

ALLOWED CHANGES (ONLY):
{{ALLOWED_CHANGES}}

ABSOLUTE LOCKS (DO NOT CHANGE):
• Do NOT change background color
• Do NOT change materials, textures, lighting, shadows, or outlines
• Do NOT change camera angle, framing, or perspective
• Do NOT change icon artwork, shapes, or proportions
• Do NOT change borders, stroke thickness, bevels, or 3D depth
• Do NOT simplify, cartoonize, or re-style the image
• Do NOT convert to illustration, vector, or flat art
• Do NOT regenerate the product or scene

TEXT MATCHING RULES:
• New name must match the original font style exactly
• New name must match original letter thickness, spacing, outline, and embossing
• New number must match original number style exactly
• Preserve all original colors except for the letterforms being replaced

OUTPUT:
Return the same image with ONLY the name and number text changed.
If any other change is required to complete the edit, do NOT make it.`;

export const createGeminiImageGenerator = () => {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const genAI = new GoogleGenerativeAI(apiKey);
  const newGenAI = new GoogleGenAI({ apiKey });

  const getSystemPrompt = (params: { 
    type: string; 
    count?: number; 
    customContext?: string; 
    systemPromptTemplate?: string;
    editPromptTemplate?: string;
    editPromptLineTemplate?: string;
    editSpecifications?: {field: string, value: string}[]
  }) => {
    if (params.editSpecifications && params.editSpecifications.length > 0) {
      let allowedChanges = '';
      const lineTemplate = params.editPromptLineTemplate || "• Replace the {{FIELD}} text with: {{VALUE}}";
      
      params.editSpecifications.forEach(spec => {
        if (spec.value.trim()) {
          let fieldName = spec.field.toUpperCase();
          if (fieldName === 'BACKGROUND') {
            fieldName = 'BACKGROUND COLOR';
          }
          allowedChanges += lineTemplate
            .replace('{{FIELD}}', fieldName)
            .replace('{{VALUE}}', spec.value) + '\n';
        }
      });

      const template = params.editPromptTemplate || EDIT_PROMPT_TEMPLATE;
      const count = params.count || 1;
      const countText = count === 1 ? '1' : `${count}`;
      const nonce = `NONCE-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`;
      
      return `NONCE: ${nonce}\n` + template
        .replace('{{ALLOWED_CHANGES}}', allowedChanges.trim())
        .replace(/{{IMAGE_COUNT}}/g, countText)
        .replace(/{{COUNT_TEXT}}/g, count === 1 ? '1 image' : `${count} images`);
    }

    const count = params.count || 1;
    const countText = count === 1 ? '1' : `${count}`;
    let shotTypeWithDescription = params.type;
    
    if (params.type === 'themed-environment') {
      shotTypeWithDescription = 'themed environment (The product is placed in a realistic, thematic setting)';
    } else if (params.type === 'custom') {
      shotTypeWithDescription = 'custom shot based on specific instructions';
    }

    const template = params.systemPromptTemplate || SYSTEM_PROMPT_TEMPLATE;
    const nonce = `NONCE-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`;
    let prompt = "";

    if (params.customContext) {
      const sceneOverride = `SCENE OVERRIDE: ${params.customContext}\n(IMPORTANT: This override takes absolute precedence over any default setting or previous context. Generate exactly this scene, NOT a default or related one.)`;
      prompt = `NONCE: ${nonce}\n${sceneOverride}\n\n${template}`;
    } else {
      prompt = `NONCE: ${nonce}\n${template}`;
    }

    prompt = prompt
      .replace(/{{IMAGE_COUNT}}/g, countText)
      .replace(/{{COUNT_TEXT}}/g, count === 1 ? '1 image' : `${count} images`)
      .replace(/{{SHOT_TYPE}}/g, shotTypeWithDescription);
    
    return prompt;
  };

  const generateImage = async (params: { 
    type: string; 
    productImages?: string[]; 
    background?: string; 
    count?: number; 
    model?: string; 
    customContext?: string;
    systemPrompt?: string;
    systemPromptTemplate?: string;
    editPromptTemplate?: string;
    editPromptLineTemplate?: string;
    seed?: number;
    temperature?: number;
    skipProductImage?: boolean;
    editSpecifications?: {field: string, value: string}[];
  }): Promise<{ imageUrl: string; systemInstruction: string; seed?: number }> => {
    const count = params.count || 1;
    const systemInstruction = params.systemPrompt || getSystemPrompt({ 
      type: params.type, 
      count, 
      customContext: params.customContext,
      systemPromptTemplate: params.systemPromptTemplate,
      editPromptTemplate: params.editPromptTemplate,
      editPromptLineTemplate: params.editPromptLineTemplate,
      editSpecifications: params.editSpecifications
    });
    const countText = count === 1 ? '1 image' : `${count} images`;

    const modelName = params.model || "gemini-3-pro-image-preview";

    const shouldSkipImage = params.skipProductImage || params.customContext?.includes("ISOLATION TEST: NO IMAGE");
    const hasProductImages = params.productImages && params.productImages.length > 0 && !shouldSkipImage;
    
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      systemInstruction: {
        role: "system",
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        seed: params.seed,
        temperature: params.temperature
      } as any,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ]
    });

    const userPrompt = `${countText}. Shot type: ${params.type}.`;
    
    // Enhance user prompt if it's a composite/placement task
    let finalUserPrompt = userPrompt;
    if (params.background && params.productImages && params.productImages.length > 0 && !shouldSkipImage) {
      finalUserPrompt = `${userPrompt} TASK: COMPOSITE/PLACEMENT. Place the product from the reference image(s) naturally into the provided background image. Maintain correct lighting, shadows, and perspective to ensure a realistic integration.`;
    }

    const toonPrompt = buildToonPrompt(params.type, finalUserPrompt);

    const parts: any[] = [];

    // Prioritize reference images by placing them at the beginning of the parts array.
    // This helps multi-modal models like Gemini 2.0 prioritize the visual context.
    if (params.productImages && params.productImages.length > 0 && !shouldSkipImage) {
      parts.push({ text: "PRODUCT REFERENCE IMAGE (The product to be preserved):" });
      params.productImages.forEach(img => {
        parts.push(toGenerativePart(img));
      });
    }

    if (params.background) {
      parts.push({ text: "BACKGROUND IMAGE TO USE (The environment to place the product into):" });
      parts.push(toGenerativePart(params.background));
    }

    parts.push({ text: toonPrompt });

    console.log('--- GEMINI REQUEST PAYLOAD ---');
    console.log('Model:', modelName);
    console.log('System Instruction:', systemInstruction);
    console.log('User Prompt (Toon):', toonPrompt);
    console.log('Full Request Parts:', JSON.stringify(parts, null, 2));
    console.log('Number of product images:', params.productImages?.length || 0);
    console.log('Has background:', !!params.background);
    console.log('Seed:', params.seed);
    console.log('Temperature:', params.temperature);
    console.log('-------------------------------');

    try {
      const result = await model.generateContent(parts);
      const response = await result.response;
      
      const imageUrl = extractImageFromResponse(response);
      if (imageUrl) {
        return { imageUrl, systemInstruction, seed: params.seed };
      }

      if (isEmptyResponse(response)) {
         return { imageUrl: getPlaceholderUrl(params.type), systemInstruction, seed: params.seed };
      }
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      const enhancedError: any = new Error(error.message || String(error));
      enhancedError.status = error.status;
      throw enhancedError;
    }

    return { imageUrl: getPlaceholderUrl(params.type), systemInstruction, seed: params.seed };
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
