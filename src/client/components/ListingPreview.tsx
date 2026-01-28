import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { X, Copy, Download } from 'lucide-react';

interface ListingImage {
  url: string;
  type: string;
}

interface ListingPreviewProps {
  images: ListingImage[];
  onRemove: (index: number) => void;
  onCopy: (src: string) => void;
  onDownloadAll: () => void;
}

const ListingPreview = ({ images, onRemove, onCopy, onDownloadAll }: ListingPreviewProps) => {
  if (images.length === 0) return null;

  return (
    <Card className="w-full mt-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Listing Preview</CardTitle>
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
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="listing-preview">
          {images.map((image, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="relative group aspect-square">
                <img
                  src={image.url}
                  alt={`Listing ${index + 1}`}
                  className="w-full h-full object-cover rounded shadow-md group-hover:scale-105 transition-transform"
                  data-testid={`listing-image-${index}`}
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
                  <Button
                    variant="secondary"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => onCopy(image.url)}
                    data-testid={`copy-listing-image-${index}`}
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => onRemove(index)}
                    data-testid={`remove-listing-image-${index}`}
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <span className="text-xs text-yellow-200 font-medium px-1" data-testid={`listing-image-type-${index}`}>
                {image.type}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingPreview;
