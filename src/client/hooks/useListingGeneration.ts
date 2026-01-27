import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const useListingGeneration = (listingRepository: any) => {
  const [images, setImages] = useState<string[]>([]);

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
    const response = await listingRepository.generateImages(params);
    setImages(response.images);
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
    generateListing,
    removeImage,
    copyImageToClipboard,
    downloadAllImagesAsZip
  };
};
