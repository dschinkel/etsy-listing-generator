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

describe('Image Generation Configuration', () => {
  it('allows specifying the number of lifestyle shots', async () => {
    render(<App />);
    
    const input = screen.getByTestId('lifestyle-shots-count');
    fireEvent.change(input, { target: { value: '3' } });
    
    expect(input).toHaveValue(3);
  });

  it('allows specifying the number of hero shots', async () => {
    render(<App />);
    
    const input = screen.getByTestId('hero-shots-count');
    fireEvent.change(input, { target: { value: '5' } });
    
    expect(input).toHaveValue(5);
  });

  it('allows specifying the number of close-ups', async () => {
    render(<App />);
    
    const input = screen.getByTestId('close-ups-count');
    fireEvent.change(input, { target: { value: '2' } });
    
    expect(input).toHaveValue(2);
  });
});
