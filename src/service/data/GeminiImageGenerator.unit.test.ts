import { createGeminiImageGenerator } from './GeminiImageGenerator';
import { GoogleGenerativeAI } from "@google/generative-ai";

jest.mock("@google/generative-ai");

describe('Gemini Image Generator (Unit)', () => {
  it('passes temperature to generationConfig', async () => {
    const mockGenerateContent = jest.fn().mockResolvedValue({
      response: {
        candidates: [{ content: { parts: [{ text: 'some image' }] } }]
      }
    });

    const mockGetGenerativeModel = jest.fn().mockReturnValue({
      generateContent: mockGenerateContent
    });

    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel
    }));

    const generator = createGeminiImageGenerator();
    await generator.generateImage({ 
      type: 'lifestyle', 
      temperature: 0.8 
    });

    expect(mockGetGenerativeModel).toHaveBeenCalledWith(expect.objectContaining({
      generationConfig: expect.objectContaining({
        temperature: 0.8
      })
    }));
  });
});
