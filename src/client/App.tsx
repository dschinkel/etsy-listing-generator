import React from 'react';
import { useProductUpload } from './hooks/useProductUpload';
import { useListingGeneration } from './hooks/useListingGeneration';
import { createListingRepository } from './repositories/ListingRepository';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Checkbox } from './components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import Header from './components/Header';
import Footer from './components/Footer';
import ListingPreview from './components/ListingPreview';
import { ThemeProvider } from './components/theme-provider';

const App = () => {
  const { 
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
  } = useProductUpload();

  const repository = React.useMemo(() => createListingRepository(), []);
  const { 
    images, 
    systemPrompt,
    error,
    isGenerating,
    generateListing, 
    removeImage, 
    copyImageToClipboard,
    downloadAllImagesAsZip,
    fetchSystemPromptPreview
  } = useListingGeneration(repository);

  const [promptWidth, setPromptWidth] = React.useState(400);

  React.useEffect(() => {
    fetchSystemPromptPreview({
      lifestyleCount: lifestyleShotsCount,
      heroCount: heroShotsCount,
      closeUpsCount: closeUpsCount,
      flatLayCount: flatLayShotsCount,
      macroCount: macroShotsCount,
      contextualCount: contextualShotsCount
    });
  }, [
    lifestyleShotsCount,
    heroShotsCount,
    closeUpsCount,
    flatLayShotsCount,
    macroShotsCount,
    contextualShotsCount,
    fetchSystemPromptPreview
  ]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 p-8">
          <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto">
            <div className="flex gap-8 items-start">
              {/* Left Pane */}
              <div className="flex flex-col items-center gap-8 w-1/3">
                <UploadImage onUpload={handleUpload} />
                <UploadedImage 
                  src={productImage} 
                  isPrimary={isPrimaryImage}
                  onSelectPrimary={handlePrimarySelection}
                  onRemove={handleRemoveProductImage}
                />
              </div>

              {/* Middle Pane */}
              <div className="flex flex-col gap-8 flex-1">
                <ShotsSelection 
                  lifestyleShotsCount={lifestyleShotsCount}
                  onLifestyleShotsChange={handleLifestyleShotsChange}
                  heroShotsCount={heroShotsCount}
                  onHeroShotsChange={handleHeroShotsChange}
                  closeUpsCount={closeUpsCount}
                  onCloseUpsChange={handleCloseUpsChange}
                  flatLayShotsCount={flatLayShotsCount}
                  onFlatLayShotsChange={handleFlatLayShotsChange}
                  macroShotsCount={macroShotsCount}
                  onMacroShotsChange={handleMacroShotsChange}
                  contextualShotsCount={contextualShotsCount}
                  onContextualShotsChange={handleContextualShotsChange}
                />
                <BackgroundUploads 
                  onLifestyleBackgroundUpload={handleLifestyleBackgroundUpload}
                  lifestyleBackground={lifestyleBackground}
                  onHeroBackgroundUpload={handleHeroBackgroundUpload}
                  heroBackground={heroBackground}
                  onCloseUpsBackgroundUpload={handleCloseUpsBackgroundUpload}
                  closeUpsBackground={closeUpsBackground}
                  onFlatLayBackgroundUpload={handleFlatLayBackgroundUpload}
                  flatLayBackground={flatLayBackground}
                  onMacroBackgroundUpload={handleMacroBackgroundUpload}
                  macroBackground={macroBackground}
                  onContextualBackgroundUpload={handleContextualBackgroundUpload}
                  contextualBackground={contextualBackground}
                />
              </div>

              {/* Right Pane (System Prompt) */}
              <SystemPromptPane 
                prompt={systemPrompt} 
                width={promptWidth} 
                onWidthChange={setPromptWidth} 
              />
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <Button 
                size="lg" 
                className="w-full max-w-md"
                disabled={isGenerating}
                onClick={() => generateListing({ 
                  lifestyleCount: lifestyleShotsCount,
                  heroCount: heroShotsCount,
                  closeUpsCount: closeUpsCount,
                  flatLayCount: flatLayShotsCount,
                  macroCount: macroShotsCount,
                  contextualCount: contextualShotsCount,
                  productImage: productImage,
                  lifestyleBackground: lifestyleBackground,
                  heroBackground: heroBackground,
                  closeUpsBackground: closeUpsBackground,
                  flatLayBackground: flatLayBackground,
                  macroBackground: macroBackground,
                  contextualBackground: contextualBackground
                })}
              >
                {isGenerating ? 'Generating Listing Images...' : 'Generate Listing Images'}
              </Button>

              {error && (
                <div 
                  className="w-full max-w-2xl mx-auto p-4 bg-destructive/15 border border-destructive/30 text-destructive rounded-md text-sm text-center"
                  data-testid="generation-error"
                >
                  {error}
                </div>
              )}
            </div>

            <ListingPreview 
              images={images} 
              onRemove={removeImage} 
              onCopy={copyImageToClipboard} 
              onDownloadAll={downloadAllImagesAsZip}
            />
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

const UploadImage = ({ onUpload }: { onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <Card className="w-full border-dashed">
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
  onCloseUpsChange,
  flatLayShotsCount,
  onFlatLayShotsChange,
  macroShotsCount,
  onMacroShotsChange,
  contextualShotsCount,
  onContextualShotsChange
}: {
  lifestyleShotsCount: number,
  onLifestyleShotsChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  heroShotsCount: number,
  onHeroShotsChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  closeUpsCount: number,
  onCloseUpsChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  flatLayShotsCount: number,
  onFlatLayShotsChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  macroShotsCount: number,
  onMacroShotsChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  contextualShotsCount: number,
  onContextualShotsChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shots Selection</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <Label htmlFor="hero-shots">Hero Shot</Label>
            <span className="text-xs text-muted-foreground">Eye-level, centered, slightly blurred background (Product focus).</span>
          </div>
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
          <div className="flex flex-col">
            <Label htmlFor="flat-lay-shots">Flat Lay</Label>
            <span className="text-xs text-muted-foreground">Top-down view on a textured surface with ingredients scattered around.</span>
          </div>
          <Input
            id="flat-lay-shots"
            type="number"
            min="0"
            value={flatLayShotsCount}
            onChange={onFlatLayShotsChange}
            data-testid="flat-lay-shots-count"
            className="w-20"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <Label htmlFor="lifestyle-shots">Lifestyle</Label>
            <span className="text-xs text-muted-foreground">The product being held by a hand or sitting in a lunchbox/gym bag.</span>
          </div>
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
          <div className="flex flex-col">
            <Label htmlFor="macro-shots">Macro/Detail</Label>
            <span className="text-xs text-muted-foreground">Close-up on the pouch opening showing the texture of the banana chips.</span>
          </div>
          <Input
            id="macro-shots"
            type="number"
            min="0"
            value={macroShotsCount}
            onChange={onMacroShotsChange}
            data-testid="macro-shots-count"
            className="w-20"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <Label htmlFor="contextual-shots">Contextual</Label>
            <span className="text-xs text-muted-foreground">The product on a pantry shelf or a kitchen counter to show scale.</span>
          </div>
          <Input
            id="contextual-shots"
            type="number"
            min="0"
            value={contextualShotsCount}
            onChange={onContextualShotsChange}
            data-testid="contextual-shots-count"
            className="w-20"
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <Label htmlFor="close-ups">Close-ups</Label>
          </div>
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
  closeUpsBackground,
  onFlatLayBackgroundUpload,
  flatLayBackground,
  onMacroBackgroundUpload,
  macroBackground,
  onContextualBackgroundUpload,
  contextualBackground
}: { 
  onLifestyleBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  lifestyleBackground: string | null,
  onHeroBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  heroBackground: string | null,
  onCloseUpsBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  closeUpsBackground: string | null,
  onFlatLayBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  flatLayBackground: string | null,
  onMacroBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  macroBackground: string | null,
  onContextualBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  contextualBackground: string | null
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="flat-lay-background">Flat Lay Background</Label>
          <Input
            id="flat-lay-background"
            type="file"
            accept="image/png, image/jpeg"
            onChange={onFlatLayBackgroundUpload}
            data-testid="flat-lay-background-upload"
          />
          {flatLayBackground && (
            <img 
              src={flatLayBackground} 
              alt="Flat Lay Background" 
              data-testid="uploaded-flat-lay-background"
              className="w-20 h-20 object-cover rounded shadow mt-2"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="macro-background">Macro Background</Label>
          <Input
            id="macro-background"
            type="file"
            accept="image/png, image/jpeg"
            onChange={onMacroBackgroundUpload}
            data-testid="macro-background-upload"
          />
          {macroBackground && (
            <img 
              src={macroBackground} 
              alt="Macro Background" 
              data-testid="uploaded-macro-background"
              className="w-20 h-20 object-cover rounded shadow mt-2"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contextual-background">Contextual Background</Label>
          <Input
            id="contextual-background"
            type="file"
            accept="image/png, image/jpeg"
            onChange={onContextualBackgroundUpload}
            data-testid="contextual-background-upload"
          />
          {contextualBackground && (
            <img 
              src={contextualBackground} 
              alt="Contextual Background" 
              data-testid="uploaded-contextual-background"
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
  onSelectPrimary,
  onRemove
}: { 
  src: string | null, 
  isPrimary: boolean, 
  onSelectPrimary: () => void,
  onRemove: () => void
}) => {
  if (!src) return null;

  return (
    <Card className="w-full">
      <CardContent className="pt-6 flex flex-col items-center gap-4">
        <div className="relative group">
          <img
            src={src}
            alt="Product"
            data-testid="uploaded-product-image"
            className="max-w-xs rounded shadow-lg"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
            data-testid="remove-product-image"
          >
            Remove
          </Button>
        </div>
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

const SystemPromptPane = ({ 
  prompt, 
  width, 
  onWidthChange 
}: { 
  prompt: string, 
  width: number, 
  onWidthChange: (w: number) => void 
}) => {
  const isResizing = React.useRef(false);

  const startResizing = React.useCallback((e: React.MouseEvent) => {
    isResizing.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
  }, []);

  const stopResizing = React.useCallback(() => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
  }, []);

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = window.innerWidth - e.clientX - 32; // 32 is padding
    if (newWidth > 200 && newWidth < 800) {
      onWidthChange(newWidth);
    }
  }, [onWidthChange]);

  return (
    <div className="relative flex h-full min-h-[500px]" style={{ width: `${width}px` }}>
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors z-10"
        onMouseDown={startResizing}
      />
      <Card className="w-full h-full ml-4 overflow-hidden flex flex-col">
        <CardHeader>
          <CardTitle>System Prompt</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <pre className="text-xs whitespace-pre-wrap font-mono bg-muted p-4 rounded-lg">
            {prompt || 'No system prompt available yet. Generate images to see the prompt sent to Gemini.'}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
