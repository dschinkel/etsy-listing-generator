import { useState, useCallback } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const useListingGeneration = (listingRepository: any) => {
  const [images, setImages] = useState<string[]>([]);
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateListing = async (params: { 
    lifestyleCount?: number, 
    heroCount?: number,
    closeUpsCount?: number,
    flatLayCount?: number,
    macroCount?: number,
    contextualCount?: number,
    productImage?: string | null,
    lifestyleBackground?: string | null,
    heroBackground?: string | null,
    closeUpsBackground?: string | null,
    flatLayBackground?: string | null,
    macroBackground?: string | null,
    contextualBackground?: string | null
  }) => {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await listingRepository.generateImages({
        ...params,
        model: 'gemini-3-pro-image-preview'
      });
      setImages(response.images);
      setSystemPrompt(response.systemPrompt || '');
    } catch (err: any) {
      if (err.message.includes('503') || err.message.toLowerCase().includes('overloaded')) {
        setError('Gemini 3 Pro Image Preview is overloaded. Retrying with Imagen 4...');
        try {
          const fallbackResponse = await listingRepository.generateImages({
            ...params,
            model: 'imagen-4.0-generate-001'
          });
          setImages(fallbackResponse.images);
          setSystemPrompt(fallbackResponse.systemPrompt || '');
          setError(null);
        } catch (fallbackErr: any) {
          setError('Imagen 4 also failed. Please try again later.');
          console.error('Fallback failed:', fallbackErr);
        }
      } else {
        setError(`Generation failed: ${err.message}`);
        console.error('Generation failed:', err);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const copyImageToClipboard = async (imageSrc: string) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadAllImagesAsZip = async () => {
    const zip = new JSZip();
    
    const downloadPromises = images.map(async (src, index) => {
      const response = await fetch(src);
      const blob = await response.blob();
      const extension = blob.type.split('/')[1] || 'png';
      zip.file(`listing-image-${index + 1}.${extension}`, blob);
    });

    await Promise.all(downloadPromises);
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'listing-images.zip');
  };

  return {
    images,
    systemPrompt,
    error,
    isGenerating,
    generateListing,
    removeImage,
    copyImageToClipboard,
    downloadAllImagesAsZip,
    fetchSystemPromptPreview: useCallback(async (params: any) => {
      try {
        const response = await listingRepository.getSystemPromptPreview(params);
        setSystemPrompt(response.systemPrompt || '');
      } catch (err) {
        console.error('Failed to fetch prompt preview:', err);
      }
    }, [listingRepository])
  };
};
