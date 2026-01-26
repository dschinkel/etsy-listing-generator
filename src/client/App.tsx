import React from 'react';
import { useProductUpload } from './hooks/useProductUpload';

const App = () => {
  const { productImage, handleUpload } = useProductUpload();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900">
      <Title />
      <UploadImage onUpload={handleUpload} />
      <UploadedImage src={productImage} />
    </div>
  );
};

const Title = () => {
  return <h1 className="text-3xl font-bold mb-8">Etsy Listing Generator</h1>;
};

const UploadImage = ({ onUpload }: { onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg">
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={onUpload}
        data-testid="product-image-upload"
      />
    </div>
  );
};

const UploadedImage = ({ src }: { src: string | null }) => {
  if (!src) return null;

  return (
    <div className="mt-8">
      <img
        src={src}
        alt="Product"
        data-testid="uploaded-product-image"
        className="max-w-xs rounded shadow-lg"
      />
    </div>
  );
};

export default App;
