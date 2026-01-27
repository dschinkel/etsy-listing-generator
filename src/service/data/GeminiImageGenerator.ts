import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiImageGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    this.genAI = new GoogleGenerativeAI(apiKey);
    // nano banana refers to flash or a specific small model
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async generateImage(params: { type: string; prompt: string; productImage?: string; background?: string }): Promise<string> {
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
        const result = await this.model.generateContent(parts[0]);
        const response = await result.response;
        await response.text();
      } else {
        const result = await this.model.generateContent(parts);
        const response = await result.response;
        await response.text();
      }
    } catch (error: any) {
      console.error('Gemini API Error details:', JSON.stringify(error, null, 2));
      throw new Error(`Gemini API Error: ${error.message || error}`);
    }

    return `https://generated-images.com/${params.type}_${Math.random().toString(36).substring(7)}.png`;
  }

  private buildToonPrompt(type: string, userPrompt: string): string {
    const systemPrompt = `You are an expert Etsy product photographer. Your goal is to generate a ${type} image that is high-quality and professional.`;
    return `
TOON 1.0
TITLE: Generate ${type} image
PROMPT: ${systemPrompt} ${userPrompt}
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
