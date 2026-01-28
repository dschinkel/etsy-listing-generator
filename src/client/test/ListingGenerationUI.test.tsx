import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Mock the hook to control states
jest.mock('../hooks/useListingGeneration', () => ({
  useListingGeneration: jest.fn()
}));

import { useListingGeneration } from '../hooks/useListingGeneration';

describe('Listing Generation UI', () => {
  beforeEach(() => {
    (useListingGeneration as jest.Mock).mockReturnValue({
      images: [],
      systemPrompt: '',
      error: null,
      isGenerating: false,
      generateListing: jest.fn(),
      removeImage: jest.fn(),
      downloadImage: jest.fn(),
      downloadAllImagesAsZip: jest.fn(),
      fetchSystemPromptPreview: jest.fn()
    });
  });

  it('displays error message below the generate button', async () => {
    const errorMsg = 'Something went wrong';
    (useListingGeneration as jest.Mock).mockReturnValue({
      images: [],
      systemPrompt: '',
      error: errorMsg,
      isGenerating: false,
      generateListing: jest.fn(),
      removeImage: jest.fn(),
      downloadImage: jest.fn(),
      downloadAllImagesAsZip: jest.fn(),
      fetchSystemPromptPreview: jest.fn()
    });

    render(<App />);

    const errorElement = screen.getByTestId('generation-error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement.textContent).toBe(errorMsg);
    
    const button = screen.getByText('Generate Listing Images');
    const container = button.parentElement;
    expect(container).toContainElement(errorElement);
    
    expect(button.nextElementSibling).toBe(errorElement);
  });

  it('displays status message during fallback', async () => {
    const statusMsg = 'Gemini is overloaded. Retrying with Imagen...';
    (useListingGeneration as jest.Mock).mockReturnValue({
      images: [],
      systemPrompt: '',
      error: statusMsg,
      isGenerating: true,
      generateListing: jest.fn(),
      removeImage: jest.fn(),
      downloadImage: jest.fn(),
      downloadAllImagesAsZip: jest.fn(),
      fetchSystemPromptPreview: jest.fn()
    });

    render(<App />);

    const errorElement = screen.getByTestId('generation-error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement.textContent).toBe(statusMsg);
    
    const button = screen.getByText('Generating Listing Images...');
    expect(button).toBeDisabled();
  });

  it('is disabled when no shots are selected', () => {
    (useListingGeneration as jest.Mock).mockReturnValue({
      images: [],
      systemPrompt: '',
      error: null,
      isGenerating: false,
      generateListing: jest.fn(),
      removeImage: jest.fn(),
      downloadImage: jest.fn(),
      downloadAllImagesAsZip: jest.fn(),
      fetchSystemPromptPreview: jest.fn()
    });

    render(<App />);

    const button = screen.getByText('Generate Listing Images');
    expect(button).toBeDisabled();
  });

  it('is enabled when at least one shot is selected', () => {
    (useListingGeneration as jest.Mock).mockReturnValue({
      images: [],
      systemPrompt: '',
      error: null,
      isGenerating: false,
      generateListing: jest.fn(),
      removeImage: jest.fn(),
      downloadImage: jest.fn(),
      downloadAllImagesAsZip: jest.fn(),
      fetchSystemPromptPreview: jest.fn()
    });

    render(<App />);

    const heroInput = screen.getByLabelText('Hero Shot');
    fireEvent.change(heroInput, { target: { value: '1' } });

    const button = screen.getByText('Generate Listing Images');
    expect(button).not.toBeDisabled();
  });

  it('displays "Specify a Shots Selection" in green when no shots are selected', () => {
    render(<App />);
    const message = screen.getByText('Specify a Shots Selection');
    expect(message).toBeInTheDocument();
    // We check for a green class. Tailwind green colors usually have 'green' in them.
    expect(message.className).toContain('green');
    
    const button = screen.getByText('Generate Listing Images');
    // Verify it is above the button
    expect(button.previousElementSibling).toBe(message);
  });

  it('hides "Specify a Shots Selection" when at least one shot is selected', () => {
    render(<App />);
    const heroInput = screen.getByLabelText('Hero Shot');
    fireEvent.change(heroInput, { target: { value: '1' } });
    
    expect(screen.queryByText('Specify a Shots Selection')).not.toBeInTheDocument();
  });

  it('displays system prompt even when generation fails', async () => {
    const errorMsg = 'Generation failed';
    const mockPrompt = 'Role: Mock prompt';
    (useListingGeneration as jest.Mock).mockReturnValue({
      images: [],
      systemPrompt: mockPrompt,
      error: errorMsg,
      isGenerating: false,
      generateListing: jest.fn(),
      removeImage: jest.fn(),
      downloadImage: jest.fn(),
      downloadAllImagesAsZip: jest.fn(),
      fetchSystemPromptPreview: jest.fn()
    });

    render(<App />);

    expect(screen.getByText(mockPrompt)).toBeInTheDocument();
  });
});
