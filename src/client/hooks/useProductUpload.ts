import { useState, useEffect } from 'react';

export interface ContextTemplate {
  name: string;
  text: string;
}

export const useProductUpload = (repository?: any) => {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [lifestyleShotsCount, setLifestyleShotsCount] = useState(0);
  const [heroShotsCount, setHeroShotsCount] = useState(0);
  const [closeUpsCount, setCloseUpsCount] = useState(0);
  const [flatLayShotsCount, setFlatLayShotsCount] = useState(0);
  const [macroShotsCount, setMacroShotsCount] = useState(0);
  const [contextualShotsCount, setContextualShotsCount] = useState(0);
  const [themedEnvironmentShotsCount, setThemedEnvironmentShotsCount] = useState(0);
  const [isPrimaryImage, setIsPrimaryImage] = useState(false);
  const [lifestyleBackground, setLifestyleBackground] = useState<string | null>(null);
  const [heroBackground, setHeroBackground] = useState<string | null>(null);
  const [closeUpsBackground, setCloseUpsBackground] = useState<string | null>(null);
  const [flatLayBackground, setFlatLayBackground] = useState<string | null>(null);
  const [macroBackground, setMacroBackground] = useState<string | null>(null);
  const [contextualBackground, setContextualBackground] = useState<string | null>(null);
  const [themedEnvironmentBackground, setThemedEnvironmentBackground] = useState<string | null>(null);
  const [lifestyleCustomContext, setLifestyleCustomContext] = useState('');
  const [heroCustomContext, setHeroCustomContext] = useState('');
  const [closeUpsCustomContext, setCloseUpsCustomContext] = useState('');
  const [flatLayCustomContext, setFlatLayCustomContext] = useState('');
  const [macroCustomContext, setMacroCustomContext] = useState('');
  const [contextualCustomContext, setContextualCustomContext] = useState('');
  const [themedEnvironmentCustomContext, setThemedEnvironmentCustomContext] = useState('');
  const [templates, setTemplates] = useState<ContextTemplate[]>([]);

  const totalShots = lifestyleShotsCount + heroShotsCount + closeUpsCount + flatLayShotsCount + macroShotsCount + contextualShotsCount + themedEnvironmentShotsCount;
  const isReadyToGenerate = totalShots > 0 && productImage !== null;

  useEffect(() => {
    if (repository) {
      repository.getTemplates().then((response: { templates: ContextTemplate[] }) => {
        setTemplates(response.templates || []);
      });
    }
  }, [repository]);

  const saveContextTemplate = async (name: string, text: string) => {
    if (repository) {
      try {
        const response = await repository.saveTemplate({ name, text });
        if (response.template) {
          setTemplates(prev => [...prev, response.template]);
        }
      } catch (err: any) {
        console.error('Failed to save template:', err);
        alert(`Failed to save template: ${err.message}`);
      }
    }
  };

  const removeContextTemplate = async (name: string) => {
    if (repository) {
      try {
        await repository.removeTemplate(name);
        setTemplates(prev => prev.filter(t => t.name !== name));
      } catch (err: any) {
        console.error('Failed to remove template:', err);
        alert(`Failed to remove template: ${err.message}`);
      }
    }
  };

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

  const handleThemedEnvironmentBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThemedEnvironmentBackground(reader.result as string);
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

  const handleThemedEnvironmentShotsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThemedEnvironmentShotsCount(parseInt(event.target.value, 10) || 0);
  };

  const handleLifestyleCustomContextChange = (value: string) => {
    setLifestyleCustomContext(value);
    if (value.trim() && lifestyleShotsCount === 0) {
      setLifestyleShotsCount(1);
    } else if (!value.trim() && lifestyleShotsCount > 0) {
      setLifestyleShotsCount(0);
    }
  };

  const handleHeroCustomContextChange = (value: string) => {
    setHeroCustomContext(value);
    if (value.trim() && heroShotsCount === 0) {
      setHeroShotsCount(1);
    } else if (!value.trim() && heroShotsCount > 0) {
      setHeroShotsCount(0);
    }
  };

  const handleCloseUpsCustomContextChange = (value: string) => {
    setCloseUpsCustomContext(value);
    if (value.trim() && closeUpsCount === 0) {
      setCloseUpsCount(1);
    } else if (!value.trim() && closeUpsCount > 0) {
      setCloseUpsCount(0);
    }
  };

  const handleFlatLayCustomContextChange = (value: string) => {
    setFlatLayCustomContext(value);
    if (value.trim() && flatLayShotsCount === 0) {
      setFlatLayShotsCount(1);
    } else if (!value.trim() && flatLayShotsCount > 0) {
      setFlatLayShotsCount(0);
    }
  };

  const handleMacroCustomContextChange = (value: string) => {
    setMacroCustomContext(value);
    if (value.trim() && macroShotsCount === 0) {
      setMacroShotsCount(1);
    } else if (!value.trim() && macroShotsCount > 0) {
      setMacroShotsCount(0);
    }
  };

  const handleContextualCustomContextChange = (value: string) => {
    setContextualCustomContext(value);
    if (value.trim() && contextualShotsCount === 0) {
      setContextualShotsCount(1);
    } else if (!value.trim() && contextualShotsCount > 0) {
      setContextualShotsCount(0);
    }
  };

  const handleThemedEnvironmentCustomContextChange = (value: string) => {
    setThemedEnvironmentCustomContext(value);
    if (value.trim() && themedEnvironmentShotsCount === 0) {
      setThemedEnvironmentShotsCount(1);
    } else if (!value.trim() && themedEnvironmentShotsCount > 0) {
      setThemedEnvironmentShotsCount(0);
    }
  };

  const handlePrimarySelection = () => {
    setIsPrimaryImage(!isPrimaryImage);
  };

  const handleRemoveProductImage = () => {
    setProductImage(null);
    setIsPrimaryImage(false);
  };

  const clearPrimaryImage = () => {
    setIsPrimaryImage(false);
  };

  const resetCounts = () => {
    setLifestyleShotsCount(0);
    setHeroShotsCount(0);
    setCloseUpsCount(0);
    setFlatLayShotsCount(0);
    setMacroShotsCount(0);
    setContextualShotsCount(0);
    setThemedEnvironmentShotsCount(0);
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
    themedEnvironmentShotsCount,
    handleThemedEnvironmentShotsChange,
    isPrimaryImage,
    handlePrimarySelection,
    clearPrimaryImage,
    resetCounts,
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
    themedEnvironmentBackground,
    handleThemedEnvironmentBackgroundUpload,
    lifestyleCustomContext,
    handleLifestyleCustomContextChange,
    heroCustomContext,
    handleHeroCustomContextChange,
    closeUpsCustomContext,
    handleCloseUpsCustomContextChange,
    flatLayCustomContext,
    handleFlatLayCustomContextChange,
    macroCustomContext,
    handleMacroCustomContextChange,
    contextualCustomContext,
    handleContextualCustomContextChange,
    themedEnvironmentCustomContext,
    handleThemedEnvironmentCustomContextChange,
    templates,
    saveContextTemplate,
    removeContextTemplate,
    totalShots,
    isReadyToGenerate,
  };
};
