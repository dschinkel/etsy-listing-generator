import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

interface ListingPreviewProps {
  images: string[];
}

const ListingPreview = ({ images }: ListingPreviewProps) => {
  if (images.length === 0) return null;

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Listing Preview</CardTitle>
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
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingPreview;
