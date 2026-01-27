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
      copyImageToClipboard: jest.fn(),
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
      copyImageToClipboard: jest.fn(),
      downloadAllImagesAsZip: jest.fn(),
      fetchSystemPromptPreview: jest.fn()
    });

    render(<App />);

    const errorElement = screen.getByTestId('generation-error');
    expect(errorElement).toBeInTheDocument();
    expect(errorElement.textContent).toBe(errorMsg);
    
    // Verify it is below the button (conceptually, by checking order in DOM)
    const button = screen.getByText('Generate Listing Images');
    const container = button.parentElement;
    expect(container).toContainElement(errorElement);
    
    // In our implementation, error follows the button in the same flex-col container
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
      copyImageToClipboard: jest.fn(),
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
      copyImageToClipboard: jest.fn(),
      downloadAllImagesAsZip: jest.fn(),
      fetchSystemPromptPreview: jest.fn()
    });

    render(<App />);

    expect(screen.getByText(mockPrompt)).toBeInTheDocument();
  });
});
