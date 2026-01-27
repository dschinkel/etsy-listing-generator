import { useState, useCallback, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { fetchWithTimeout } from '../lib/utils';

export const useListingGeneration = (listingRepository: any) => {
  const [images, setImages] = useState<string[]>([]);
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [modelUsed, setModelUsed] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setTimedError = (message: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setError(message);
    timeoutRef.current = setTimeout(() => {
      setError(null);
      timeoutRef.current = null;
    }, 5000);
  };

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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setError(null);
    setModelUsed('gemini-3-pro-image-preview');
    try {
      const response = await listingRepository.generateImages({
        ...params,
        model: 'gemini-3-pro-image-preview'
      });
      setImages(response.images);
      setSystemPrompt(response.systemPrompt || '');
      setModelUsed(response.model || 'gemini-3-pro-image-preview');
    } catch (err: any) {
      if (err.systemPrompt) {
        setSystemPrompt(err.systemPrompt);
      }
      if (err.message.includes('503') || err.message.toLowerCase().includes('overloaded')) {
        setError('Gemini 3 Pro Image Preview is overloaded. Retrying with Imagen 4...');
        setModelUsed('imagen-4.0-generate-001');
        try {
          const fallbackResponse = await listingRepository.generateImages({
            ...params,
            model: 'imagen-4.0-generate-001'
          });
          setImages(fallbackResponse.images);
          setSystemPrompt(fallbackResponse.systemPrompt || '');
          setModelUsed(fallbackResponse.model || 'imagen-4.0-generate-001');
          setError(null);
        } catch (fallbackErr: any) {
          if (fallbackErr.systemPrompt) {
            setSystemPrompt(fallbackErr.systemPrompt);
          }
          if (fallbackErr.message.includes('503') || fallbackErr.message.toLowerCase().includes('overloaded')) {
            setError('Imagen 4 is also overloaded. Retrying with GPT Image 1.5...');
            setModelUsed('gpt-image-1.5');
            try {
              const gptResponse = await listingRepository.generateImages({
                ...params,
                model: 'gpt-image-1.5'
              });
              setImages(gptResponse.images);
              setSystemPrompt(gptResponse.systemPrompt || '');
              setModelUsed(gptResponse.model || 'gpt-image-1.5');
              setError(null);
            } catch (gptErr: any) {
              if (gptErr.systemPrompt) {
                setSystemPrompt(gptErr.systemPrompt);
              }
              setTimedError('GPT Image 1.5 also failed. Please try again later.');
              console.error('GPT fallback failed:', gptErr);
            }
          } else {
            setTimedError('Imagen 4 failed. Please try again later.');
            console.error('Fallback failed:', fallbackErr);
          }
        }
      } else {
        setTimedError(`Generation failed: ${err.message}`);
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
      const response = await fetchWithTimeout(imageSrc);
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
      const response = await fetchWithTimeout(src);
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
    modelUsed,
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
