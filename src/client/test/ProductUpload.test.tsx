import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

beforeEach(() => {
  render(<App />);
});

describe('Product Upload', () => {
  it('allows uploading a PNG image as the product image', async () => {
    const file = new File(['(binary data)'], 'product.png', { type: 'image/png' });
    const input = screen.getByTestId('product-image-upload');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByTestId('uploaded-product-image')).toBeInTheDocument();
    });
  });

  it('allows uploading a JPEG image as the product image', async () => {
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
    const input = screen.getByTestId('lifestyle-shots-count');
    fireEvent.change(input, { target: { value: '3' } });
    
    expect(input).toHaveValue(3);
  });

  it('allows specifying the number of hero shots', async () => {
    const input = screen.getByTestId('hero-shots-count');
    fireEvent.change(input, { target: { value: '5' } });
    
    expect(input).toHaveValue(5);
  });

  it('allows specifying the number of close-ups', async () => {
    const input = screen.getByTestId('close-ups-count');
    fireEvent.change(input, { target: { value: '2' } });
    
    expect(input).toHaveValue(2);
  });
});

describe('Primary Image Selection', () => {
  it('allows specifying which image will be used as the primary etsy image', async () => {
    // Simulate some images being present in the future, 
    // for now we'll just test the selection mechanism on the uploaded product image
    const file = new File(['(binary data)'], 'product.png', { type: 'image/png' });
    const input = screen.getByTestId('product-image-upload');
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByTestId('uploaded-product-image')).toBeInTheDocument();
    });

    const primaryCheckbox = screen.getByTestId('set-primary-image');
    fireEvent.click(primaryCheckbox);
    
    expect(primaryCheckbox).toBeChecked();
  });
});

describe('Background Upload', () => {
  it('allows uploading a background image for lifestyle shots', async () => {
    const file = new File(['(binary data)'], 'background.png', { type: 'image/png' });
    const input = screen.getByTestId('lifestyle-background-upload');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByTestId('uploaded-lifestyle-background')).toBeInTheDocument();
    });
  });

  it('allows uploading a background image for hero shots', async () => {
    const file = new File(['(binary data)'], 'hero-bg.png', { type: 'image/png' });
    const input = screen.getByTestId('hero-background-upload');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByTestId('uploaded-hero-background')).toBeInTheDocument();
    });
  });

  it('allows uploading a background image for close-ups', async () => {
    const file = new File(['(binary data)'], 'closeup-bg.png', { type: 'image/png' });
    const input = screen.getByTestId('close-ups-background-upload');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByTestId('uploaded-close-ups-background')).toBeInTheDocument();
    });
  });
});

describe('Image Removal', () => {
  it('allows removing the uploaded product image', async () => {
    const file = new File(['(binary data)'], 'product.png', { type: 'image/png' });
    const input = screen.getByTestId('product-image-upload');
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByTestId('uploaded-product-image')).toBeInTheDocument();
    });

    const removeButton = screen.getByTestId('remove-product-image');
    fireEvent.click(removeButton);
    
    expect(screen.queryByTestId('uploaded-product-image')).not.toBeInTheDocument();
  });
});
