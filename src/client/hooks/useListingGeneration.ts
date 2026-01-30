import { useState, useCallback, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { fetchWithTimeout } from '../lib/utils';

export interface ListingImage {
  url: string;
  type: string;
  isPrimary?: boolean;
  isArchived?: boolean;
}

export const useListingGeneration = (listingRepository: any) => {
  const [images, setImages] = useState<ListingImage[]>([]);
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [modelUsed, setModelUsed] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishUrl, setPublishUrl] = useState<string | null>(null);
  const [etsyFormData, setEtsyFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: '1',
    shop_id: '',
    who_made: 'i_did',
    when_made: 'made_to_order',
    is_supply: false
  });
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (listingRepository?.getShopId) {
      listingRepository.getShopId().then((response: { shop_id: string }) => {
        if (response.shop_id) {
          setEtsyFormData(prev => ({ ...prev, shop_id: response.shop_id }));
        }
      });
    }
  }, [listingRepository]);

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
    productImages?: string[],
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
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      return newImages;
    });
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
      isPrimary: i === index ? !img.isPrimary : false
    })));
  };

  const clearPrimaryImage = () => {
    setImages(prev => prev.map(img => ({
      ...img,
      isPrimary: false
    })));
  };

  const archiveAllImages = async () => {
    try {
      const imageUrls = images.map(img => img.url);
      await listingRepository.archiveImages(imageUrls);
      setImages(prev => prev.map(img => ({ ...img, isArchived: true })));
    } catch (err: any) {
      console.error('Failed to archive images:', err);
      setTimedError(`Archiving failed: ${err.message}`);
    }
  };

  const archiveImage = async (index: number) => {
    const imageToArchive = images[index];
    if (!imageToArchive) return;

    try {
      await listingRepository.archiveImages([imageToArchive.url]);
      setImages(prev => prev.map((img, i) => i === index ? { ...img, isArchived: true } : img));
    } catch (err: any) {
      console.error('Failed to archive individual image:', err);
      setTimedError(`Archiving failed: ${err.message}`);
    }
  };

  const updateEtsyFormData = (field: string, value: any) => {
    setEtsyFormData(prev => ({ ...prev, [field]: value }));
  };

  const publishToEtsy = async (selectedImageUrls?: string[]) => {
    setIsPublishing(true);
    setError(null);
    setPublishUrl(null);
    
    // Default to all current images if none specified
    const imageList = selectedImageUrls || images.map(img => img.url);
    
    try {
      const response = await listingRepository.publishListing({
        ...etsyFormData,
        images: imageList
      });
      if (response.url) {
        setPublishUrl(response.url);
      }
    } catch (err: any) {
      console.error('Publishing failed:', err);
      setError(`Publishing failed: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const regenerateImage = async (index: number, customContext: string, productImages?: string[]) => {
    const imageToReplace = images[index];
    if (!imageToReplace) return;

    setIsGenerating(true);
    setRegeneratingIndex(index);
    setModelUsed('gemini-2.5-flash-image');
    setError(null);

    const updatedSystemPrompt = systemPrompt ? `${systemPrompt}\n${customContext}` : customContext;

    try {
      const response = await listingRepository.generateSingleImage({
        type: imageToReplace.type,
        customContext,
        productImages,
        model: 'gemini-2.5-flash-image',
        systemPrompt: updatedSystemPrompt
      });

      if (response.image) {
        // Delete the old image from the server
        listingRepository.deleteImage(imageToReplace.url).catch((err: any) => {
          console.error('Failed to delete old image during regeneration:', err);
        });

        // Replace the image in the state
        setImages(prev => {
          const newImages = [...prev];
          newImages[index] = response.image;
          return newImages;
        });
        
        if (response.systemPrompt) {
          setSystemPrompt(response.systemPrompt);
        } else {
          setSystemPrompt(updatedSystemPrompt);
        }

        if (response.model) {
          setModelUsed(response.model);
        }
      }
    } catch (err: any) {
      console.error('Regeneration failed:', err);
      setError(`Regeneration failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
      setRegeneratingIndex(null);
    }
  };

  return {
    images,
    systemPrompt,
    modelUsed,
    error,
    isGenerating,
    regeneratingIndex,
    generateListing, 
    removeImage, 
    clearImages,
    setPrimaryImage,
    clearPrimaryImage,
    regenerateImage,
    downloadImage,
    downloadAllImagesAsZip,
    archiveAllImages,
    archiveImage,
    etsyFormData,
    isPublishing,
    publishUrl,
    updateEtsyFormData,
    publishToEtsy,
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
