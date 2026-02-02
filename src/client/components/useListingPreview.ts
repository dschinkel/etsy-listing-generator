import { useState } from 'react';

export interface ListingImage {
  url: string;
  type: string;
}

export const useListingPreview = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openImage = (index: number) => {
    setSelectedIndex(index);
  };

  const closeImage = () => {
    setSelectedIndex(null);
  };

  return {
    selectedIndex,
    isModalOpen: selectedIndex !== null,
    openImage,
    closeImage,
  };
};
