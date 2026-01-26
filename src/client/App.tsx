import React from 'react';
import { useProductUpload } from './hooks/useProductUpload';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Checkbox } from './components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';

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
    handleCloseUpsBackgroundUpload,
  } = useProductUpload();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-8">
      <Title />
      <UploadImage onUpload={handleUpload} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 w-full max-w-4xl">
        <ShotsSelection 
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
      </div>
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
    <Card className="w-full max-w-md border-dashed">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <Label htmlFor="product-image-upload" className="cursor-pointer text-center">
            <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-primary transition-colors">
              Click to upload product image
            </div>
          </Label>
          <Input
            id="product-image-upload"
            type="file"
            accept="image/png, image/jpeg"
            onChange={onUpload}
            data-testid="product-image-upload"
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const ShotsSelection = ({
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
    <Card>
      <CardHeader>
        <CardTitle>Shots Selection</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="lifestyle-shots">Lifestyle Shots</Label>
          <Input
            id="lifestyle-shots"
            type="number"
            min="0"
            value={lifestyleShotsCount}
            onChange={onLifestyleShotsChange}
            data-testid="lifestyle-shots-count"
            className="w-20"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="hero-shots">Hero Shots</Label>
          <Input
            id="hero-shots"
            type="number"
            min="0"
            value={heroShotsCount}
            onChange={onHeroShotsChange}
            data-testid="hero-shots-count"
            className="w-20"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="close-ups">Close-ups</Label>
          <Input
            id="close-ups"
            type="number"
            min="0"
            value={closeUpsCount}
            onChange={onCloseUpsChange}
            data-testid="close-ups-count"
            className="w-20"
          />
        </div>
      </CardContent>
    </Card>
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
    <Card>
      <CardHeader>
        <CardTitle>Background Uploads</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="lifestyle-background">Lifestyle Background</Label>
          <Input
            id="lifestyle-background"
            type="file"
            accept="image/png, image/jpeg"
            onChange={onLifestyleBackgroundUpload}
            data-testid="lifestyle-background-upload"
          />
          {lifestyleBackground && (
            <img 
              src={lifestyleBackground} 
              alt="Lifestyle Background" 
              data-testid="uploaded-lifestyle-background"
              className="w-20 h-20 object-cover rounded shadow mt-2"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="hero-background">Hero Background</Label>
          <Input
            id="hero-background"
            type="file"
            accept="image/png, image/jpeg"
            onChange={onHeroBackgroundUpload}
            data-testid="hero-background-upload"
          />
          {heroBackground && (
            <img 
              src={heroBackground} 
              alt="Hero Background" 
              data-testid="uploaded-hero-background"
              className="w-20 h-20 object-cover rounded shadow mt-2"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="close-ups-background">Close-ups Background</Label>
          <Input
            id="close-ups-background"
            type="file"
            accept="image/png, image/jpeg"
            onChange={onCloseUpsBackgroundUpload}
            data-testid="close-ups-background-upload"
          />
          {closeUpsBackground && (
            <img 
              src={closeUpsBackground} 
              alt="Close-ups Background" 
              data-testid="uploaded-close-ups-background"
              className="w-20 h-20 object-cover rounded shadow mt-2"
            />
          )}
        </div>
      </CardContent>
    </Card>
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
    <Card className="mt-8">
      <CardContent className="pt-6 flex flex-col items-center gap-4">
        <img
          src={src}
          alt="Product"
          data-testid="uploaded-product-image"
          className="max-w-xs rounded shadow-lg"
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="primary-image"
            checked={isPrimary}
            onCheckedChange={onSelectPrimary}
            data-testid="set-primary-image"
          />
          <Label htmlFor="primary-image" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Set as Primary Etsy Image
          </Label>
        </div>
      </CardContent>
    </Card>
  );
};

export default App;
