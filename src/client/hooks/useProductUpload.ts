import { useState } from 'react';

export const useProductUpload = () => {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [lifestyleShotsCount, setLifestyleShotsCount] = useState(0);
  const [heroShotsCount, setHeroShotsCount] = useState(0);
  const [closeUpsCount, setCloseUpsCount] = useState(0);
  const [flatLayShotsCount, setFlatLayShotsCount] = useState(0);
  const [macroShotsCount, setMacroShotsCount] = useState(0);
  const [contextualShotsCount, setContextualShotsCount] = useState(0);
  const [isPrimaryImage, setIsPrimaryImage] = useState(false);
  const [lifestyleBackground, setLifestyleBackground] = useState<string | null>(null);
  const [heroBackground, setHeroBackground] = useState<string | null>(null);
  const [closeUpsBackground, setCloseUpsBackground] = useState<string | null>(null);
  const [flatLayBackground, setFlatLayBackground] = useState<string | null>(null);
  const [macroBackground, setMacroBackground] = useState<string | null>(null);
  const [contextualBackground, setContextualBackground] = useState<string | null>(null);

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

  const handleFlatLayBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFlatLayBackground(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMacroBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMacroBackground(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContextualBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContextualBackground(reader.result as string);
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

  const handleFlatLayShotsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFlatLayShotsCount(parseInt(event.target.value, 10) || 0);
  };

  const handleMacroShotsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMacroShotsCount(parseInt(event.target.value, 10) || 0);
  };

  const handleContextualShotsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContextualShotsCount(parseInt(event.target.value, 10) || 0);
  };

  const handlePrimarySelection = () => {
    setIsPrimaryImage(!isPrimaryImage);
  };

  const handleRemoveProductImage = () => {
    setProductImage(null);
    setIsPrimaryImage(false);
  };

  return {
    productImage,
    handleUpload,
    handleRemoveProductImage,
    lifestyleShotsCount,
    handleLifestyleShotsChange,
    heroShotsCount,
    handleHeroShotsChange,
    closeUpsCount,
    handleCloseUpsChange,
    flatLayShotsCount,
    handleFlatLayShotsChange,
    macroShotsCount,
    handleMacroShotsChange,
    contextualShotsCount,
    handleContextualShotsChange,
    isPrimaryImage,
    handlePrimarySelection,
    lifestyleBackground,
    handleLifestyleBackgroundUpload,
    heroBackground,
    handleHeroBackgroundUpload,
    closeUpsBackground,
    handleCloseUpsBackgroundUpload,
    flatLayBackground,
    handleFlatLayBackgroundUpload,
    macroBackground,
    handleMacroBackgroundUpload,
    contextualBackground,
    handleContextualBackgroundUpload,
  };
};
