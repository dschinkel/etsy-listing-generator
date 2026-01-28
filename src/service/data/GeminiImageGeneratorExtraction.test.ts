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

  it('skips non-image inline data parts (like metadata)', () => {
    const response = {
      candidates: [
        {
          content: {
            parts: [
              { inlineData: { mimeType: 'application/octet-stream', data: 'METADATA_JUNK' } },
              { inlineData: { mimeType: 'image/jpeg', data: 'REAL_IMAGE_DATA' } }
            ]
          }
        }
      ]
    };

    const result = extractImageFromResponse(response);
    expect(result).toBe('data:image/jpeg;base64,REAL_IMAGE_DATA');
  });

  it('handles data that is already prefixed with data: protocol', () => {
    const prefixedData = 'data:image/png;base64,ALREADY_PREFIXED_DATA';
    const response = {
      candidates: [
        {
          content: {
            parts: [
              { inlineData: { mimeType: 'image/png', data: prefixedData } }
            ]
          }
        }
      ]
    };

    const result = extractImageFromResponse(response);
    // Should NOT be data:image/png;base64,data:image/png;base64,...
    expect(result).toBe(prefixedData);
  });

  it('uses picsum photos as reliable placeholder service', () => {
    const type = 'lifestyle';
    const result = getPlaceholderUrl(type);
    expect(result).toContain('picsum.photos');
    expect(result).toContain(type);
  });
});
