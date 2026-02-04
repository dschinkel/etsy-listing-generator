import { useState, useCallback, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { fetchWithTimeout } from '../lib/utils';

export interface ListingImage {
  url: string;
  type: string;
  isPrimary?: boolean;
  isArchived?: boolean;
  isSaved?: boolean;
  seed?: number;
}

export interface SystemPromptVersion {
  version: string;
  date: string;
  template: string;
}

export interface EditPromptVersion {
  version: string;
  template: string;
  lineTemplate: string;
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
    price: '11.99',
    quantity: '10',
    sku: '',
    shop_id: '',
    who_made: 'i_did',
    when_made: 'made_to_order',
    is_supply: false,
    personalization: '',
    category: 'Accessories > Keychains & Lanyards > Keychains',
    tags: '',
    shipping_profile: '',
    product_type: 'physical',
    readiness: 'draft',
    taxonomy_id: '69154'
  });
  const [temperature, setTemperature] = useState<number>(1.0);
  const [promptVersions, setPromptVersions] = useState<SystemPromptVersion[]>([]);
  const [selectedPromptVersion, setSelectedPromptVersion] = useState<string>(() => localStorage.getItem('lastPromptVersion') || '');
  const [editPromptVersions, setEditPromptVersions] = useState<EditPromptVersion[]>([]);
  const [selectedEditPromptVersion, setSelectedEditPromptVersion] = useState<string>(() => localStorage.getItem('lastEditPromptVersion') || '');
  const [selectedModel, setSelectedModel] = useState<string>(() => localStorage.getItem('lastSelectedModel') || 'gemini-3-pro-image-preview');
  const [currentSeeds, setCurrentSeeds] = useState<number[]>([]);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastPromptParamsRef = useRef<string>('');

  useEffect(() => {
    if (listingRepository?.getShopId) {
      listingRepository.getShopId().then((response: { shop_id: string }) => {
        if (response.shop_id) {
          setEtsyFormData(prev => ({ ...prev, shop_id: response.shop_id }));
        }
      });
    }
    if (listingRepository?.getPromptVersions) {
      listingRepository.getPromptVersions().then((response: { versions: SystemPromptVersion[] }) => {
        if (response.versions && response.versions.length > 0) {
          setPromptVersions(response.versions);
          if (!selectedPromptVersion || !response.versions.some(v => v.version === selectedPromptVersion)) {
            setSelectedPromptVersion(response.versions[response.versions.length - 1].version);
          }
        }
      });
    }
    if (listingRepository?.getEditPromptVersions) {
      listingRepository.getEditPromptVersions().then((response: { versions: EditPromptVersion[] }) => {
        if (response.versions && response.versions.length > 0) {
          setEditPromptVersions(response.versions);
          if (!selectedEditPromptVersion || !response.versions.some(v => v.version === selectedEditPromptVersion)) {
            setSelectedEditPromptVersion(response.versions[0].version); 
          }
        }
      });
    }
  }, [listingRepository]);

  useEffect(() => {
    if (selectedPromptVersion) {
      localStorage.setItem('lastPromptVersion', selectedPromptVersion);
    }
  }, [selectedPromptVersion]);

  useEffect(() => {
    if (selectedEditPromptVersion) {
      localStorage.setItem('lastEditPromptVersion', selectedEditPromptVersion);
    }
  }, [selectedEditPromptVersion]);

  useEffect(() => {
    if (selectedModel) {
      localStorage.setItem('lastSelectedModel', selectedModel);
    }
  }, [selectedModel]);

  const currentTemplate = promptVersions.find(v => v.version === selectedPromptVersion)?.template;
  const currentEditTemplate = editPromptVersions.find(v => v.version === selectedEditPromptVersion)?.template;
  const currentEditLineTemplate = editPromptVersions.find(v => v.version === selectedEditPromptVersion)?.lineTemplate;

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
    lifestyleNoImage?: boolean,
    heroNoImage?: boolean,
    closeUpsNoImage?: boolean,
    flatLayNoImage?: boolean,
    macroNoImage?: boolean,
    contextualNoImage?: boolean,
    themedEnvironmentNoImage?: boolean,
    lifestyleCustomContext?: string,
    heroCustomContext?: string,
    closeUpsCustomContext?: string,
    flatLayCustomContext?: string,
    macroCustomContext?: string,
    contextualCustomContext?: string,
    themedEnvironmentCustomContext?: string,
    lifestyleCreateSimilar?: boolean,
    heroCreateSimilar?: boolean,
    closeUpsCreateSimilar?: boolean,
    flatLayCreateSimilar?: boolean,
    macroCreateSimilar?: boolean,
    contextualCreateSimilar?: boolean,
    themedEnvironmentCreateSimilar?: boolean,
    editSpecifications?: {field: string, value: string}[],
    editCount?: number
  }) => {
    setIsGenerating(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setError(null);

    // Pre-generate seeds for immediate display
    const seeds: number[] = [];
    const addSeedsForType = (count?: number) => {
      if (count && count > 0) {
        for (let i = 0; i < count; i++) {
          seeds.push(Math.floor(Math.random() * 2147483647));
        }
      }
    };

    addSeedsForType(params.lifestyleCount);
    addSeedsForType(params.heroCount);
    addSeedsForType(params.closeUpsCount);
    addSeedsForType(params.flatLayCount);
    addSeedsForType(params.macroCount);
    addSeedsForType(params.contextualCount);
    addSeedsForType(params.themedEnvironmentCount);
    if (params.editSpecifications && params.editSpecifications.length > 0) {
      addSeedsForType(params.editCount || 1);
    }

    setCurrentSeeds(seeds);
    
    let currentModel = selectedModel;
    let success = false;

    while (!success) {
      setModelUsed(currentModel);
      try {
        const response = await listingRepository.generateImages({
          ...params,
          temperature,
          model: currentModel,
          systemPromptTemplate: currentTemplate,
          editPromptTemplate: currentEditTemplate,
          editPromptLineTemplate: currentEditLineTemplate,
          seeds: seeds.length > 0 ? seeds : undefined,
          noFallback: true
        });
        setImages(prev => [...prev, ...response.images]);
        setSystemPrompt(response.systemPrompt || '');
        
        // Mark these parameters as the last used for the current prompt
        lastPromptParamsRef.current = JSON.stringify({ ...params, template: currentTemplate, editTemplate: currentEditTemplate });
        
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
    setCurrentSeeds([]);
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
      let finalSrc = imageSrc;
      const currentImage = images[index];
      
      // If downloading an unsaved image, it might be a data URL already
      // or we might want to save it first if it's an external URL?
      // Actually, browser can download data URLs or external URLs just fine.
      
      const response = await fetchWithTimeout(finalSrc);
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
          return;
        }

        const extension = blob.type.split('/')[1]?.split(';')[0] || 'png';
        zip.file(`listing-image-${index + 1}.${extension}`, blob);
      } catch (err) {
        console.error(`Failed to include image ${index + 1} in ZIP:`, err);
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
      // Ensure all images are saved first
      const imagesToArchive = await Promise.all(images.map(async (img, idx) => {
        if (!img.isSaved) {
          const response = await listingRepository.saveImage(img.url, img.type);
          return response.url;
        }
        return img.url;
      }));

      await listingRepository.archiveImages(imagesToArchive);
      setImages(prev => prev.map((img, idx) => ({ 
        ...img, 
        url: imagesToArchive[idx],
        isSaved: true,
        isArchived: true 
      })));
    } catch (err: any) {
      console.error('Failed to archive images:', err);
      setTimedError(`Archiving failed: ${err.message}`);
    }
  };

  const archiveImage = async (index: number) => {
    const imageToArchive = images[index];
    if (!imageToArchive) return;

    try {
      let urlToArchive = imageToArchive.url;
      let wasSaved = imageToArchive.isSaved;

      if (!wasSaved) {
        const response = await listingRepository.saveImage(imageToArchive.url, imageToArchive.type);
        urlToArchive = response.url;
      }

      await listingRepository.archiveImages([urlToArchive]);
      setImages(prev => prev.map((img, i) => 
        i === index ? { ...img, url: urlToArchive, isSaved: true, isArchived: true } : img
      ));
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
    
    try {
      // Ensure all images that are being published are saved first
      // If selectedImageUrls is provided, we need to map it back to our images to check isSaved
      // But usually it's easier to just ensure all current images are saved if we're publishing them
      
      const savedImages = await Promise.all(images.map(async (img, idx) => {
        if (!img.isSaved) {
          const response = await listingRepository.saveImage(img.url, img.type);
          return { ...img, url: response.url, isSaved: true };
        }
        return img;
      }));
      
      setImages(savedImages);
      
      const imageList = selectedImageUrls 
        ? selectedImageUrls.map(url => {
            const found = savedImages.find(img => img.url === url || (img as any).oldUrl === url);
            return found ? found.url : url;
          })
        : savedImages.map(img => img.url);
    
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
    setModelUsed(selectedModel);
    setError(null);

    const updatedSystemPrompt = systemPrompt ? `${systemPrompt}\n${customContext}` : customContext;

    try {
      const response = await listingRepository.generateSingleImage({
        type: imageToReplace.type,
        customContext,
        productImages,
        model: selectedModel,
        systemPrompt: updatedSystemPrompt,
        systemPromptTemplate: currentTemplate,
        temperature
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

        // We don't update lastPromptParamsRef here because regenerateImage is specific to one image
        // and uses a combined customContext that isn't part of the main batch params.
        // This ensures that if batch params change later, we still get a fresh batch preview.

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

  const saveImage = async (index: number) => {
    const imageToSave = images[index];
    if (!imageToSave || imageToSave.isSaved) return;

    try {
      const response = await listingRepository.saveImage(imageToSave.url, imageToSave.type);
      if (response.url) {
        setImages(prev => prev.map((img, i) => 
          i === index ? { ...img, url: response.url, isSaved: true } : img
        ));
      }
    } catch (err: any) {
      console.error('Failed to save image:', err);
      setTimedError(`Saving failed: ${err.message}`);
    }
  };

  const fetchSystemPromptPreview = useCallback(async (params: {
    lifestyleCount?: number, 
    heroCount?: number,
    closeUpsCount?: number,
    flatLayCount?: number,
    macroCount?: number,
    contextualCount?: number,
    themedEnvironmentCount?: number,
    lifestyleCustomContext?: string,
    heroCustomContext?: string,
    closeUpsCustomContext?: string,
    flatLayCustomContext?: string,
    macroCustomContext?: string,
    contextualCustomContext?: string,
    themedEnvironmentCustomContext?: string,
    editSpecifications?: {field: string, value: string}[],
    editCount?: number
  }) => {
    if (isGenerating || regeneratingIndex !== null) return;
    
    // Check if parameters have changed
    const paramsKey = JSON.stringify({ ...params, template: currentTemplate, editTemplate: currentEditTemplate });
    if (paramsKey === lastPromptParamsRef.current) return;
    
    try {
      const response = await listingRepository.getSystemPromptPreview({
        ...params,
        systemPromptTemplate: currentTemplate,
        editPromptTemplate: currentEditTemplate,
        editPromptLineTemplate: currentEditLineTemplate
      });
      setSystemPrompt(response.systemPrompt || '');
      lastPromptParamsRef.current = paramsKey;
    } catch (err) {
      console.error('Failed to fetch prompt preview:', err);
    }
  }, [listingRepository, currentTemplate, currentEditTemplate, currentEditLineTemplate, isGenerating, regeneratingIndex]);

  const saveEditPromptVersion = async (version: EditPromptVersion) => {
    if (listingRepository) {
      try {
        const response = await listingRepository.saveEditPromptVersion(version);
        if (response.version) {
          setEditPromptVersions(prev => {
            const index = prev.findIndex(v => v.version === response.version.version);
            if (index !== -1) {
              const newVersions = [...prev];
              newVersions[index] = response.version;
              return newVersions;
            }
            return [...prev, response.version];
          });
          setSelectedEditPromptVersion(response.version.version);
        }
      } catch (err: any) {
        console.error('Failed to save edit prompt version:', err);
        setTimedError(`Failed to save edit prompt version: ${err.message}`);
      }
    }
  };

  const addManualImages = (imageUrls: string[]) => {
    const manualImages = imageUrls.map(url => ({
      url,
      type: 'manual',
      isSaved: false
    }));
    setImages(prev => [...prev, ...manualImages]);
  };

  const removeEditPromptVersion = async (name: string) => {
    if (listingRepository) {
      try {
        await listingRepository.removeEditPromptVersion(name);
        setEditPromptVersions(prev => prev.filter(v => v.version !== name));
        if (selectedEditPromptVersion === name) {
          setSelectedEditPromptVersion(editPromptVersions[0]?.version || '');
        }
      } catch (err: any) {
        console.error('Failed to remove edit prompt version:', err);
        setTimedError(`Failed to remove edit prompt version: ${err.message}`);
      }
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
    saveImage,
    downloadImage,
    downloadAllImagesAsZip,
    archiveAllImages,
    archiveImage,
    etsyFormData,
    isPublishing,
    publishUrl,
    temperature,
    setTemperature,
    promptVersions,
    selectedPromptVersion,
    setSelectedPromptVersion,
    editPromptVersions,
    selectedEditPromptVersion,
    setSelectedEditPromptVersion,
    saveEditPromptVersion,
    addManualImages,
    removeEditPromptVersion,
    selectedModel,
    setSelectedModel,
    updateEtsyFormData,
    publishToEtsy,
    currentSeeds,
    fetchSystemPromptPreview
  };
};
