import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { X, Archive, Copy, Download, Plus, RefreshCw, Save, Image as ImageIcon } from 'lucide-react';
import ImageModal from './ImageModal';
import { useListingPreview } from './useListingPreview';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import ModelStatus from './ModelStatus';

interface ListingImage {
  url: string;
  type: string;
  isPrimary?: boolean;
  isArchived?: boolean;
  isSaved?: boolean;
}

interface ListingPreviewProps {
  images: ListingImage[];
  isGenerating?: boolean;
  regeneratingIndex?: number | null;
  modelUsed?: string;
  onRemove: (index: number) => void;
  onClearAll: () => void;
  onArchiveAll: () => void;
  onArchiveImage: (index: number) => void;
  onSaveImage: (index: number) => void;
  onDownload: (src: string, index: number) => void;
  onDownloadAll: () => void;
  onSetPrimary: (index: number) => void;
  onRegenerate: (index: number, customContext: string) => void;
  onUploadManual: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ListingPreview = ({ 
  images, 
  isGenerating = false,
  regeneratingIndex = null,
  modelUsed = '',
  onRemove, 
  onClearAll, 
  onArchiveAll,
  onArchiveImage,
  onSaveImage,
  onDownload, 
  onDownloadAll, 
  onSetPrimary,
  onRegenerate,
  onUploadManual
}: ListingPreviewProps) => {
  const { selectedIndex, isModalOpen, openImage, closeImage } = useListingPreview();
  const [regenContexts, setRegenContexts] = React.useState<Record<number, string>>({});
  const [showRegenInputs, setShowRegenInputs] = React.useState<Record<number, boolean>>({});

  const hasImages = images.length > 0;
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <Card className="w-full h-full flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 flex-none bg-muted/30 border-b border-border/50">
          <div className="flex items-center gap-4">
            <CardTitle>Listing Images</CardTitle>
            {isGenerating && regeneratingIndex === null && modelUsed && (
              <ModelStatus model={modelUsed} />
            )}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => fileInputRef.current?.click()}
                data-testid="upload-manual-preview"
              >
                <Plus className="w-4 h-4" />
                Upload Images
              </Button>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={onUploadManual}
              />
            </div>
          </div>
          {hasImages && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onArchiveAll}
                className="flex items-center gap-2"
                data-testid="archive-all-images"
              >
                <Archive className="w-4 h-4" />
                Archive All
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={onClearAll}
                className="flex items-center gap-2"
                data-testid="clear-all-images"
              >
                <X className="w-4 h-4" />
                Clear All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onDownloadAll}
                className="flex items-center gap-2"
                data-testid="download-all-images"
              >
                <Download className="w-4 h-4" />
                Download All (.zip)
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pt-[10px]">
          {!hasImages ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-2">
              <ImageIcon className="w-12 h-12 opacity-20" />
              <p className="text-sm">No images generated yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4" data-testid="listing-preview">
              {images.map((image, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="relative group aspect-square bg-slate-50 dark:bg-slate-900/50 rounded">
                    <img
                      src={image.url}
                      alt={`Listing ${index + 1}`}
                      className="w-full h-full object-contain rounded shadow-md group-hover:scale-105 transition-transform cursor-pointer"
                      data-testid={`listing-image-${index}`}
                      onClick={() => openImage(index)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        console.error(`Failed to load image at ${target.src}. Attempting fallback.`);
                        const fallbackUrl = `https://placehold.co/800x800/cccccc/333333?text=Image+Load+Failed`;
                        if (target.src !== fallbackUrl) {
                          target.src = fallbackUrl;
                        }
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!image.isSaved && (
                        <Button
                          variant="secondary"
                          size="icon"
                          className="w-8 h-8 bg-green-600 hover:bg-green-700 text-white border-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSaveImage(index);
                          }}
                          data-testid={`save-listing-image-${index}`}
                          title="Save image"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="icon"
                        className="w-8 h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onArchiveImage(index);
                        }}
                        disabled={image.isArchived}
                        data-testid={`archive-listing-image-${index}`}
                        title={image.isArchived ? "Already archived" : "Archive image"}
                      >
                        <Archive className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="w-8 h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownload(image.url, index);
                        }}
                        data-testid={`download-listing-image-${index}`}
                        title="Download image"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="w-8 h-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(index);
                        }}
                        data-testid={`remove-listing-image-${index}`}
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-yellow-200 font-medium" data-testid={`listing-image-type-${index}`}>
                      {image.type}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => setShowRegenInputs(prev => ({ ...prev, [index]: !prev[index] }))}
                      title="Add custom context for regeneration"
                      data-testid={`toggle-regen-context-${index}`}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {showRegenInputs[index] && (
                    <div className="flex flex-col gap-1 px-1 mt-1">
                      <Textarea
                        placeholder="Custom context for this image..."
                        className="text-[10px] min-h-[40px] p-1 bg-white dark:bg-slate-950 border-yellow-600 dark:border-yellow-200 text-black dark:text-white placeholder:text-slate-400"
                        value={regenContexts[index] || ""}
                        onChange={(e) => setRegenContexts(prev => ({ ...prev, [index]: e.target.value }))}
                        data-testid={`regen-context-input-${index}`}
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1 px-1 mt-1">
                    <Button
                      size="sm"
                      className="h-7 text-[10px] flex items-center gap-1"
                      disabled={isGenerating}
                      onClick={() => onRegenerate(index, regenContexts[index] || "")}
                      data-testid={`regenerate-image-${index}`}
                    >
                      <RefreshCw className={`h-2 w-2 ${(isGenerating && regeneratingIndex === index) ? 'animate-spin' : ''}`} />
                      Regenerate
                    </Button>
                    
                    {isGenerating && regeneratingIndex === index && modelUsed && (
                      <ModelStatus model={modelUsed} />
                    )}
                  </div>

                  <div className="flex items-center space-x-2 px-1">
                    <Checkbox 
                      id={`primary-etsy-image-${index}`} 
                      checked={image.isPrimary || false}
                      onCheckedChange={() => onSetPrimary(index)}
                      data-testid={`set-primary-etsy-image-${index}`}
                    />
                    <Label 
                      htmlFor={`primary-etsy-image-${index}`}
                      className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Set as Primary Etsy Image
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ImageModal 
        isOpen={isModalOpen}
        onClose={closeImage}
        images={images}
        initialIndex={selectedIndex || 0}
      />
    </>
  );
};

export default ListingPreview;
