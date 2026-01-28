import { extractImageFromResponse, getPlaceholderUrl } from './GeminiImageGenerator';

describe('Gemini Image Extraction', () => {
  it('prioritizes inline data over text URLs', () => {
    const response = {
      candidates: [
        {
          content: {
            parts: [
              { text: 'Check out this link: https://google.com' },
              { inlineData: { mimeType: 'image/png', data: 'VALID_BASE64_DATA' } }
            ]
          }
        }
      ]
    };

    const result = extractImageFromResponse(response);
    expect(result).toBe('data:image/png;base64,VALID_BASE64_DATA');
  });

  it('cleans base64 data by removing whitespaces', () => {
    const response = {
      candidates: [
        {
          content: {
            parts: [
              { inlineData: { mimeType: 'image/png', data: ' VALID\nBASE64\nDATA ' } }
            ]
          }
        }
      ]
    };

    const result = extractImageFromResponse(response);
    expect(result).toBe('data:image/png;base64,VALIDBASE64DATA');
  });

  it('only picks text URLs that look like images', () => {
    const response = {
      candidates: [
        {
          content: {
            parts: [
              { text: 'Not an image: https://google.com' },
              { text: 'Is an image: https://example.com/image.png' }
            ]
          }
        }
      ]
    };

    const result = extractImageFromResponse(response);
    expect(result).toBe('https://example.com/image.png');
  });

  it('uses picsum photos as reliable placeholder service', () => {
    const type = 'lifestyle';
    const result = getPlaceholderUrl(type);
    expect(result).toContain('picsum.photos');
    expect(result).toContain(type);
  });
});
