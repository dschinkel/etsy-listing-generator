import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { X, Copy, Download } from 'lucide-react';

interface ListingPreviewProps {
  images: string[];
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
          {images.map((src, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={src}
                alt={`Listing ${index + 1}`}
                className="w-full h-full object-cover rounded shadow-md group-hover:scale-105 transition-transform"
                data-testid={`listing-image-${index}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.error(`Failed to load image at ${target.src}. Attempting fallback.`);
                  const fallbackSvg = `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22800%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23cccccc%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%23333333%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3EImage%20Load%20Failed%3C%2Ftext%3E%3C%2Fsvg%3E`;
                  if (target.src !== fallbackSvg) {
                    target.src = fallbackSvg;
                  }
                }}
              />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => onCopy(src)}
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingPreview;
