import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('Product Upload', () => {
  it('allows uploading a PNG image as the product image', async () => {
    render(<App />);
    
    const file = new File(['(binary data)'], 'product.png', { type: 'image/png' });
    const input = screen.getByTestId('product-image-upload');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByTestId('uploaded-product-image')).toBeInTheDocument();
    });
  });

  it('allows uploading a JPEG image as the product image', async () => {
    render(<App />);
    
    const file = new File(['(binary data)'], 'product.jpg', { type: 'image/jpeg' });
    const input = screen.getByTestId('product-image-upload');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByTestId('uploaded-product-image')).toBeInTheDocument();
    });
  });
});
