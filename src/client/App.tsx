import React from 'react';
import { useProductUpload } from './hooks/useProductUpload';
import { resizeImage } from './lib/imageUtils';
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
  Check,
  Plus, 
  Image as ImageIcon, 
  Save, 
  Trash, 
  Eraser, 
  Archive,
  ChevronDown,
  ChevronUp,
  Copy,
  Pencil,
} from 'lucide-react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from './components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import Header from './components/Header';
import Footer from './components/Footer';
import ListingPreview from './components/ListingPreview';
import EtsyListingForm from './components/EtsyListingForm';
import ModelStatus from './components/ModelStatus';
import ImageModal from './components/ImageModal';
import { useListingPreview } from './components/useListingPreview';
import { ThemeProvider } from './components/theme-provider';

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
    themedEnvironmentNoImage,
    handleThemedEnvironmentNoImageChange,
    themedEnvironmentCustomContext,
    handleThemedEnvironmentCustomContextChange,
    templates,
    saveContextTemplate,
    removeContextTemplate,
    totalShots,
    isReadyToGenerate,
    resetCounts,
    selectAllShots,
    clearShotCount,
    archivedUploads,
    toggleArchivedUpload,
    isProductImageArchived,
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
    editSpecifications,
    addEditSpecification,
    removeEditSpecification,
    handleEditSpecificationChange,
    clearEditSpecifications,
    editCount,
    handleEditCountChange,
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
    saveImage,
    fetchSystemPromptPreview,
    etsyFormData,
    isPublishing,
    publishUrl,
    temperature,
    setTemperature,
    promptVersions,
    selectedPromptVersion,
    setSelectedPromptVersion,
    editPromptVersions,
    selectedEditPromptVersion,
    setSelectedEditPromptVersion,
    saveEditPromptVersion,
    removeEditPromptVersion,
    selectedModel,
    setSelectedModel,
    updateEtsyFormData,
    publishToEtsy,
    currentSeeds,
    addManualImages
  } = useListingGeneration(repository);

  const { 
    selectedIndex: uploadedSelectedIndex, 
    isModalOpen: isUploadedModalOpen, 
    openImage: openUploadedImage, 
    closeImage: closeUploadedImage 
  } = useListingPreview();

  const uploadedImageSlides = React.useMemo(() => 
    productImages.map(url => ({ url, type: 'Product' })), 
    [productImages]
  );

  const [promptWidth, setPromptWidth] = React.useState(500);
  const leftPaneRef = React.useRef<HTMLDivElement>(null);
  const middlePaneRef = React.useRef<HTMLDivElement>(null);
  const previewRef = React.useRef<HTMLDivElement>(null);
  const wasGeneratingRef = React.useRef(false);
  const [isEtsyFormOpen, setIsEtsyFormOpen] = React.useState(false);
  const [isEditPromptDialogOpen, setIsEditPromptDialogOpen] = React.useState(false);
  const [newEditPromptVersion, setNewEditPromptVersion] = React.useState("");
  const [newEditPromptTemplate, setNewEditPromptTemplate] = React.useState("");
  const [newEditPromptLineTemplate, setNewEditPromptLineTemplate] = React.useState("");
  const [isEditPromptRemoveDialogOpen, setIsEditPromptRemoveDialogOpen] = React.useState(false);

  const handleSaveEditPromptVersion = () => {
    if (newEditPromptVersion && newEditPromptTemplate && newEditPromptLineTemplate) {
      saveEditPromptVersion({
        version: newEditPromptVersion,
        template: newEditPromptTemplate,
        lineTemplate: newEditPromptLineTemplate
      });
      setIsEditPromptDialogOpen(false);
      setNewEditPromptVersion("");
      setNewEditPromptTemplate("");
      setNewEditPromptLineTemplate("");
    }
  };

  const handleEditEditPromptVersion = () => {
    const current = editPromptVersions.find(v => v.version === selectedEditPromptVersion);
    if (current) {
      setNewEditPromptVersion(current.version);
      setNewEditPromptTemplate(current.template);
      setNewEditPromptLineTemplate(current.lineTemplate);
      setIsEditPromptDialogOpen(true);
    }
  };

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
      themedEnvironmentCustomContext,
      editSpecifications,
      editCount
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
    editSpecifications,
    editCount,
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

  const handleUploadManualPreview = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const resizePromises = Array.from(files).map(file => {
        return resizeImage(file).catch(err => {
          console.error('Failed to resize manual preview image:', err);
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        });
      });
      
      const results = await Promise.all(resizePromises);
      addManualImages(results);
    }
  };

  const handleRegenerateImage = (index: number, customContext: string) => {
    regenerateImage(index, customContext, productImages);
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 p-2 bg-slate-50 dark:bg-background">
          <div className="flex gap-4 items-start max-w-full mx-auto px-1">
            {/* Left Pane */}
            <div ref={leftPaneRef} className="flex flex-col items-center gap-4 w-1/5 h-[calc(100vh-10rem)] sticky top-[5.5rem] overflow-y-auto pr-1">
              <div className="w-full flex flex-col gap-2">
                <UploadImage onUpload={handleUpload} disabled={productImages.length >= 2} />
                <ArchivedUploads 
                  images={archivedUploads} 
                  selectedImages={productImages}
                  onToggle={toggleArchivedUpload}
                  disabled={productImages.length >= 2}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                {productImages.map((src, index) => (
                  <UploadedImage 
                    key={index}
                    src={src} 
                    isPrimary={isPrimaryImage && index === 0}
                    isArchived={isProductImageArchived(index)}
                    onSelectPrimary={index === 0 ? handleSelectProductPrimary : undefined}
                    onRemove={() => handleRemoveProductImage(index)}
                    onArchive={() => archiveProductImage(index)}
                    onClick={() => openUploadedImage(index)}
                  />
                ))}
              </div>
              <div className="w-full flex flex-col mt-2 flex-1 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm bg-white dark:bg-card">
                <div className="bg-slate-100 dark:bg-slate-900/80 border-b-2 border-slate-400 dark:border-slate-800 h-11 flex items-center justify-between px-4">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <label className="text-[15px] font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider leading-tight">
                        Edit Picture
                      </label>
                      <Input 
                        type="number"
                        min="1"
                        max="10"
                        className="w-12 h-7 text-xs px-1.5 bg-background border-slate-700 text-center font-bold"
                        value={editCount}
                        onChange={(e) => handleEditCountChange(parseInt(e.target.value) || 1)}
                        title="Number of images to generate"
                      />
                    </div>
                    <span className="text-[15px] text-slate-600 dark:text-muted-foreground leading-tight italic">
                      Edit text, number, or background in your uploaded product photos.
                    </span>
                  </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-[10px] px-2 font-bold uppercase tracking-tight text-slate-900 dark:text-slate-100 hover:bg-red-500/20 hover:text-red-600 transition-colors" 
                          onClick={clearEditSpecifications}
                          disabled={editSpecifications.length === 0}
                          title="Clear all edit specifications"
                        >
                          <Eraser className="h-3 w-3 mr-1" />
                          Clear
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="h-7 text-[10px] px-2 font-bold uppercase tracking-tight bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors border-none" 
                          onClick={addEditSpecification}
                          title="Add edit specification"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                <div className="p-2 pt-1.5 flex flex-col gap-2">
                  {editPromptVersions.length > 0 && (
                    <div className="flex items-center gap-1 mb-1 px-1 justify-end">
                      <select 
                        className="text-sm bg-slate-900 text-slate-100 border-none rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-ring h-7 font-bold"
                        value={selectedEditPromptVersion}
                        onChange={(e) => setSelectedEditPromptVersion(e.target.value)}
                      >
                        {editPromptVersions.map((v, idx) => (
                          <option key={v.version} value={v.version}>v{idx + 1}</option>
                        ))}
                      </select>
                      {selectedEditPromptVersion && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:bg-muted transition-colors"
                            onClick={handleEditEditPromptVersion}
                            title="Edit current edit prompt version"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:bg-muted transition-colors"
                            onClick={() => {
                              setNewEditPromptVersion("");
                              setNewEditPromptTemplate("");
                              setNewEditPromptLineTemplate("");
                              setIsEditPromptDialogOpen(true);
                            }}
                            title="Add new edit prompt version"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:bg-muted transition-colors hover:text-red-600"
                            onClick={() => setIsEditPromptRemoveDialogOpen(true)}
                            title="Remove current edit prompt version"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                  {editSpecifications.map((spec, index) => (
                    <div key={index} className="flex flex-col gap-1 p-2 border rounded-md bg-slate-50 dark:bg-muted/20 relative">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <span>Change</span>
                        <select 
                          className="bg-white dark:bg-background border border-slate-200 dark:border-slate-800 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary"
                          value={spec.field}
                          onChange={(e) => handleEditSpecificationChange(index, e.target.value, spec.value)}
                        >
                          <option value="Name">Name</option>
                          <option value="Number">Number</option>
                          <option value="Background">Background</option>
                        </select>
                        <span>to</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-5 w-5 p-0 ml-auto text-muted-foreground hover:text-destructive transition-colors" 
                          onClick={() => removeEditSpecification(index)}
                          title="Remove this specification"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                      <input 
                        className="w-full p-1.5 text-sm bg-background border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder={`Value for ${spec.field}`}
                        value={spec.value}
                        onChange={(e) => handleEditSpecificationChange(index, spec.field, e.target.value)}
                      />
                    </div>
                  ))}
                  {editSpecifications.length === 0 && (
                    <div 
                      className="text-base text-muted-foreground italic text-center p-2 border border-dashed rounded-md cursor-pointer hover:bg-muted/10"
                      onClick={addEditSpecification}
                    >
                      Click + to add text/color edits
                    </div>
                  )}
                </div>
              </div>
              {/* System Prompt (moved here) */}
              <SystemPromptPane 
                prompt={systemPrompt} 
                temperature={temperature}
                onTemperatureChange={setTemperature}
                promptVersions={promptVersions}
                selectedPromptVersion={selectedPromptVersion}
                onPromptVersionChange={setSelectedPromptVersion}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                images={images}
                currentSeeds={currentSeeds}
              />
            </div>

            {/* Middle Pane */}
            <div ref={middlePaneRef} className="flex flex-col gap-4 w-1/5 h-[calc(100vh-10rem)] sticky top-[5.5rem] overflow-y-auto items-start pr-1">
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
                    lifestyleCreateSimilar={lifestyleCreateSimilar}
                    onLifestyleCreateSimilarChange={handleLifestyleCreateSimilarChange}
                    heroCreateSimilar={heroCreateSimilar}
                    onHeroCreateSimilarChange={handleHeroCreateSimilarChange}
                    closeUpsCreateSimilar={closeUpsCreateSimilar}
                    onCloseUpsCreateSimilarChange={handleCloseUpsCreateSimilarChange}
                    flatLayCreateSimilar={flatLayCreateSimilar}
                    onFlatLayCreateSimilarChange={handleFlatLayCreateSimilarChange}
                    macroCreateSimilar={macroCreateSimilar}
                    onMacroCreateSimilarChange={handleMacroCreateSimilarChange}
                    contextualCreateSimilar={contextualCreateSimilar}
                    onContextualCreateSimilarChange={handleContextualCreateSimilarChange}
                    themedEnvironmentCreateSimilar={themedEnvironmentCreateSimilar}
                    onThemedEnvironmentCreateSimilarChange={handleThemedEnvironmentCreateSimilarChange}
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
                    lifestyleNoImage={lifestyleNoImage}
                    onLifestyleNoImageChange={handleLifestyleNoImageChange}
                    heroNoImage={heroNoImage}
                    onHeroNoImageChange={handleHeroNoImageChange}
                    closeUpsNoImage={closeUpsNoImage}
                    onCloseUpsNoImageChange={handleCloseUpsNoImageChange}
                    flatLayNoImage={flatLayNoImage}
                    onFlatLayNoImageChange={handleFlatLayNoImageChange}
                    macroNoImage={macroNoImage}
                    onMacroNoImageChange={handleMacroNoImageChange}
                    contextualNoImage={contextualNoImage}
                    onContextualNoImageChange={handleContextualNoImageChange}
                    themedEnvironmentNoImage={themedEnvironmentNoImage}
                    onThemedEnvironmentNoImageChange={handleThemedEnvironmentNoImageChange}
                    onSelectAll={selectAllShots}
                    onClearAllShots={resetCounts}
                    onClearShotCount={clearShotCount}
                  />
                </div>

                <div className="flex flex-col items-center gap-6 w-full">
                  {productImages.length === 0 && (
                    <div className="text-base text-slate-600 dark:text-slate-100 font-medium" data-testid="upload-message">
                      Upload a product image to start
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
                        lifestyleNoImage,
                        heroNoImage,
                        closeUpsNoImage,
                        flatLayNoImage,
                        macroNoImage,
                        contextualNoImage,
                        themedEnvironmentNoImage,
                        lifestyleCustomContext,
                        heroCustomContext,
                        closeUpsCustomContext,
                        flatLayCustomContext,
                        macroCustomContext,
                        contextualCustomContext,
                        themedEnvironmentCustomContext,
                        lifestyleCreateSimilar,
                        heroCreateSimilar,
                        closeUpsCreateSimilar,
                        flatLayCreateSimilar,
                        macroCreateSimilar,
                        contextualCreateSimilar,
                        themedEnvironmentCreateSimilar,
                        editSpecifications,
                        editCount
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
            <div className="flex-1 flex flex-col gap-4 pr-1">
              <div className="h-[calc(50vh-5rem)] min-h-[300px] overflow-y-auto pr-1 bg-slate-50/50 dark:bg-transparent rounded-lg">
                  <ListingPreview 
                    images={images} 
                    isGenerating={isGenerating}
                    regeneratingIndex={regeneratingIndex}
                    modelUsed={modelUsed}
                    onRemove={removeImage} 
                    onClearAll={clearImages}
                    onArchiveAll={archiveAllImages}
                    onArchiveImage={archiveImage}
                    onSaveImage={saveImage}
                    onDownload={downloadImage} 
                    onDownloadAll={downloadAllImagesAsZip}
                    onSetPrimary={handleSetGeneratedPrimary}
                    onRegenerate={handleRegenerateImage}
                    onUploadManual={handleUploadManualPreview}
                  />
              </div>
              <div className="pr-1">
                <Collapsible
                  open={isEtsyFormOpen}
                  onOpenChange={setIsEtsyFormOpen}
                  className="w-full"
                >
                  <div className="flex items-center justify-between px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-t-lg bg-slate-50 dark:bg-muted/30 border-b-0 h-10">
                    <h4 className="text-sm font-semibold">
                      Etsy Listing
                    </h4>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-9 p-0">
                        {isEtsyFormOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        <span className="sr-only">Toggle Etsy Listing</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="border border-slate-200 dark:border-slate-800 border-t-0 rounded-b-lg overflow-hidden bg-white dark:bg-card">
                    <EtsyListingForm 
                      formData={etsyFormData}
                      onChange={updateEtsyFormData}
                      onPublish={publishToEtsy}
                      isPublishing={isPublishing}
                      publishUrl={publishUrl}
                      hideHeader={true}
                    />
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      <Dialog open={isEditPromptRemoveDialogOpen} onOpenChange={setIsEditPromptRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Edit Prompt Version</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to remove the edit prompt version "{selectedEditPromptVersion}"?
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditPromptRemoveDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              removeEditPromptVersion(selectedEditPromptVersion);
              setIsEditPromptRemoveDialogOpen(false);
            }}>Remove Version</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Prompt Dialog */}
      <Dialog open={isEditPromptDialogOpen} onOpenChange={setIsEditPromptDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{newEditPromptVersion ? 'Edit' : 'Add'} Edit Prompt Version</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-prompt-version">Version Name</Label>
              <Input 
                id="edit-prompt-version"
                value={newEditPromptVersion} 
                onChange={(e) => setNewEditPromptVersion(e.target.value)} 
                placeholder="e.g. edit image prompt v3"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-prompt-line-template">Line Template</Label>
              <Input 
                id="edit-prompt-line-template"
                value={newEditPromptLineTemplate} 
                onChange={(e) => setNewEditPromptLineTemplate(e.target.value)} 
                placeholder="e.g. • Replace the {{FIELD}} text with: {{VALUE}}"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-prompt-template">System Prompt Template</Label>
              <Textarea 
                id="edit-prompt-template"
                value={newEditPromptTemplate} 
                onChange={(e) => setNewEditPromptTemplate(e.target.value)} 
                placeholder="Enter the full system prompt template..."
                className="min-h-[300px] text-xs font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditPromptDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEditPromptVersion}>Save Version</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ImageModal 
        isOpen={isUploadedModalOpen}
        onClose={closeUploadedImage}
        images={uploadedImageSlides}
        initialIndex={uploadedSelectedIndex || 0}
      />
      </TooltipProvider>
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
      <div className="flex items-center justify-between px-3 py-1 border rounded-lg bg-card h-9">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
                      className={`relative flex-none w-12 h-12 rounded cursor-pointer border-2 transition-all bg-slate-50 dark:bg-slate-900/50 ${
                        isSelected ? 'border-primary scale-95' : 'border-transparent hover:border-slate-500'
                      } ${disabled && !isSelected ? 'opacity-50 grayscale pointer-events-none' : ''}`}
                      onClick={() => onToggle(url)}
                    >
                      <img 
                        src={url} 
                        alt={`Archived ${index}`} 
                        className="w-full h-full object-contain rounded"
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
    <div className={`w-full ${disabled ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
      <Label htmlFor="product-image-upload" className="cursor-pointer text-center w-full">
        <div className="py-2 px-4 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-lg hover:border-primary transition-colors text-[11px] font-bold uppercase tracking-wider text-muted-foreground bg-white dark:bg-card">
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
  );
};

const ShotTypeItem = ({ 
  id, 
  label, 
  description, 
  count, 
  onChange, 
  onClear,
  customContext, 
  onCustomContextChange,
  templates,
  onSaveTemplate,
  onRemoveTemplate,
  background,
  onBackgroundUpload,
  noImage,
  onNoImageChange,
  createSimilar,
  onCreateSimilarChange
}: { 
  id: string, 
  label: string, 
  description: string, 
  count: number, 
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void, 
  onClear: () => void,
  customContext: string, 
  onCustomContextChange: (value: string) => void,
  templates: { name: string, text: string }[],
  onSaveTemplate: (name: string, text: string) => void,
  onRemoveTemplate: (name: string) => void,
  background: string | null,
  onBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  noImage: boolean,
  onNoImageChange: (value: boolean) => void,
  createSimilar: boolean,
  onCreateSimilarChange: (value: boolean) => void
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
    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md bg-white dark:bg-card">
      <div className="bg-slate-50 dark:bg-slate-900/80 px-3 py-1.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col min-w-0">
          <Label htmlFor={id} className="text-[15px] font-bold text-yellow-600 dark:text-yellow-200 uppercase tracking-wider leading-tight">
            {label}
          </Label>
          <span className="text-[15px] text-slate-600 dark:text-muted-foreground leading-tight italic">
            {description}
          </span>
        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors dark:bg-slate-900/50"
                                onClick={onClear}
                                data-testid={`${id}-clear-count`}
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Reset count to 0</p>
                            </TooltipContent>
                          </Tooltip>
                          <Input
                            id={id}
                            type="number"
                            min="0"
                            max="10"
                            value={count}
                            onChange={onChange}
                            data-testid={`${id}-count`}
                            className="w-12 h-7 text-xs px-1.5 bg-background border-slate-700 text-center font-bold"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <CardContent className="p-2 pt-1.5">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className={`h-7 px-2 text-[10px] flex items-center gap-1.5 transition-all ${showCustom ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800'}`}
                                    onClick={() => setShowCustom(!showCustom)}
                                  >
                                    <Plus className={`h-3 w-3 ${showCustom ? 'rotate-45' : ''} transition-transform`} />
                                    <span>Context</span>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Add custom instructions for this shot type</p>
                                </TooltipContent>
                              </Tooltip>
              
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900/50 rounded-md p-0.5 border border-slate-200 dark:border-slate-800">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload a specific background for this shot type</p>
                  </TooltipContent>
                </Tooltip>
                <Input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={onBackgroundUpload}
                  data-testid={`${id}-background-upload`}
                />
                {background && (
                  <div className="relative group pr-1">
                    <img 
                      src={background} 
                      alt="Background" 
                      className="w-5 h-5 object-cover rounded border border-slate-700 shadow-sm"
                      data-testid={`uploaded-${id}-background`}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900/50 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5">
                    <Checkbox 
                      id={`${id}-no-image`}
                      checked={noImage}
                      onCheckedChange={(checked) => onNoImageChange(!!checked)}
                      className="h-3.5 w-3.5 border-slate-300 dark:border-slate-600"
                    />
                    <Label htmlFor={`${id}-no-image`} className="text-[10px] font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground transition-colors">
                      no-img
                    </Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate images without using product reference images (Text-only mode)</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900/50 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5">
                    <Checkbox 
                      id={`${id}-create-similar`}
                      checked={createSimilar}
                      onCheckedChange={(checked) => onCreateSimilarChange(!!checked)}
                      className="h-3.5 w-3.5 border-slate-300 dark:border-slate-600"
                    />
                    <Label htmlFor={`${id}-create-similar`} className="text-[10px] font-medium text-muted-foreground whitespace-nowrap cursor-pointer hover:text-foreground transition-colors">
                      similar
                    </Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate images with more variations while maintaining consistency</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          {showCustom && (
            <div className="mt-2 pl-2 border-l-2 border-slate-300 dark:border-slate-700 w-full flex flex-col gap-2 bg-slate-50 dark:bg-slate-900/30 p-2 rounded-r-md">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Label htmlFor={`${id}-custom`} className="text-[10px] uppercase font-bold text-muted-foreground shrink-0">Custom Context</Label>
                  {templates.length > 0 && (
                    <div className="flex items-center gap-1 min-w-0">
                      <select 
                        className="text-[9px] bg-background border border-slate-700 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-ring w-full max-w-[120px]"
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
                        <option value="" disabled>Templates...</option>
                        {templates.map(t => (
                          <option key={t.name} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                      {selectedTemplate && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 text-red-400 hover:text-red-500 hover:bg-red-500/10 shrink-0"
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
                <div className="flex items-center gap-1 shrink-0">
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
                className="text-[10px] min-h-[60px] resize-y bg-white dark:bg-slate-950 border-yellow-600 dark:border-yellow-200 text-black dark:text-white placeholder:text-slate-400"
              />
            </div>
          )}
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
  lifestyleCreateSimilar,
  onLifestyleCreateSimilarChange,
  heroCreateSimilar,
  onHeroCreateSimilarChange,
  closeUpsCreateSimilar,
  onCloseUpsCreateSimilarChange,
  flatLayCreateSimilar,
  onFlatLayCreateSimilarChange,
  macroCreateSimilar,
  onMacroCreateSimilarChange,
  contextualCreateSimilar,
  onContextualCreateSimilarChange,
  themedEnvironmentCreateSimilar,
  onThemedEnvironmentCreateSimilarChange,
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
  onThemedEnvironmentBackgroundUpload,
  lifestyleNoImage,
  onLifestyleNoImageChange,
  heroNoImage,
  onHeroNoImageChange,
  closeUpsNoImage,
  onCloseUpsNoImageChange,
  flatLayNoImage,
  onFlatLayNoImageChange,
  macroNoImage,
  onMacroNoImageChange,
  contextualNoImage,
  onContextualNoImageChange,
  themedEnvironmentNoImage,
  onThemedEnvironmentNoImageChange,
  onSelectAll,
  onClearAllShots,
  onClearShotCount
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
  lifestyleNoImage: boolean,
  onLifestyleNoImageChange: (value: boolean) => void,
  heroNoImage: boolean,
  onHeroNoImageChange: (value: boolean) => void,
  closeUpsNoImage: boolean,
  onCloseUpsNoImageChange: (value: boolean) => void,
  flatLayNoImage: boolean,
  onFlatLayNoImageChange: (value: boolean) => void,
  macroNoImage: boolean,
  onMacroNoImageChange: (value: boolean) => void,
  contextualNoImage: boolean,
  onContextualNoImageChange: (value: boolean) => void,
  themedEnvironmentNoImage: boolean,
  onThemedEnvironmentNoImageChange: (value: boolean) => void,
  lifestyleCreateSimilar: boolean,
  onLifestyleCreateSimilarChange: (value: boolean) => void,
  heroCreateSimilar: boolean,
  onHeroCreateSimilarChange: (value: boolean) => void,
  closeUpsCreateSimilar: boolean,
  onCloseUpsCreateSimilarChange: (value: boolean) => void,
  flatLayCreateSimilar: boolean,
  onFlatLayCreateSimilarChange: (value: boolean) => void,
  macroCreateSimilar: boolean,
  onMacroCreateSimilarChange: (value: boolean) => void,
  contextualCreateSimilar: boolean,
  onContextualCreateSimilarChange: (value: boolean) => void,
  themedEnvironmentCreateSimilar: boolean,
  onThemedEnvironmentCreateSimilarChange: (value: boolean) => void,
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
  onThemedEnvironmentBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onSelectAll: () => void,
  onClearAllShots: () => void,
  onClearShotCount: (id: string) => void
}) => {
  const createShotType = (
    id: string,
    label: string,
    description: string,
    count: number,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    onClear: () => void,
    customContext: string,
    onCustomContextChange: (value: string) => void,
    background: string | null,
    onBackgroundUpload: (event: React.ChangeEvent<HTMLInputElement>) => void,
    createSimilar: boolean,
    onCreateSimilarChange: (value: boolean) => void,
    noImage: boolean,
    onNoImageChange: (value: boolean) => void
  ) => ({
    id,
    label,
    description,
    count,
    onChange,
    onClear,
    customContext,
    onCustomContextChange,
    background,
    onBackgroundUpload,
    createSimilar,
    onCreateSimilarChange,
    noImage,
    onNoImageChange
  });

  const shotTypes = [
    createShotType(
      "hero-shots",
      "Hero Shot",
      "e.g. Eye-level, centered, slightly blurred background (Product focus).",
      heroShotsCount,
      onHeroShotsChange,
      () => onClearShotCount("hero-shots"),
      heroCustomContext,
      onHeroCustomContextChange,
      heroBackground,
      onHeroBackgroundUpload,
      heroCreateSimilar,
      onHeroCreateSimilarChange,
      heroNoImage,
      onHeroNoImageChange
    ),
    createShotType(
      "flat-lay-shots",
      "Flat Lay",
      "e.g. Top-down view on a textured surface with ingredients scattered around.",
      flatLayShotsCount,
      onFlatLayShotsChange,
      () => onClearShotCount("flat-lay-shots"),
      flatLayCustomContext,
      onFlatLayCustomContextChange,
      flatLayBackground,
      onFlatLayBackgroundUpload,
      flatLayCreateSimilar,
      onFlatLayCreateSimilarChange,
      flatLayNoImage,
      onFlatLayNoImageChange
    ),
    createShotType(
      "lifestyle-shots",
      "Lifestyle",
      "e.g. The product being held by a hand or sitting in a lunchbox/gym bag.",
      lifestyleShotsCount,
      onLifestyleShotsChange,
      () => onClearShotCount("lifestyle-shots"),
      lifestyleCustomContext,
      onLifestyleCustomContextChange,
      lifestyleBackground,
      onLifestyleBackgroundUpload,
      lifestyleCreateSimilar,
      onLifestyleCreateSimilarChange,
      lifestyleNoImage,
      onLifestyleNoImageChange
    ),
    createShotType(
      "macro-shots",
      "Macro/Detail",
      "e.g. Close-up on the pouch opening showing the texture of the banana chips.",
      macroShotsCount,
      onMacroShotsChange,
      () => onClearShotCount("macro-shots"),
      macroCustomContext,
      onMacroCustomContextChange,
      macroBackground,
      onMacroBackgroundUpload,
      macroCreateSimilar,
      onMacroCreateSimilarChange,
      macroNoImage,
      onMacroNoImageChange
    ),
    createShotType(
      "contextual-shots",
      "Contextual",
      "e.g. The product on a pantry shelf or a kitchen counter to show scale.",
      contextualShotsCount,
      onContextualShotsChange,
      () => onClearShotCount("contextual-shots"),
      contextualCustomContext,
      onContextualCustomContextChange,
      contextualBackground,
      onContextualBackgroundUpload,
      contextualCreateSimilar,
      onContextualCreateSimilarChange,
      contextualNoImage,
      onContextualNoImageChange
    ),
    createShotType(
      "themed-environment",
      "Themed Environment",
      "e.g. The product is placed in a realistic, thematic setting.",
      themedEnvironmentShotsCount,
      onThemedEnvironmentShotsChange,
      () => onClearShotCount("themed-environment"),
      themedEnvironmentCustomContext,
      onThemedEnvironmentCustomContextChange,
      themedEnvironmentBackground,
      onThemedEnvironmentBackgroundUpload,
      themedEnvironmentCreateSimilar,
      onThemedEnvironmentCreateSimilarChange,
      themedEnvironmentNoImage,
      onThemedEnvironmentNoImageChange
    ),
    createShotType(
      "close-ups",
      "Close-ups",
      "e.g. Detailed shots of specific parts of the product.",
      closeUpsCount,
      onCloseUpsChange,
      () => onClearShotCount("close-ups"),
      closeUpsCustomContext,
      onCloseUpsCustomContextChange,
      closeUpsBackground,
      onCloseUpsBackgroundUpload,
      closeUpsCreateSimilar,
      onCloseUpsCreateSimilarChange,
      closeUpsNoImage,
      onCloseUpsNoImageChange
    ),
  ];

  return (
    <Card className="w-full overflow-hidden border-slate-200 dark:border-slate-800">
      <CardHeader className="bg-slate-100 dark:bg-slate-900/80 border-b-2 border-slate-400 dark:border-slate-800 h-11 flex flex-row items-center justify-between py-0 px-4 space-y-0">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100">Shots Selection</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAllShots}
            className="h-7 text-[10px] px-2 font-bold uppercase tracking-tight text-slate-900 hover:bg-red-500/20 hover:text-red-600 transition-colors"
            data-testid="clear-all-shots"
            title="Clear all shots"
          >
            <Eraser className="h-3 w-3 mr-1" />
            Clear
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onSelectAll}
            className="h-7 text-[10px] px-2 font-bold uppercase tracking-tight bg-slate-900 text-slate-100 hover:bg-slate-800 transition-colors border-none"
            data-testid="select-all-shots"
          >
            Select All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 p-3 bg-slate-50/50 dark:bg-slate-950/20">
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
  onArchive,
  onClick
}: { 
  src: string | null, 
  isPrimary: boolean, 
  isArchived: boolean,
  onSelectPrimary?: () => void,
  onRemove: () => void,
  onArchive: () => void,
  onClick: () => void
}) => {
  if (!src) return null;

  return (
    <div className="relative group aspect-square bg-slate-50 dark:bg-slate-900/50 rounded">
      <img
        src={src}
        alt="Product"
        data-testid="uploaded-product-image"
        className={`w-full h-full object-contain rounded shadow-md cursor-pointer transition-all hover:scale-[1.02] ${isPrimary ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        onClick={onClick}
      />
      {isPrimary && (
        <div className="absolute -top-1 -left-1 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm z-10">
          <Check className="h-3 w-3" />
        </div>
      )}
      <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className="h-6 w-6 bg-red-600 hover:bg-red-700 text-white border-none shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Trash className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Remove this reference image</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="h-6 w-6 bg-slate-800 hover:bg-slate-700 text-white border-none shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onArchive();
              }}
              disabled={isArchived}
            >
              <Archive className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{isArchived ? "Already archived" : "Save to archives for future use"}</p>
          </TooltipContent>
        </Tooltip>

        {onSelectPrimary && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isPrimary ? "default" : "secondary"}
                size="icon"
                className={`h-6 w-6 border-none shadow-lg ${isPrimary ? 'bg-primary text-primary-foreground' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPrimary();
                }}
              >
                <ImageIcon className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Set as the primary reference image</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

const Seed = ({ seeds }: { seeds: number[] }) => {
  if (seeds.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5" data-testid="seeds-display">
      <span className="text-[10px] font-bold text-muted-foreground uppercase shrink-0">seed:</span>
      <div className="flex flex-wrap gap-1">
        {seeds.map((seed, idx) => (
          <span 
            key={`${seed}-${idx}`} 
            className="text-[10px] font-mono text-green-500 whitespace-nowrap bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/30 shadow-sm" 
            data-testid={`seed-item-${idx}`}
          >
            {seed}
          </span>
        ))}
      </div>
    </div>
  );
};

  const SystemPromptPane = React.memo(({ 
  prompt,
  temperature,
  onTemperatureChange,
  promptVersions,
  selectedPromptVersion,
  onPromptVersionChange,
  selectedModel,
  onModelChange,
  images,
  currentSeeds
}: { 
  prompt: string,
  temperature: number,
  onTemperatureChange: (value: number) => void,
  promptVersions: { version: string, date: string, template: string }[],
  selectedPromptVersion: string,
  onPromptVersionChange: (version: string) => void,
  selectedModel: string,
  onModelChange: (model: string) => void,
  images: any[],
  currentSeeds: number[]
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const seedsToDisplay = currentSeeds.length > 0 
    ? currentSeeds 
    : images.filter(img => img.seed !== undefined && img.seed !== null).map(img => img.seed);

  const hasSeeds = seedsToDisplay.length > 0;

  return (
    <Card className="w-full mt-20 overflow-hidden flex flex-col bg-white dark:bg-card border-slate-200 dark:border-slate-800" data-testid="system-prompt-pane">
      <CardHeader className="bg-slate-100 dark:bg-slate-900/80 border-b-2 border-slate-400 dark:border-slate-800 h-11 flex flex-row items-center justify-between py-0 px-4 space-y-0">
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-slate-100">System Prompt</CardTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-slate-900 dark:text-slate-100 hover:bg-slate-900/10 transition-colors flex items-center gap-1.5" 
                onClick={handleCopy}
                disabled={!prompt}
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-700" /> : <Copy className="h-3.5 w-3.5" />}
                <span className="text-[10px] font-bold uppercase tracking-tight">Copy</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy the full system prompt to clipboard</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-2">
          {promptVersions.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2" data-testid="prompt-version-container">
                  <select 
                    className="text-sm bg-slate-900 text-slate-100 border-none rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-ring h-7 font-bold"
                    value={selectedPromptVersion}
                    onChange={(e) => onPromptVersionChange(e.target.value)}
                    data-testid="prompt-version-select"
                  >
                    {promptVersions.map((v, idx) => (
                      <option key={v.version} value={v.version}>v{idx + 1}</option>
                    ))}
                  </select>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select a specific version of the system prompt template</p>
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2" data-testid="model-selection-container">
                <select 
                  className="text-sm bg-slate-900 text-slate-100 border-none rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-ring h-7 font-bold"
                  value={selectedModel}
                  onChange={(e) => onModelChange(e.target.value)}
                  data-testid="model-selection-select"
                >
                  <option value="gemini-3-pro-image-preview">Nano Banana Pro</option>
                  <option value="gemini-2.5-flash-image">Nano Banana</option>
                </select>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Choose the AI model used for image generation</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-2 space-y-2">
        {hasSeeds && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-white dark:bg-slate-900/50 p-1.5 rounded-md border border-slate-200 dark:border-slate-800">
                <Seed seeds={seedsToDisplay} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>The unique identifier used for deterministic image generation</p>
            </TooltipContent>
          </Tooltip>
        )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="temperature-slider" className="text-[10px] text-muted-foreground uppercase font-bold"><span className="text-slate-900 dark:text-orange-500">Temperature</span> <span className="font-normal">(randomness)</span></Label>
                      <span className="text-sm font-mono bg-muted px-1 rounded">{temperature.toFixed(1)}</span>
                    </div>
                    <input 
                      id="temperature-slider"
                      type="range"
                      min="0"
                      max="2"
                      step="0.5"
                      value={temperature}
                      onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
                      className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-white dark:[&::-webkit-slider-runnable-track]:bg-gradient-to-r dark:[&::-webkit-slider-runnable-track]:from-orange-950 dark:[&::-webkit-slider-runnable-track]:to-orange-500 dark:[&::-moz-range-track]:bg-gradient-to-r dark:[&::-moz-range-track]:from-orange-950 dark:[&::-moz-range-track]:to-orange-500 [&::-webkit-slider-runnable-track]:bg-slate-200 [&::-moz-range-track]:bg-slate-200"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Adjust how creative or focused the AI should be. Higher values increase randomness.</p>
                </TooltipContent>
              </Tooltip>

        <div className="h-4" />

        <div 
          className="text-sm whitespace-pre-wrap font-mono bg-muted p-2 rounded-lg min-h-[400px] border border-input focus-within:ring-1 focus-within:ring-ring overflow-auto"
          data-testid="system-prompt-display"
        >
          {prompt ? (
            prompt.split('\n').map((line, i) => (
              <div key={i} className="min-h-[1.25rem]">
                {line.split(/(NONCE: NONCE-[a-z0-9]+-\d+|SCENE OVERRIDE: .*|Generate \d+ image\(s\)\.|Shot type: .*|• Replace the .* text with: .*)/g).map((part, j) => {
                  const isNonce = part.startsWith('NONCE: NONCE-');
                  const isOverride = part.startsWith('SCENE OVERRIDE:');
                  const isImageCount = part.startsWith('Generate ') && part.includes(' image(s).');
                  const isShotType = part.startsWith('Shot type:');
                  const isEditSpec = part.startsWith('• Replace the ') && part.includes(' text with: ');
                  
                  if (isNonce || isOverride || isImageCount || isShotType || isEditSpec) {
                    return <span key={j} className="text-orange-500 font-bold">{part}</span>;
                  }
                  return <span key={j}>{part}</span>;
                })}
              </div>
            ))
          ) : (
            <span className="text-muted-foreground">No system prompt available yet. Generate images to see the prompt sent to Gemini.</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export default App;
