import { useState, useEffect } from 'react';
import { resizeImage } from '../lib/imageUtils';

export interface ContextTemplate {
  name: string;
  text: string;
}

export const useProductUpload = (repository?: any) => {
  const [productImages, setProductImages] = useState<string[]>([]);
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
  const [lifestyleCreateSimilar, setLifestyleCreateSimilar] = useState(false);
  const [heroCreateSimilar, setHeroCreateSimilar] = useState(false);
  const [closeUpsCreateSimilar, setCloseUpsCreateSimilar] = useState(false);
  const [flatLayCreateSimilar, setFlatLayCreateSimilar] = useState(false);
  const [macroCreateSimilar, setMacroCreateSimilar] = useState(false);
  const [contextualCreateSimilar, setContextualCreateSimilar] = useState(false);
  const [themedEnvironmentCreateSimilar, setThemedEnvironmentCreateSimilar] = useState(false);
  const [lifestyleNoImage, setLifestyleNoImage] = useState(false);
  const [heroNoImage, setHeroNoImage] = useState(false);
  const [closeUpsNoImage, setCloseUpsNoImage] = useState(false);
  const [flatLayNoImage, setFlatLayNoImage] = useState(false);
  const [macroNoImage, setMacroNoImage] = useState(false);
  const [contextualNoImage, setContextualNoImage] = useState(false);
  const [themedEnvironmentNoImage, setThemedEnvironmentNoImage] = useState(false);
  const [templates, setTemplates] = useState<ContextTemplate[]>([]);
  const [archivedUploads, setArchivedUploads] = useState<string[]>([]);
  const [archivedInSession, setArchivedInSession] = useState<Set<string>>(new Set());
  const [editSpecifications, setEditSpecifications] = useState<{field: string, value: string}[]>([]);
  const [editCount, setEditCount] = useState(1);

  const totalShots = (lifestyleShotsCount || 0) + (heroShotsCount || 0) + (closeUpsCount || 0) + (flatLayShotsCount || 0) + (macroShotsCount || 0) + (contextualShotsCount || 0) + (themedEnvironmentShotsCount || 0);
  const hasFilledSpecification = editSpecifications.some(spec => spec.value.trim().length > 0);
  const isReadyToGenerate = (totalShots > 0 || hasFilledSpecification) && productImages.length > 0;

  useEffect(() => {
    if (repository) {
      repository.getTemplates().then((response: { templates: ContextTemplate[] }) => {
        setTemplates(response.templates || []);
      });
      repository.getArchivedUploads().then((response: { images: string[] }) => {
        setArchivedUploads(response.images || []);
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

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && productImages.length < 2) {
      try {
        const resized = await resizeImage(file);
        setProductImages(prev => [...prev, resized]);
      } catch (err) {
        console.error('Failed to resize product image:', err);
        // Fallback to original behavior if resizing fails
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleLifestyleBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resized = await resizeImage(file);
        setLifestyleBackground(resized);
      } catch (err) {
        console.error('Failed to resize lifestyle background:', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setLifestyleBackground(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleHeroBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resized = await resizeImage(file);
        setHeroBackground(resized);
      } catch (err) {
        console.error('Failed to resize hero background:', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setHeroBackground(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleCloseUpsBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resized = await resizeImage(file);
        setCloseUpsBackground(resized);
      } catch (err) {
        console.error('Failed to resize close-ups background:', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setCloseUpsBackground(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFlatLayBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resized = await resizeImage(file);
        setFlatLayBackground(resized);
      } catch (err) {
        console.error('Failed to resize flat-lay background:', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setFlatLayBackground(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleMacroBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resized = await resizeImage(file);
        setMacroBackground(resized);
      } catch (err) {
        console.error('Failed to resize macro background:', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setMacroBackground(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleContextualBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resized = await resizeImage(file);
        setContextualBackground(resized);
      } catch (err) {
        console.error('Failed to resize contextual background:', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setContextualBackground(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleThemedEnvironmentBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resized = await resizeImage(file);
        setThemedEnvironmentBackground(resized);
      } catch (err) {
        console.error('Failed to resize themed environment background:', err);
        const reader = new FileReader();
        reader.onloadend = () => {
          setThemedEnvironmentBackground(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
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

  const handleRemoveProductImage = (index: number) => {
    const imageToRemove = productImages[index];
    if (imageToRemove && imageToRemove.startsWith('/src/assets/generated-images/')) {
      repository?.deleteImage(imageToRemove).catch((err: any) => {
        console.error('Failed to delete product image from server:', err);
      });
    }
    setProductImages(prev => prev.filter((_, i) => i !== index));
    setIsPrimaryImage(false);
  };

  const clearPrimaryImage = () => {
    setIsPrimaryImage(false);
  };

  const toggleArchivedUpload = (url: string) => {
    setProductImages(prev => {
      if (prev.includes(url)) {
        return prev.filter(img => img !== url);
      }
      if (prev.length < 2) {
        return [...prev, url];
      }
      return prev;
    });
  };

  const archiveProductImage = async (index: number) => {
    const imageToArchive = productImages[index];
    if (imageToArchive && repository) {
      try {
        await repository.archiveImages([imageToArchive], 'uploads');
        setArchivedInSession(prev => new Set(prev).add(imageToArchive));
      } catch (err: any) {
        console.error('Failed to archive product image:', err);
        alert(`Failed to archive product image: ${err.message}`);
      }
    }
  };

  const isProductImageArchived = (index: number) => {
    const url = productImages[index];
    return url ? archivedInSession.has(url) : false;
  };

  const handleLifestyleCreateSimilarChange = (value: boolean) => setLifestyleCreateSimilar(value);
  const handleHeroCreateSimilarChange = (value: boolean) => setHeroCreateSimilar(value);
  const handleCloseUpsCreateSimilarChange = (value: boolean) => setCloseUpsCreateSimilar(value);
  const handleFlatLayCreateSimilarChange = (value: boolean) => setFlatLayCreateSimilar(value);
  const handleMacroCreateSimilarChange = (value: boolean) => setMacroCreateSimilar(value);
  const handleContextualCreateSimilarChange = (value: boolean) => setContextualCreateSimilar(value);
  const handleThemedEnvironmentCreateSimilarChange = (value: boolean) => setThemedEnvironmentCreateSimilar(value);

  const handleLifestyleNoImageChange = (value: boolean) => setLifestyleNoImage(value);
  const handleHeroNoImageChange = (value: boolean) => setHeroNoImage(value);
  const handleCloseUpsNoImageChange = (value: boolean) => setCloseUpsNoImage(value);
  const handleFlatLayNoImageChange = (value: boolean) => setFlatLayNoImage(value);
  const handleMacroNoImageChange = (value: boolean) => setMacroNoImage(value);
  const handleContextualNoImageChange = (value: boolean) => setContextualNoImage(value);
  const handleThemedEnvironmentNoImageChange = (value: boolean) => setThemedEnvironmentNoImage(value);

  const addEditSpecification = () => {
    setEditSpecifications(prev => [...prev, { field: 'Name', value: '' }]);
  };

  const removeEditSpecification = (index: number) => {
    setEditSpecifications(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditSpecificationChange = (index: number, field: string, value: string) => {
    setEditSpecifications(prev => prev.map((spec, i) => 
      i === index ? { field, value } : spec
    ));
  };

  const handleEditCountChange = (value: number) => {
    setEditCount(Math.max(1, value));
  };

  const clearEditSpecifications = () => {
    setEditSpecifications([]);
  };

  const resetCounts = () => {
    setLifestyleShotsCount(0);
    setHeroShotsCount(0);
    setCloseUpsCount(0);
    setFlatLayShotsCount(0);
    setMacroShotsCount(0);
    setContextualShotsCount(0);
    setThemedEnvironmentShotsCount(0);
    setLifestyleCreateSimilar(false);
    setHeroCreateSimilar(false);
    setCloseUpsCreateSimilar(false);
    setFlatLayCreateSimilar(false);
    setMacroCreateSimilar(false);
    setContextualCreateSimilar(false);
    setThemedEnvironmentCreateSimilar(false);
    setLifestyleNoImage(false);
    setHeroNoImage(false);
    setCloseUpsNoImage(false);
    setFlatLayNoImage(false);
    setMacroNoImage(false);
    setContextualNoImage(false);
    setThemedEnvironmentNoImage(false);
  };

  const selectAllShots = () => {
    setLifestyleShotsCount(prev => prev + 1);
    setHeroShotsCount(prev => prev + 1);
    setCloseUpsCount(prev => prev + 1);
    setFlatLayShotsCount(prev => prev + 1);
    setMacroShotsCount(prev => prev + 1);
    setContextualShotsCount(prev => prev + 1);
    setThemedEnvironmentShotsCount(prev => prev + 1);
  };

  const clearShotCount = (id: string) => {
    switch (id) {
      case 'lifestyle-shots': setLifestyleShotsCount(0); break;
      case 'hero-shots': setHeroShotsCount(0); break;
      case 'close-ups': setCloseUpsCount(0); break;
      case 'flat-lay-shots': setFlatLayShotsCount(0); break;
      case 'macro-shots': setMacroShotsCount(0); break;
      case 'contextual-shots': setContextualShotsCount(0); break;
      case 'themed-environment': setThemedEnvironmentShotsCount(0); break;
    }
  };

  return {
    productImages, 
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
    archiveProductImage,
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
    lifestyleNoImage,
    handleLifestyleNoImageChange,
    heroNoImage,
    handleHeroNoImageChange,
    closeUpsNoImage,
    handleCloseUpsNoImageChange,
    flatLayNoImage,
    handleFlatLayNoImageChange,
    macroNoImage,
    handleMacroNoImageChange,
    contextualNoImage,
    handleContextualNoImageChange,
    themedEnvironmentNoImage,
    handleThemedEnvironmentNoImageChange,
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
    editSpecifications,
    addEditSpecification,
    removeEditSpecification,
    handleEditSpecificationChange,
    clearEditSpecifications,
    editCount,
    handleEditCountChange,
    totalShots,
    isReadyToGenerate,
    lifestyleCreateSimilar,
    handleLifestyleCreateSimilarChange,
    heroCreateSimilar,
    handleHeroCreateSimilarChange,
    closeUpsCreateSimilar,
    handleCloseUpsCreateSimilarChange,
    flatLayCreateSimilar,
    handleFlatLayCreateSimilarChange,
    macroCreateSimilar,
    handleMacroCreateSimilarChange,
    contextualCreateSimilar,
    handleContextualCreateSimilarChange,
    themedEnvironmentCreateSimilar,
    handleThemedEnvironmentCreateSimilarChange,
    archivedUploads,
    toggleArchivedUpload,
    isProductImageArchived,
    selectAllShots,
    clearShotCount,
  };
};
