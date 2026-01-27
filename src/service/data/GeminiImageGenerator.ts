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
    // Convert request to TOON format per TR.4.7
    const toonPrompt = `
TOON 1.0
TITLE: Generate ${params.type} image
PROMPT: ${params.prompt}
TYPE: IMAGE
`;

    const parts: any[] = [toonPrompt];

    if (params.productImage) {
      parts.push(this.toGenerativePart(params.productImage));
    }

    if (params.background) {
      parts.push(this.toGenerativePart(params.background));
    }

    const result = await this.model.generateContent(parts.length === 1 ? parts[0] : parts);
    const response = await result.response;
    const text = response.text();
    console.log('Gemini raw response:', text);
    
    // In a real implementation for IMAGE generation, the model might return a URL or base64.
    // For this example, we assume it returns a URL in the text.
    return text.trim();
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
