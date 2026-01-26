import { useState } from 'react';

export const useProductUpload = () => {
  const [productImage, setProductImage] = useState<string | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    productImage,
    handleUpload,
  };
};
