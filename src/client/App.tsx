import React from 'react';
import { useProductUpload } from './hooks/useProductUpload';
import { useListingGeneration } from './hooks/useListingGeneration';
import { createListingRepository } from './repositories/ListingRepository';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Checkbox } from './components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Plus } from 'lucide-react';
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
  } = useProductUpload();

  const repository = React.useMemo(() => createListingRepository(), []);
  const { 
    images, 
    systemPrompt,
    modelUsed,
    error,
    isGenerating,
    generateListing, 
    removeImage, 
    copyImageToClipboard,
    downloadAllImagesAsZip,
    fetchSystemPromptPreview
  } = useListingGeneration(repository);

  const [promptWidth, setPromptWidth] = React.useState(500);

  const totalShots = lifestyleShotsCount + heroShotsCount + closeUpsCount + flatLayShotsCount + macroShotsCount + contextualShotsCount;

  React.useEffect(() => {
    fetchSystemPromptPreview({
      lifestyleCount: lifestyleShotsCount,
      heroCount: heroShotsCount,
      closeUpsCount: closeUpsCount,
      flatLayCount: flatLayShotsCount,
      macroCount: macroShotsCount,
      contextualCount: contextualShotsCount,
      lifestyleCustomContext,
      heroCustomContext,
      closeUpsCustomContext,
      flatLayCustomContext,
      macroCustomContext,
      contextualCustomContext
    });
  }, [
    lifestyleShotsCount,
    heroShotsCount,
    closeUpsCount,
    flatLayShotsCount,
    macroShotsCount,
    contextualShotsCount,
    lifestyleCustomContext,
    heroCustomContext,
    closeUpsCustomContext,
    flatLayCustomContext,
    macroCustomContext,
    contextualCustomContext,
    fetchSystemPromptPreview
  ]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 p-8">
          <div className="flex flex-col gap-8 w-full max-w-[1600px] mx-auto">
            <div className="flex gap-8 items-start">
              {/* Left Pane */}
              <div className="flex flex-col items-center gap-8 w-1/4">
                <UploadImage onUpload={handleUpload} />
                <UploadedImage 
                  src={productImage} 
                  isPrimary={isPrimaryImage}
                  onSelectPrimary={handlePrimarySelection}
                  onRemove={handleRemoveProductImage}
                />
              </div>

              {/* Middle Pane */}
              <div className="flex gap-8 flex-1 items-start">
                <div className="flex-[2]">
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
                    lifestyleCustomContext={lifestyleCustomContext}
                    onLifestyleCustomContextChange={handleLifestyleCustomContextChange}
                    heroCustomContext={heroCustomContext}
                    onHeroCustomContextChange={handleHeroCustomContextChange}
                    closeUpsCustomContext={closeUpsCustomContext}
                    onCloseUpsCustomContextChange={handleCloseUpsCustomContextChange}
                    flatLayCustomContext={flatLayCustomContext}
                    onFlatLayCustomContextChange={handleFlatLayCustomContextChange}
                    macroCustomContext={macroCustomContext}
                    onMacroCustomContextChange={handleMacroCustomContextChange}
                    contextualCustomContext={contextualCustomContext}
                    onContextualCustomContextChange={handleContextualCustomContextChange}
                  />
                </div>
                <div className="flex-[1.5]">
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
              </div>

              {/* Right Pane (System Prompt) */}
              <SystemPromptPane 
                prompt={systemPrompt} 
                width={promptWidth} 
                onWidthChange={setPromptWidth} 
              />
            </div>
            
            <div className="flex flex-col items-center gap-4">
              {totalShots < 1 && (
                <div className="text-sm text-green-500 font-medium" data-testid="shots-selection-message">
                  Specify a Shots Selection
                </div>
              )}
              <Button 
                size="lg" 
                className="w-full max-w-xs"
                disabled={isGenerating || totalShots < 1}
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
                  contextualBackground: contextualBackground,
                  lifestyleCustomContext,
                  heroCustomContext,
                  closeUpsCustomContext,
                  flatLayCustomContext,
                  macroCustomContext,
                  contextualCustomContext
                })}
              >
                {isGenerating ? 'Generating Listing Images...' : 'Generate Listing Images'}
              </Button>

              {isGenerating && modelUsed && (
                <div className="text-sm text-orange-500 flex items-center gap-2" data-testid="model-status">
                  <span>Calling model:</span>
                  <span className="px-2 py-0.5 border border-orange-500 rounded-md text-xs font-medium animate-pulse">
                    {modelUsed}
                  </span>
                </div>
              )}

              {error && (
                <div 
                  className="w-full max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-md text-sm text-center font-medium"
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

const ShotTypeItem = ({ 
  id, 
  label, 
  description, 
  count, 
  onChange, 
  customContext, 
  onCustomContextChange 
}: { 
  id: string, 
  label: string, 
  description: string, 
  count: number, 
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  customContext: string,
  onCustomContextChange: (value: string) => void
}) => {
  const [showCustom, setShowCustom] = React.useState(false);

  return (
    <div className="flex flex-col gap-2 border-b border-slate-800 pb-4 last:border-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col flex-1">
          <Label htmlFor={id}>{label}</Label>
          <span className="text-xs text-muted-foreground">{description}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 mt-1" 
            onClick={() => setShowCustom(!showCustom)}
            title="Add custom context"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Input
          id={id}
          type="number"
          min="0"
          value={count}
          onChange={onChange}
          data-testid={`${id}-count`}
          className="w-20"
        />
      </div>
      {showCustom && (
        <div className="mt-2 pl-4 border-l-2 border-slate-700">
          <Label htmlFor={`${id}-custom`} className="text-xs mb-1 block">Custom Context</Label>
          <Input 
            id={`${id}-custom`}
            placeholder="e.g. In a high-end kitchen with marble countertops"
            value={customContext}
            onChange={(e) => onCustomContextChange(e.target.value)}
            className="text-xs h-8"
          />
        </div>
      )}
    </div>
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
  onContextualShotsChange,
  lifestyleCustomContext,
  onLifestyleCustomContextChange,
  heroCustomContext,
  onHeroCustomContextChange,
  closeUpsCustomContext,
  onCloseUpsCustomContextChange,
  flatLayCustomContext,
  onFlatLayCustomContextChange,
  macroCustomContext,
  onMacroCustomContextChange,
  contextualCustomContext,
  onContextualCustomContextChange
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
  onContextualShotsChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  lifestyleCustomContext: string,
  onLifestyleCustomContextChange: (value: string) => void,
  heroCustomContext: string,
  onHeroCustomContextChange: (value: string) => void,
  closeUpsCustomContext: string,
  onCloseUpsCustomContextChange: (value: string) => void,
  flatLayCustomContext: string,
  onFlatLayCustomContextChange: (value: string) => void,
  macroCustomContext: string,
  onMacroCustomContextChange: (value: string) => void,
  contextualCustomContext: string,
  onContextualCustomContextChange: (value: string) => void
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shots Selection</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ShotTypeItem 
          id="hero-shots"
          label="Hero Shot"
          description="Eye-level, centered, slightly blurred background (Product focus)."
          count={heroShotsCount}
          onChange={onHeroShotsChange}
          customContext={heroCustomContext}
          onCustomContextChange={onHeroCustomContextChange}
        />
        <ShotTypeItem 
          id="flat-lay-shots"
          label="Flat Lay"
          description="Top-down view on a textured surface with ingredients scattered around."
          count={flatLayShotsCount}
          onChange={onFlatLayShotsChange}
          customContext={flatLayCustomContext}
          onCustomContextChange={onFlatLayCustomContextChange}
        />
        <ShotTypeItem 
          id="lifestyle-shots"
          label="Lifestyle"
          description="The product being held by a hand or sitting in a lunchbox/gym bag."
          count={lifestyleShotsCount}
          onChange={onLifestyleShotsChange}
          customContext={lifestyleCustomContext}
          onCustomContextChange={onLifestyleCustomContextChange}
        />
        <ShotTypeItem 
          id="macro-shots"
          label="Macro/Detail"
          description="Close-up on the pouch opening showing the texture of the banana chips."
          count={macroShotsCount}
          onChange={onMacroShotsChange}
          customContext={macroCustomContext}
          onCustomContextChange={onMacroCustomContextChange}
        />
        <ShotTypeItem 
          id="contextual-shots"
          label="Contextual"
          description="The product on a pantry shelf or a kitchen counter to show scale."
          count={contextualShotsCount}
          onChange={onContextualShotsChange}
          customContext={contextualCustomContext}
          onCustomContextChange={onContextualCustomContextChange}
        />
        <ShotTypeItem 
          id="close-ups"
          label="Close-ups"
          description="Detailed shots of specific parts of the product."
          count={closeUpsCount}
          onChange={onCloseUpsChange}
          customContext={closeUpsCustomContext}
          onCustomContextChange={onCloseUpsCustomContextChange}
        />
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
            className="text-transparent file:text-foreground file:mr-0 file:px-0 file:h-full file:w-full w-[120px] px-0"
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
            className="text-transparent file:text-foreground file:mr-0 file:px-0 file:h-full file:w-full w-[120px] px-0"
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
            className="text-transparent file:text-foreground file:mr-0 file:px-0 file:h-full file:w-full w-[120px] px-0"
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
            className="text-transparent file:text-foreground file:mr-0 file:px-0 file:h-full file:w-full w-[120px] px-0"
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
            className="text-transparent file:text-foreground file:mr-0 file:px-0 file:h-full file:w-full w-[120px] px-0"
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
            className="text-transparent file:text-foreground file:mr-0 file:px-0 file:h-full file:w-full w-[120px] px-0"
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
