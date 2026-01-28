import React from 'react';
import { useProductUpload } from './hooks/useProductUpload';
import { useListingGeneration } from './hooks/useListingGeneration';
import { createListingRepository } from './repositories/ListingRepository';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Label } from './components/ui/label';
import { Checkbox } from './components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Plus, Image as ImageIcon, Save } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import ListingPreview from './components/ListingPreview';
import { ThemeProvider } from './components/theme-provider';

const App = () => {
  const repository = React.useMemo(() => createListingRepository(), []);
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
    templates,
    saveContextTemplate,
  } = useProductUpload(repository);

  const { 
    images, 
    systemPrompt,
    modelUsed,
    error,
    isGenerating,
    generateListing, 
    removeImage, 
    downloadImage,
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
                {/* System Prompt (moved here) */}
                <SystemPromptPane 
                  prompt={systemPrompt} 
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
                    templates={templates}
                    onSaveTemplate={saveContextTemplate}
                    lifestyleBackground={lifestyleBackground}
                    onLifestyleBackgroundUpload={handleLifestyleBackgroundUpload}
                    heroBackground={heroBackground}
                    onHeroBackgroundUpload={handleHeroBackgroundUpload}
                    closeUpsBackground={closeUpsBackground}
                    onCloseUpsBackgroundUpload={handleCloseUpsBackgroundUpload}
                    flatLayBackground={flatLayBackground}
                    onFlatLayBackgroundUpload={handleFlatLayBackgroundUpload}
                    macroBackground={macroBackground}
                    onMacroBackgroundUpload={handleMacroBackgroundUpload}
                    contextualBackground={contextualBackground}
                    onContextualBackgroundUpload={handleContextualBackgroundUpload}
                  />
                </div>
              </div>
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
              onDownload={downloadImage} 
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
  onCustomContextChange,
  background,
  onBackgroundUpload
}: { 
  id: string, 
  label: string, 
  description: string, 
  count: number, 
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  customContext: string, 
  onCustomContextChange: (value: string) => void,
  templates: { name: string, text: string }[],
  onSaveTemplate: (name: string, text: string) => void,
  background: string | null,
  onBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  const [showCustom, setShowCustom] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2 border-b border-slate-800 pb-4 last:border-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col flex-1">
          <Label htmlFor={id} className="text-base font-semibold text-yellow-200">{label}</Label>
          <span className="text-base text-muted-foreground">{description}</span>
          <div className="flex items-center gap-2 mt-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => setShowCustom(!showCustom)}
              title="Add custom context"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <div className="pl-[10px] flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => fileInputRef.current?.click()}
                title="Upload background"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                ref={fileInputRef}
                onChange={onBackgroundUpload}
                data-testid={`${id}-background-upload`}
              />
              {background && (
                <div className="relative group">
                  <img 
                    src={background} 
                    alt="Background" 
                    className="w-8 h-8 object-cover rounded border border-slate-700"
                    data-testid={`uploaded-${id}-background`}
                  />
                </div>
              )}
            </div>
          </div>
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
        <div className="mt-2 pl-4 border-l-2 border-slate-700 w-full max-w-2xl flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <Label htmlFor={`${id}-custom`} className="text-xs">Custom Context</Label>
              {templates.length > 0 && (
                <select 
                  className="text-[10px] bg-background border border-slate-700 rounded px-1 py-0.5"
                  onChange={(e) => {
                    const template = templates.find(t => t.name === e.target.value);
                    if (template) onCustomContextChange(template.text);
                  }}
                  value=""
                >
                  <option value="" disabled>Select a template...</option>
                  {templates.map(t => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                  ))}
                </select>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              title="Save as template"
              disabled={!customContext.trim()}
              onClick={() => {
                const name = window.prompt('Enter a name for this template:');
                if (name) onSaveTemplate(name, customContext);
              }}
            >
              <Save className="h-3 w-3" />
            </Button>
          </div>
          <Textarea 
            id={`${id}-custom`}
            placeholder="e.g. In a high-end kitchen with marble countertops"
            value={customContext}
            onChange={(e) => onCustomContextChange(e.target.value)}
            className="text-xs min-h-[80px] resize-x"
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
  onContextualCustomContextChange,
  templates,
  onSaveTemplate,
  lifestyleBackground,
  onLifestyleBackgroundUpload,
  heroBackground,
  onHeroBackgroundUpload,
  closeUpsBackground,
  onCloseUpsBackgroundUpload,
  flatLayBackground,
  onFlatLayBackgroundUpload,
  macroBackground,
  onMacroBackgroundUpload,
  contextualBackground,
  onContextualBackgroundUpload
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
  onContextualCustomContextChange: (value: string) => void,
  templates: { name: string, text: string }[],
  onSaveTemplate: (name: string, text: string) => void,
  lifestyleBackground: string | null,
  onLifestyleBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  heroBackground: string | null,
  onHeroBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  closeUpsBackground: string | null,
  onCloseUpsBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  flatLayBackground: string | null,
  onFlatLayBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  macroBackground: string | null,
  onMacroBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  contextualBackground: string | null,
  onContextualBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
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
          templates={templates}
          onSaveTemplate={onSaveTemplate}
          background={heroBackground}
          onBackgroundUpload={onHeroBackgroundUpload}
        />
        <ShotTypeItem 
          id="flat-lay-shots"
          label="Flat Lay"
          description="Top-down view on a textured surface with ingredients scattered around."
          count={flatLayShotsCount}
          onChange={onFlatLayShotsChange}
          customContext={flatLayCustomContext}
          onCustomContextChange={onFlatLayCustomContextChange}
          templates={templates}
          onSaveTemplate={onSaveTemplate}
          background={flatLayBackground}
          onBackgroundUpload={onFlatLayBackgroundUpload}
        />
        <ShotTypeItem 
          id="lifestyle-shots"
          label="Lifestyle"
          description="The product being held by a hand or sitting in a lunchbox/gym bag."
          count={lifestyleShotsCount}
          onChange={onLifestyleShotsChange}
          customContext={lifestyleCustomContext}
          onCustomContextChange={onLifestyleCustomContextChange}
          templates={templates}
          onSaveTemplate={onSaveTemplate}
          background={lifestyleBackground}
          onBackgroundUpload={onLifestyleBackgroundUpload}
        />
        <ShotTypeItem 
          id="macro-shots"
          label="Macro/Detail"
          description="Close-up on the pouch opening showing the texture of the banana chips."
          count={macroShotsCount}
          onChange={onMacroShotsChange}
          customContext={macroCustomContext}
          onCustomContextChange={onMacroCustomContextChange}
          templates={templates}
          onSaveTemplate={onSaveTemplate}
          background={macroBackground}
          onBackgroundUpload={onMacroBackgroundUpload}
        />
        <ShotTypeItem 
          id="contextual-shots"
          label="Contextual"
          description="The product on a pantry shelf or a kitchen counter to show scale."
          count={contextualShotsCount}
          onChange={onContextualShotsChange}
          customContext={contextualCustomContext}
          onCustomContextChange={onContextualCustomContextChange}
          templates={templates}
          onSaveTemplate={onSaveTemplate}
          background={contextualBackground}
          onBackgroundUpload={onContextualBackgroundUpload}
        />
        <ShotTypeItem 
          id="close-ups"
          label="Close-ups"
          description="Detailed shots of specific parts of the product."
          count={closeUpsCount}
          onChange={onCloseUpsChange}
          customContext={closeUpsCustomContext}
          onCustomContextChange={onCloseUpsCustomContextChange}
          templates={templates}
          onSaveTemplate={onSaveTemplate}
          background={closeUpsBackground}
          onBackgroundUpload={onCloseUpsBackgroundUpload}
        />
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
  prompt
}: { 
  prompt: string
}) => {
  return (
    <Card className="w-full mt-4 overflow-hidden flex flex-col">
      <CardHeader>
        <CardTitle className="text-sm">System Prompt</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto max-h-[400px]">
        <pre className="text-[10px] whitespace-pre-wrap font-mono bg-muted p-2 rounded-lg">
          {prompt || 'No system prompt available yet. Generate images to see the prompt sent to Gemini.'}
        </pre>
      </CardContent>
    </Card>
  );
};

export default App;
