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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from './components/ui/dialog';
import { 
  Plus, 
  Image as ImageIcon, 
  Save, 
  Trash, 
  Eraser, 
  Archive,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import ListingPreview from './components/ListingPreview';
import ModelStatus from './components/ModelStatus';
import { ThemeProvider } from './components/theme-provider';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from './components/ui/collapsible';

const App = () => {
  const repository = React.useMemo(() => createListingRepository(), []);
  const { 
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
    isPrimaryImage,
    handlePrimarySelection,
    clearPrimaryImage: clearProductPrimaryImage,
    archiveProductImage,
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
    themedEnvironmentShotsCount,
    handleThemedEnvironmentShotsChange,
    themedEnvironmentBackground,
    handleThemedEnvironmentBackgroundUpload,
    themedEnvironmentCustomContext,
    handleThemedEnvironmentCustomContextChange,
    templates,
    saveContextTemplate,
    removeContextTemplate,
    totalShots,
    isReadyToGenerate,
    resetCounts,
    archivedUploads,
    toggleArchivedUpload,
    isProductImageArchived,
  } = useProductUpload(repository);

  const { 
    images, 
    systemPrompt,
    modelUsed,
    error,
    isGenerating,
    regeneratingIndex,
    generateListing, 
    removeImage, 
    clearImages,
    archiveAllImages,
    archiveImage,
    setPrimaryImage: setGeneratedPrimaryImage,
    clearPrimaryImage: clearGeneratedPrimaryImages,
    downloadImage,
    downloadAllImagesAsZip,
    regenerateImage,
    fetchSystemPromptPreview
  } = useListingGeneration(repository);

  const [promptWidth, setPromptWidth] = React.useState(500);
  const leftPaneRef = React.useRef<HTMLDivElement>(null);
  const middlePaneRef = React.useRef<HTMLDivElement>(null);
  const previewRef = React.useRef<HTMLDivElement>(null);
  const wasGeneratingRef = React.useRef(false);

  React.useEffect(() => {
    if (wasGeneratingRef.current && !isGenerating && images.length > 0) {
      previewRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (isGenerating && !wasGeneratingRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      leftPaneRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      middlePaneRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      previewRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
    wasGeneratingRef.current = isGenerating;
  }, [isGenerating, images.length]);

  React.useEffect(() => {
    fetchSystemPromptPreview({
      lifestyleCount: lifestyleShotsCount,
      heroCount: heroShotsCount,
      closeUpsCount: closeUpsCount,
      flatLayCount: flatLayShotsCount,
      macroCount: macroShotsCount,
      contextualCount: contextualShotsCount,
      themedEnvironmentCount: themedEnvironmentShotsCount,
      lifestyleCustomContext,
      heroCustomContext,
      closeUpsCustomContext,
      flatLayCustomContext,
      macroCustomContext,
      contextualCustomContext,
      themedEnvironmentCustomContext
    });
  }, [
    lifestyleShotsCount,
    heroShotsCount,
    closeUpsCount,
    flatLayShotsCount,
    macroShotsCount,
    contextualShotsCount,
    themedEnvironmentShotsCount,
    lifestyleCustomContext,
    heroCustomContext,
    closeUpsCustomContext,
    flatLayCustomContext,
    macroCustomContext,
    contextualCustomContext,
    themedEnvironmentCustomContext,
    fetchSystemPromptPreview
  ]);

  const handleSelectProductPrimary = () => {
    handlePrimarySelection();
    if (!isPrimaryImage) {
      clearGeneratedPrimaryImages();
    }
  };

  const handleSetGeneratedPrimary = (index: number) => {
    const wasAlreadyPrimary = images[index]?.isPrimary;
    setGeneratedPrimaryImage(index);
    if (!wasAlreadyPrimary) {
      clearProductPrimaryImage();
    }
  };

  const handleRegenerateImage = (index: number, customContext: string) => {
    regenerateImage(index, customContext, productImages);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 p-2 overflow-hidden">
          <div className="flex gap-2 items-start h-[calc(100vh-10rem)] max-w-full mx-auto px-1">
            {/* Left Pane */}
            <div ref={leftPaneRef} className="flex flex-col items-center gap-4 w-1/5 h-full overflow-y-auto pr-1">
              <div className="w-full flex flex-col gap-4">
                <UploadImage onUpload={handleUpload} disabled={productImages.length >= 2} />
                <ArchivedUploads 
                  images={archivedUploads} 
                  selectedImages={productImages}
                  onToggle={toggleArchivedUpload}
                  disabled={productImages.length >= 2}
                />
              </div>
              <div className="flex flex-col gap-4 w-full">
                {productImages.map((src, index) => (
                  <UploadedImage 
                    key={index}
                    src={src} 
                    isPrimary={isPrimaryImage && index === 0}
                    isArchived={isProductImageArchived(index)}
                    onSelectPrimary={index === 0 ? handleSelectProductPrimary : undefined}
                    onRemove={() => handleRemoveProductImage(index)}
                    onArchive={() => archiveProductImage(index)}
                  />
                ))}
              </div>
              {/* System Prompt (moved here) */}
              <SystemPromptPane 
                prompt={systemPrompt} 
              />
            </div>

            {/* Middle Pane */}
            <div ref={middlePaneRef} className="flex flex-col gap-4 w-1/5 h-full overflow-y-auto items-start pr-1">
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="w-full">
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
                    themedEnvironmentShotsCount={themedEnvironmentShotsCount}
                    onThemedEnvironmentShotsChange={handleThemedEnvironmentShotsChange}
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
                    themedEnvironmentCustomContext={themedEnvironmentCustomContext}
                    onThemedEnvironmentCustomContextChange={handleThemedEnvironmentCustomContextChange}
                    templates={templates}
                    onSaveTemplate={saveContextTemplate}
                    onRemoveTemplate={removeContextTemplate}
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
                    themedEnvironmentBackground={themedEnvironmentBackground}
                    onThemedEnvironmentBackgroundUpload={handleThemedEnvironmentBackgroundUpload}
                  />
                </div>

                <div className="flex flex-col items-center gap-4 w-full">
                  {productImages.length === 0 && (
                    <div className="text-sm text-yellow-500 font-medium" data-testid="upload-message">
                      Upload a product image to start
                    </div>
                  )}
                  {productImages.length > 0 && totalShots < 1 && (
                    <div className="text-sm text-green-500 font-medium" data-testid="shots-selection-message">
                      Specify a Shots Selection
                    </div>
                  )}
                  <Button 
                    size="lg" 
                    className="w-full max-w-xs"
                    disabled={isGenerating || !isReadyToGenerate}
                    onClick={() => {
                      generateListing({ 
                        lifestyleCount: lifestyleShotsCount,
                        heroCount: heroShotsCount,
                        closeUpsCount: closeUpsCount,
                        flatLayCount: flatLayShotsCount,
                        macroCount: macroShotsCount,
                        contextualCount: contextualShotsCount,
                        themedEnvironmentCount: themedEnvironmentShotsCount,
                        productImages: productImages,
                        lifestyleBackground: lifestyleBackground,
                        heroBackground: heroBackground,
                        closeUpsBackground: closeUpsBackground,
                        flatLayBackground: flatLayBackground,
                        macroBackground: macroBackground,
                        contextualBackground: contextualBackground,
                        themedEnvironmentBackground: themedEnvironmentBackground,
                        lifestyleCustomContext,
                        heroCustomContext,
                        closeUpsCustomContext,
                        flatLayCustomContext,
                        macroCustomContext,
                        contextualCustomContext,
                        themedEnvironmentCustomContext
                      });
                      resetCounts();
                    }}
                  >
                    {isGenerating ? 'Generating Listing Images...' : 'Generate Listing Images'}
                  </Button>

                  {error && (
                    <div 
                      className="w-full max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-md text-sm text-center font-medium"
                      data-testid="generation-error"
                    >
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Pane */}
            <div ref={previewRef} className="flex-1 h-full overflow-y-auto pr-1">
              <ListingPreview 
                images={images} 
                isGenerating={isGenerating}
                regeneratingIndex={regeneratingIndex}
                modelUsed={modelUsed}
                onRemove={removeImage} 
                onClearAll={clearImages}
                onArchiveAll={archiveAllImages}
                onArchiveImage={archiveImage}
                onDownload={downloadImage} 
                onDownloadAll={downloadAllImagesAsZip}
                onSetPrimary={handleSetGeneratedPrimary}
                onRegenerate={handleRegenerateImage}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

const ArchivedUploads = ({ 
  images, 
  selectedImages, 
  onToggle,
  disabled
}: { 
  images: string[], 
  selectedImages: string[], 
  onToggle: (url: string) => void,
  disabled?: boolean
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4 py-2 border rounded-lg bg-card">
        <h4 className="text-sm font-semibold">
          Archived Uploads
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        <Card className="w-full">
          <CardContent className="p-2">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.length === 0 ? (
                <div className="text-[10px] text-muted-foreground p-4 text-center w-full">
                  No archived uploads found
                </div>
              ) : (
                images.map((url, index) => {
                  const isSelected = selectedImages.includes(url);
                  return (
                    <div 
                      key={index} 
                      className={`relative flex-none w-16 h-16 rounded cursor-pointer border-2 transition-all ${
                        isSelected ? 'border-primary scale-95' : 'border-transparent hover:border-slate-500'
                      } ${disabled && !isSelected ? 'opacity-50 grayscale pointer-events-none' : ''}`}
                      onClick={() => onToggle(url)}
                    >
                      <img 
                        src={url} 
                        alt={`Archived ${index}`} 
                        className="w-full h-full object-cover rounded"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded">
                          <div className="bg-primary text-primary-foreground rounded-full p-0.5">
                            <Plus className="w-3 h-3 rotate-45" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

const UploadImage = ({ onUpload, disabled }: { onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void, disabled?: boolean }) => {
  return (
    <Card className={`w-full border-dashed ${disabled ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
      <CardContent className="p-3">
        <div className="flex flex-col items-center justify-center">
          <Label htmlFor="product-image-upload" className="cursor-pointer text-center w-full">
            <div className="p-2 border-2 border-dashed border-slate-300 rounded-lg hover:border-primary transition-colors text-xs">
              {disabled ? 'Max 2 images' : 'Upload product image'}
            </div>
          </Label>
          <Input
            id="product-image-upload"
            type="file"
            accept="image/png, image/jpeg"
            onChange={onUpload}
            data-testid="product-image-upload"
            className="hidden"
            disabled={disabled}
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
  templates,
  onSaveTemplate,
  onRemoveTemplate,
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
  onRemoveTemplate: (name: string) => void,
  background: string | null,
  onBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  const [showCustom, setShowCustom] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>("");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = React.useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = React.useState(false);
  const [newTemplateName, setNewTemplateName] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSaveTemplate = () => {
    if (newTemplateName.trim()) {
      onSaveTemplate(newTemplateName, customContext);
      setNewTemplateName("");
      setIsSaveDialogOpen(false);
    }
  };

  const handleRemoveTemplate = () => {
    if (selectedTemplate) {
      onRemoveTemplate(selectedTemplate);
      setSelectedTemplate("");
      setIsRemoveDialogOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 border-b border-slate-800 pb-2 last:border-0">
      <div className="grid grid-cols-[1fr_auto] gap-1 items-center w-full">
        <div className="flex flex-col min-w-0">
          <Label htmlFor={id} className="text-sm font-semibold text-yellow-200 truncate">{label}</Label>
          <span className="text-xs text-muted-foreground line-clamp-2 leading-tight">{description}</span>
          <div className="flex items-center gap-1 mt-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5" 
              onClick={() => setShowCustom(!showCustom)}
              title="Add custom context"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => fileInputRef.current?.click()}
                title="Upload background"
              >
                <ImageIcon className="h-3 w-3" />
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
                    className="w-6 h-6 object-cover rounded border border-slate-700"
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
          className="w-14 h-8 text-sm"
        />
      </div>
      {showCustom && (
        <div className="mt-2 pl-4 border-l-2 border-slate-700 w-full max-w-md flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <Label htmlFor={`${id}-custom`} className="text-xs">Custom Context</Label>
              {templates.length > 0 && (
                <div className="flex items-center gap-1">
                  <select 
                    className="text-[10px] bg-background border border-slate-700 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-ring"
                    onChange={(e) => {
                      const templateName = e.target.value;
                      setSelectedTemplate(templateName);
                      const template = templates.find(t => t.name === templateName);
                      if (template) {
                        const trimmedCurrent = customContext.trim();
                        const templateText = template.text;
                        
                        if (!trimmedCurrent) {
                          onCustomContextChange(templateText);
                        } else if (!trimmedCurrent.includes(templateText)) {
                          onCustomContextChange(`${trimmedCurrent}\n${templateText}`);
                        }
                      }
                    }}
                    value={selectedTemplate}
                    data-testid={`${id}-template-select`}
                  >
                    <option value="" disabled>Select a template...</option>
                    {templates.map(t => (
                      <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                  {selectedTemplate && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                      title="Remove template"
                      onClick={() => setIsRemoveDialogOpen(true)}
                      data-testid={`${id}-remove-template`}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                title="Clear custom context"
                onClick={() => {
                  onCustomContextChange("");
                  setSelectedTemplate("");
                }}
                data-testid={`${id}-clear-context`}
              >
                <Eraser className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                title="Save as template"
                disabled={!customContext.trim()}
                onClick={() => setIsSaveDialogOpen(true)}
              >
                <Save className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Textarea 
            id={`${id}-custom`}
            placeholder="e.g. In a high-end kitchen with marble countertops"
            value={customContext}
            onChange={(e) => {
              const newValue = e.target.value;
              onCustomContextChange(newValue);
              if (!newValue.trim()) {
                setSelectedTemplate("");
              }
            }}
            className="text-xs min-h-[80px] resize-x"
          />
        </div>
      )}

      {/* Save Template Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex flex-col gap-2">
            <Label htmlFor={`${id}-new-template-name`}>Template Name</Label>
            <Input 
              id={`${id}-new-template-name`}
              value={newTemplateName} 
              onChange={(e) => setNewTemplateName(e.target.value)} 
              placeholder="e.g. Modern Kitchen"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTemplate} disabled={!newTemplateName.trim()}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Template Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Template</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to remove the template "{selectedTemplate}"?
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRemoveDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRemoveTemplate}>Remove Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
  themedEnvironmentShotsCount,
  onThemedEnvironmentShotsChange,
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
  themedEnvironmentCustomContext,
  onThemedEnvironmentCustomContextChange,
  templates,
  onSaveTemplate,
  onRemoveTemplate,
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
  onContextualBackgroundUpload,
  themedEnvironmentBackground,
  onThemedEnvironmentBackgroundUpload
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
  themedEnvironmentShotsCount: number,
  onThemedEnvironmentShotsChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
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
  themedEnvironmentCustomContext: string,
  onThemedEnvironmentCustomContextChange: (value: string) => void,
  templates: { name: string, text: string }[],
  onSaveTemplate: (name: string, text: string) => void,
  onRemoveTemplate: (name: string) => void,
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
  onContextualBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  themedEnvironmentBackground: string | null,
  onThemedEnvironmentBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  const createShotType = (
    id: string,
    label: string,
    description: string,
    count: number,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    customContext: string,
    onCustomContextChange: (value: string) => void,
    background: string | null,
    onBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  ) => ({
    id,
    label,
    description,
    count,
    onChange,
    customContext,
    onCustomContextChange,
    background,
    onBackgroundUpload,
  });

  const shotTypes = [
    createShotType(
      "hero-shots",
      "Hero Shot",
      "Eye-level, centered, slightly blurred background (Product focus).",
      heroShotsCount,
      onHeroShotsChange,
      heroCustomContext,
      onHeroCustomContextChange,
      heroBackground,
      onHeroBackgroundUpload
    ),
    createShotType(
      "flat-lay-shots",
      "Flat Lay",
      "Top-down view on a textured surface with ingredients scattered around.",
      flatLayShotsCount,
      onFlatLayShotsChange,
      flatLayCustomContext,
      onFlatLayCustomContextChange,
      flatLayBackground,
      onFlatLayBackgroundUpload
    ),
    createShotType(
      "lifestyle-shots",
      "Lifestyle",
      "The product being held by a hand or sitting in a lunchbox/gym bag.",
      lifestyleShotsCount,
      onLifestyleShotsChange,
      lifestyleCustomContext,
      onLifestyleCustomContextChange,
      lifestyleBackground,
      onLifestyleBackgroundUpload
    ),
    createShotType(
      "macro-shots",
      "Macro/Detail",
      "Close-up on the pouch opening showing the texture of the banana chips.",
      macroShotsCount,
      onMacroShotsChange,
      macroCustomContext,
      onMacroCustomContextChange,
      macroBackground,
      onMacroBackgroundUpload
    ),
    createShotType(
      "contextual-shots",
      "Contextual",
      "The product on a pantry shelf or a kitchen counter to show scale.",
      contextualShotsCount,
      onContextualShotsChange,
      contextualCustomContext,
      onContextualCustomContextChange,
      contextualBackground,
      onContextualBackgroundUpload
    ),
    createShotType(
      "themed-environment",
      "Themed Environment",
      "The product is placed in a realistic, thematic setting.",
      themedEnvironmentShotsCount,
      onThemedEnvironmentShotsChange,
      themedEnvironmentCustomContext,
      onThemedEnvironmentCustomContextChange,
      themedEnvironmentBackground,
      onThemedEnvironmentBackgroundUpload
    ),
    createShotType(
      "close-ups",
      "Close-ups",
      "Detailed shots of specific parts of the product.",
      closeUpsCount,
      onCloseUpsChange,
      closeUpsCustomContext,
      onCloseUpsCustomContextChange,
      closeUpsBackground,
      onCloseUpsBackgroundUpload
    ),
  ];

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border/50 pb-2 px-3">
        <CardTitle>Shots Selection</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 pt-[10px] px-3">
        {shotTypes.map((shot) => (
          <ShotTypeItem 
            key={shot.id}
            {...shot}
            templates={templates}
            onSaveTemplate={onSaveTemplate}
            onRemoveTemplate={onRemoveTemplate}
          />
        ))}
      </CardContent>
    </Card>
  );
};

const UploadedImage = ({ 
  src, 
  isPrimary, 
  isArchived,
  onSelectPrimary,
  onRemove,
  onArchive
}: { 
  src: string | null, 
  isPrimary: boolean, 
  isArchived: boolean,
  onSelectPrimary?: () => void,
  onRemove: () => void,
  onArchive: () => void
}) => {
  if (!src) return null;

  return (
    <Card className="w-full">
      <CardContent className="pt-4 flex flex-col items-center gap-2 px-2">
        <div className="relative group">
          <img
            src={src}
            alt="Product"
            data-testid="uploaded-product-image"
            className="max-w-full h-auto rounded shadow-lg"
          />
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
            onClick={onArchive}
            disabled={isArchived}
            data-testid="archive-product-image"
            title={isArchived ? "Already archived" : "Archive image"}
          >
            <Archive className="w-3 h-3" />
            {isArchived ? 'Archived' : 'Archive'}
          </Button>
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
        {onSelectPrimary && (
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
        )}
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
    <Card className="w-full mt-2 overflow-hidden flex flex-col">
      <CardHeader className="p-3">
        <CardTitle className="text-sm">System Prompt</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto max-h-[300px] p-2">
        <pre className="text-[10px] whitespace-pre-wrap font-mono bg-muted p-2 rounded-lg">
          {prompt || 'No system prompt available yet. Generate images to see the prompt sent to Gemini.'}
        </pre>
      </CardContent>
    </Card>
  );
};

export default App;
