import { useState } from 'react';

export interface ListingImage {
  url: string;
  type: string;
}

export const useListingPreview = () => {
  const [selectedImage, setSelectedImage] = useState<ListingImage | null>(null);

  const openImage = (image: ListingImage) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  return {
    selectedImage,
    isModalOpen: !!selectedImage,
    openImage,
    closeImage,
  };
};
