import React from 'react';
import { useProductUpload } from './hooks/useProductUpload';

const App = () => {
  const { 
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
    handleCloseUpsBackgroundUpload
  } = useProductUpload();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900">
      <Title />
      <UploadImage onUpload={handleUpload} />
      <ImageGenerationConfig 
        lifestyleShotsCount={lifestyleShotsCount}
        onLifestyleShotsChange={handleLifestyleShotsChange}
        heroShotsCount={heroShotsCount}
        onHeroShotsChange={handleHeroShotsChange}
        closeUpsCount={closeUpsCount}
        onCloseUpsChange={handleCloseUpsChange}
      />
      <BackgroundUploads 
        onLifestyleBackgroundUpload={handleLifestyleBackgroundUpload}
        lifestyleBackground={lifestyleBackground}
        onHeroBackgroundUpload={handleHeroBackgroundUpload}
        heroBackground={heroBackground}
        onCloseUpsBackgroundUpload={handleCloseUpsBackgroundUpload}
        closeUpsBackground={closeUpsBackground}
      />
      <UploadedImage 
        src={productImage} 
        isPrimary={isPrimaryImage}
        onSelectPrimary={handlePrimarySelection}
      />
    </div>
  );
};

const Title = () => {
  return <h1 className="text-3xl font-bold mb-8">Etsy Listing Generator</h1>;
};

const UploadImage = ({ onUpload }: { onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg">
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={onUpload}
        data-testid="product-image-upload"
      />
    </div>
  );
};

const ImageGenerationConfig = ({ 
  lifestyleShotsCount, 
  onLifestyleShotsChange,
  heroShotsCount,
  onHeroShotsChange,
  closeUpsCount,
  onCloseUpsChange
}: { 
  lifestyleShotsCount: number, 
  onLifestyleShotsChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  heroShotsCount: number,
  onHeroShotsChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  closeUpsCount: number,
  onCloseUpsChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow border border-slate-200">
      <h2 className="text-lg font-semibold mb-4">Image Generation Configuration</h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="lifestyle-shots" className="text-sm font-medium">Lifestyle Shots</label>
          <input
            id="lifestyle-shots"
            type="number"
            min="0"
            value={lifestyleShotsCount}
            onChange={onLifestyleShotsChange}
            data-testid="lifestyle-shots-count"
            className="w-20 p-1 border rounded"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="hero-shots" className="text-sm font-medium">Hero Shots</label>
          <input
            id="hero-shots"
            type="number"
            min="0"
            value={heroShotsCount}
            onChange={onHeroShotsChange}
            data-testid="hero-shots-count"
            className="w-20 p-1 border rounded"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="close-ups" className="text-sm font-medium">Close-ups</label>
          <input
            id="close-ups"
            type="number"
            min="0"
            value={closeUpsCount}
            onChange={onCloseUpsChange}
            data-testid="close-ups-count"
            className="w-20 p-1 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

const BackgroundUploads = ({ 
  onLifestyleBackgroundUpload, 
  lifestyleBackground,
  onHeroBackgroundUpload,
  heroBackground,
  onCloseUpsBackgroundUpload,
  closeUpsBackground
}: { 
  onLifestyleBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  lifestyleBackground: string | null,
  onHeroBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  heroBackground: string | null,
  onCloseUpsBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  closeUpsBackground: string | null
}) => {
  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow border border-slate-200 w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">Background Uploads</h2>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="lifestyle-background" className="text-sm font-medium">Lifestyle Background</label>
          <input
            id="lifestyle-background"
            type="file"
            accept="image/png, image/jpeg"
            onChange={onLifestyleBackgroundUpload}
            data-testid="lifestyle-background-upload"
            className="text-sm"
          />
          {lifestyleBackground && (
            <img 
              src={lifestyleBackground} 
              alt="Lifestyle Background" 
              data-testid="uploaded-lifestyle-background"
              className="w-20 h-20 object-cover rounded shadow"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="hero-background" className="text-sm font-medium">Hero Background</label>
          <input
            id="hero-background"
            type="file"
            accept="image/png, image/jpeg"
            onChange={onHeroBackgroundUpload}
            data-testid="hero-background-upload"
            className="text-sm"
          />
          {heroBackground && (
            <img 
              src={heroBackground} 
              alt="Hero Background" 
              data-testid="uploaded-hero-background"
              className="w-20 h-20 object-cover rounded shadow"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="close-ups-background" className="text-sm font-medium">Close-ups Background</label>
          <input
            id="close-ups-background"
            type="file"
            accept="image/png, image/jpeg"
            onChange={onCloseUpsBackgroundUpload}
            data-testid="close-ups-background-upload"
            className="text-sm"
          />
          {closeUpsBackground && (
            <img 
              src={closeUpsBackground} 
              alt="Close-ups Background" 
              data-testid="uploaded-close-ups-background"
              className="w-20 h-20 object-cover rounded shadow"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const UploadedImage = ({ 
  src, 
  isPrimary, 
  onSelectPrimary 
}: { 
  src: string | null, 
  isPrimary: boolean, 
  onSelectPrimary: () => void 
}) => {
  if (!src) return null;

  return (
    <div className="mt-8 flex flex-col items-center gap-4">
      <img
        src={src}
        alt="Product"
        data-testid="uploaded-product-image"
        className="max-w-xs rounded shadow-lg"
      />
      <div className="flex items-center gap-2">
        <input
          id="primary-image"
          type="checkbox"
          checked={isPrimary}
          onChange={onSelectPrimary}
          data-testid="set-primary-image"
        />
        <label htmlFor="primary-image" className="text-sm font-medium">Set as Primary Etsy Image</label>
      </div>
    </div>
  );
};

export default App;
