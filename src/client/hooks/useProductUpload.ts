import { useState } from 'react';

export const useProductUpload = () => {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [lifestyleShotsCount, setLifestyleShotsCount] = useState(0);
  const [heroShotsCount, setHeroShotsCount] = useState(0);
  const [closeUpsCount, setCloseUpsCount] = useState(0);
  const [isPrimaryImage, setIsPrimaryImage] = useState(false);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLifestyleShotsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLifestyleShotsCount(parseInt(event.target.value, 10) || 0);
  };

  const handleHeroShotsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeroShotsCount(parseInt(event.target.value, 10) || 0);
  };

  const handleCloseUpsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCloseUpsCount(parseInt(event.target.value, 10) || 0);
  };

  const handlePrimarySelection = () => {
    setIsPrimaryImage(!isPrimaryImage);
  };

  return {
    productImage,
    handleUpload,
    lifestyleShotsCount,
    handleLifestyleShotsChange,
    heroShotsCount,
    handleHeroShotsChange,
    closeUpsCount,
    handleCloseUpsChange,
    isPrimaryImage,
    handlePrimarySelection,
  };
};
