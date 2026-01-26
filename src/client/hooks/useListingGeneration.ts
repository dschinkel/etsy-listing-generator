import { useState } from 'react';

export const useListingGeneration = (listingRepository: any) => {
  const [images, setImages] = useState<string[]>([]);

  const generateListing = async (params: { lifestyleCount: number, productImage?: string | null }) => {
    const generatedImages = await listingRepository.generateImages(params);
    setImages(generatedImages);
  };

  return {
    images,
    generateListing
  };
};
