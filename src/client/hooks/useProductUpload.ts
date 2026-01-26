import { useState } from 'react';

export const useProductUpload = () => {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [lifestyleShotsCount, setLifestyleShotsCount] = useState(0);
  const [heroShotsCount, setHeroShotsCount] = useState(0);
  const [closeUpsCount, setCloseUpsCount] = useState(0);
  const [isPrimaryImage, setIsPrimaryImage] = useState(false);
  const [lifestyleBackground, setLifestyleBackground] = useState<string | null>(null);
  const [heroBackground, setHeroBackground] = useState<string | null>(null);
  const [closeUpsBackground, setCloseUpsBackground] = useState<string | null>(null);

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

  const handleLifestyleBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLifestyleBackground(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroBackground(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseUpsBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCloseUpsBackground(reader.result as string);
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
    lifestyleBackground,
    handleLifestyleBackgroundUpload,
    heroBackground,
    handleHeroBackgroundUpload,
    closeUpsBackground,
    handleCloseUpsBackgroundUpload,
  };
};
