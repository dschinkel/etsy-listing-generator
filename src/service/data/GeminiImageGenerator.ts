import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT_TEMPLATE = `You are Nano Banana, an image-generation model used to create consistent e-commerce product images.

PRIMARY RULE
- The user will provide a product reference image. That reference image is the single source of truth for the product’s exact geometry, proportions, silhouette, materials, colors, surface finish, branding/marks, and any distinctive details.
- Every generated image MUST depict the SAME product from the reference image. Do not invent a different product.

OUTPUT REQUIREMENTS
- Generate exactly {{COUNT}} images.
- Every image must use the following shot type: {{SHOT_TYPE}}.
- Each image must be a distinct composition/angle/scene variation while still matching the requested shot type.
- Keep the product as the hero subject and in sharp focus.

IDENTITY LOCK (MUST MATCH REFERENCE)
- Do not change the product’s shape (no “soft,” “squishy,” “melted,” “inflated,” or “organic” deformation).
- Do not alter edges/corners, hole placement, icon placement, text/branding, or any functional geometry.
- Do not add/remove features, accessories, labels, or parts unless the user explicitly asks.
- Do not “improve” the design. No redesigns. No stylization that changes form.

MATERIAL / COLOR LOCK
- Match the reference image’s material(s), color(s), and finish exactly.
- If lighting changes cause apparent variation, keep the underlying product color constant.
- No unexpected textures (no leather, wood grain, fabric weave, pores, scratches) unless present in the reference.

COMPOSITION & CAMERA
- Use realistic optics and product-photography conventions.
- Keep camera perspective believable (no extreme fisheye unless the shot type requires it).
- Maintain correct scale and proportions relative to the environment (no miniature/giant product).

LIGHTING
- Use clean, controlled lighting typical of product photography (softboxes, diffused key, gentle fill).
- Ensure readable form with highlights and shadows; avoid harsh clipping.
- No dramatic cinematic lighting unless explicitly requested by {{SHOT_TYPE}}.

BACKGROUND / ENVIRONMENT
- Background must support the product and never distract.
- Keep background elements generic and non-branded (no logos, no recognizable trademarks).
- Avoid clutter. Do not place the product in a busy scene unless {{SHOT_TYPE}} requires a lifestyle setting.
- If {{SHOT_TYPE}} implies a pure studio shot, use seamless/neutral studio backgrounds.

TEXT, LOGOS, WATERMARKS
- Do not add text overlays, captions, badges, watermarks, QR codes, or extra branding.
- Preserve only the product’s existing branding exactly as shown in the reference. Do not invent new text.

QUALITY / TECHNICAL
- High resolution, clean detail, minimal noise.
- Accurate edges (no warping, smearing, or geometry glitches).
- Product must be fully visible unless {{SHOT_TYPE}} explicitly calls for a crop/close-up.

CONSISTENCY ACROSS THE SET
- All {{COUNT}} images must look like they are of the same exact physical item photographed in a coherent style.
- Variations should come from angle, framing, background choice, and lighting nuance—never from changing the product.

FAIL-SAFE BEHAVIOR
- If the shot type would normally require props that might obscure or alter the product, keep props minimal and never cover key features.
- If the model is uncertain about a detail, default to the reference image rather than inventing.

TASK
Generate {{COUNT}} images using shot type: {{SHOT_TYPE}}.
Use the provided product reference image as the product identity anchor in every generation.`;

export class GeminiImageGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    this.genAI = new GoogleGenerativeAI(apiKey);
    // nano banana refers to flash or a specific small model
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async generateImage(params: { type: string; prompt: string; productImage?: string; background?: string; count?: number }): Promise<string> {
    const count = params.count || 1;
    const systemInstruction = SYSTEM_PROMPT_TEMPLATE
      .replace(/{{COUNT}}/g, count.toString())
      .replace(/{{SHOT_TYPE}}/g, params.type);

    const model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: {
        role: "system",
        parts: [{ text: systemInstruction }]
      }
    });

    const toonPrompt = this.buildToonPrompt(params.type, params.prompt);

    const parts: any[] = [toonPrompt];

    if (params.productImage) {
      parts.push(this.toGenerativePart(params.productImage));
    }

    if (params.background) {
      parts.push(this.toGenerativePart(params.background));
    }

    try {
      if (parts.length === 1) {
        const result = await model.generateContent(parts[0]);
        const response = await result.response;
        await response.text();
      } else {
        const result = await model.generateContent(parts);
        const response = await result.response;
        await response.text();
      }
    } catch (error: any) {
      console.error('Gemini API Error details:', JSON.stringify(error, null, 2));
      throw new Error(`Gemini API Error: ${error.message || error}`);
    }

    return `https://placehold.jp/24/cccccc/333333/800x800.png?text=${encodeURIComponent(params.type)}&t=${Date.now()}`;
  }

  private buildToonPrompt(type: string, userPrompt: string): string {
    return `
TOON 1.0
TITLE: Generate ${type} image
PROMPT: ${userPrompt}
TYPE: IMAGE
`;
  }

  private toGenerativePart(dataUrl: string) {
    const base64Data = dataUrl.split(',')[1];
    const mimeType = dataUrl.split(';')[0].split(':')[1];
    return {
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    };
  }
}
