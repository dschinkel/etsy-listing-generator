import { useState, useCallback, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { fetchWithTimeout } from '../lib/utils';

export interface ListingImage {
  url: string;
  type: string;
  isPrimary?: boolean;
}

export const useListingGeneration = (listingRepository: any) => {
  const [images, setImages] = useState<ListingImage[]>([]);
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
    themedEnvironmentCount?: number,
    productImage?: string | null,
    lifestyleBackground?: string | null,
    heroBackground?: string | null,
    closeUpsBackground?: string | null,
    flatLayBackground?: string | null,
    macroBackground?: string | null,
    contextualBackground?: string | null,
    themedEnvironmentBackground?: string | null,
    lifestyleCustomContext?: string,
    heroCustomContext?: string,
    closeUpsCustomContext?: string,
    flatLayCustomContext?: string,
    macroCustomContext?: string,
    contextualCustomContext?: string,
    themedEnvironmentCustomContext?: string
  }) => {
    setIsGenerating(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setError(null);
    
    let currentModel = 'gemini-2.5-flash-image';
    let success = false;

    while (!success) {
      setModelUsed(currentModel);
      try {
        const response = await listingRepository.generateImages({
          ...params,
          model: currentModel,
          noFallback: true
        });
        setImages(prev => [...prev, ...response.images]);
        setSystemPrompt(response.systemPrompt || '');
        setModelUsed(response.model || currentModel);
        success = true;
      } catch (err: any) {
        console.log('Generation failed for model:', currentModel, err.message);
        if (err.systemPrompt) {
          setSystemPrompt(err.systemPrompt);
        }

          if (err.retryable && err.nextModel) {
          setTimedError(`Model ${currentModel} failed: ${err.message}. Retrying with ${err.nextModel}...`);
          // Brief delay to allow UI to show retry status and avoid hammering the backend
          await new Promise(resolve => setTimeout(resolve, 2000));
          currentModel = err.nextModel;
          setError(null); 
        } else {
          const errorMessage = err.name === 'AbortError' || err.message.includes('aborted') 
            ? 'Generation timed out. Please try again with fewer images or wait longer.'
            : `Generation failed: ${err.message}`;
          setTimedError(errorMessage);
          break;
        }
      }
    }
    setIsGenerating(false);
  };

  const removeImage = (index: number) => {
    const imageToDelete = images[index];
    if (imageToDelete) {
      listingRepository.deleteImage(imageToDelete.url).catch((err: any) => {
        console.error('Failed to delete image from server:', err);
      });
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const downloadImage = async (imageSrc: string, index: number) => {
    try {
      const response = await fetchWithTimeout(imageSrc);
      const blob = await response.blob();
      const extension = blob.type.split('/')[1]?.split(';')[0] || 'png';
      saveAs(blob, `listing-image-${index + 1}.${extension}`);
    } catch (err) {
      console.error('Failed to download image: ', err);
    }
  };

  const downloadAllImagesAsZip = async () => {
    const zip = new JSZip();
    
    const downloadingImages = images.map(async (image, index) => {
      try {
        const response = await fetchWithTimeout(image.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        
        if (!blob.type.startsWith('image/')) {
          console.error(`Downloaded content for image ${index + 1} is not an image: ${blob.type}`);
          // If we got HTML or something else, skip it or use a placeholder
          return;
        }

        const extension = blob.type.split('/')[1]?.split(';')[0] || 'png';
        zip.file(`listing-image-${index + 1}.${extension}`, blob);
      } catch (err) {
        console.error(`Failed to include image ${index + 1} in ZIP:`, err);
        // We skip failed images to ensure the ZIP is still generated with what we have
      }
    });

    await Promise.all(downloadingImages);
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'listing-images.zip');
  };

  const clearImages = () => {
    images.forEach(image => {
      listingRepository.deleteImage(image.url).catch((err: any) => {
        console.error('Failed to delete image from server during clear all:', err);
      });
    });
    setImages([]);
  };

  const setPrimaryImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isPrimary: i === index
    })));
  };

  const clearPrimaryImage = () => {
    setImages(prev => prev.map(img => ({
      ...img,
      isPrimary: false
    })));
  };

  return {
    images,
    systemPrompt,
    modelUsed,
    error,
    isGenerating,
    generateListing,
    removeImage, 
    clearImages,
    setPrimaryImage,
    clearPrimaryImage,
    downloadImage,
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
