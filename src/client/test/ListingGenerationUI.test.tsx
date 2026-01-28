import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Mock the hooks to control states
jest.mock('../hooks/useListingGeneration', () => ({
  useListingGeneration: jest.fn()
}));

jest.mock('../hooks/useProductUpload', () => ({
  useProductUpload: jest.fn()
}));

import { useListingGeneration } from '../hooks/useListingGeneration';
import { useProductUpload } from '../hooks/useProductUpload';

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

    (useProductUpload as jest.Mock).mockReturnValue({
      productImage: null,
      handleUpload: jest.fn(),
      handleRemoveProductImage: jest.fn(),
      lifestyleShotsCount: 0,
      handleLifestyleShotsChange: jest.fn(),
      heroShotsCount: 0,
      handleHeroShotsChange: jest.fn(),
      closeUpsCount: 0,
      handleCloseUpsChange: jest.fn(),
      flatLayShotsCount: 0,
      handleFlatLayShotsChange: jest.fn(),
      macroShotsCount: 0,
      handleMacroShotsChange: jest.fn(),
      contextualShotsCount: 0,
      handleContextualShotsChange: jest.fn(),
      isPrimaryImage: false,
      handlePrimarySelection: jest.fn(),
      lifestyleBackground: null,
      handleLifestyleBackgroundUpload: jest.fn(),
      heroBackground: null,
      handleHeroBackgroundUpload: jest.fn(),
      closeUpsBackground: null,
      handleCloseUpsBackgroundUpload: jest.fn(),
      flatLayBackground: null,
      handleFlatLayBackgroundUpload: jest.fn(),
      macroBackground: null,
      handleMacroBackgroundUpload: jest.fn(),
      contextualBackground: null,
      handleContextualBackgroundUpload: jest.fn(),
      lifestyleCustomContext: '',
      handleLifestyleCustomContextChange: jest.fn(),
      heroCustomContext: '',
      handleHeroCustomContextChange: jest.fn(),
      closeUpsCustomContext: '',
      handleCloseUpsCustomContextChange: jest.fn(),
      flatLayCustomContext: '',
      handleFlatLayCustomContextChange: jest.fn(),
      macroCustomContext: '',
      handleMacroCustomContextChange: jest.fn(),
      contextualCustomContext: '',
      handleContextualCustomContextChange: jest.fn(),
      templates: [],
      saveContextTemplate: jest.fn()
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
    (useProductUpload as jest.Mock).mockReturnValue({
      productImage: null,
      handleUpload: jest.fn(),
      handleRemoveProductImage: jest.fn(),
      lifestyleShotsCount: 1, // At least one shot
      handleLifestyleShotsChange: jest.fn(),
      heroShotsCount: 0,
      handleHeroShotsChange: jest.fn(),
      closeUpsCount: 0,
      handleCloseUpsChange: jest.fn(),
      flatLayShotsCount: 0,
      handleFlatLayShotsChange: jest.fn(),
      macroShotsCount: 0,
      handleMacroShotsChange: jest.fn(),
      contextualShotsCount: 0,
      handleContextualShotsChange: jest.fn(),
      isPrimaryImage: false,
      handlePrimarySelection: jest.fn(),
      lifestyleBackground: null,
      handleLifestyleBackgroundUpload: jest.fn(),
      heroBackground: null,
      handleHeroBackgroundUpload: jest.fn(),
      closeUpsBackground: null,
      handleCloseUpsBackgroundUpload: jest.fn(),
      flatLayBackground: null,
      handleFlatLayBackgroundUpload: jest.fn(),
      macroBackground: null,
      handleMacroBackgroundUpload: jest.fn(),
      contextualBackground: null,
      handleContextualBackgroundUpload: jest.fn(),
      lifestyleCustomContext: '',
      handleLifestyleCustomContextChange: jest.fn(),
      heroCustomContext: '',
      handleHeroCustomContextChange: jest.fn(),
      closeUpsCustomContext: '',
      handleCloseUpsCustomContextChange: jest.fn(),
      flatLayCustomContext: '',
      handleFlatLayCustomContextChange: jest.fn(),
      macroCustomContext: '',
      handleMacroCustomContextChange: jest.fn(),
      contextualCustomContext: '',
      handleContextualCustomContextChange: jest.fn(),
      templates: [],
      saveContextTemplate: jest.fn()
    });

    render(<App />);

    const button = screen.getByText('Generate Listing Images');
    expect(button).not.toBeDisabled();
  });

  it('displays "Specify a Shots Selection" in green when no shots are selected', () => {
    (useProductUpload as jest.Mock).mockReturnValue({
      productImage: null,
      handleUpload: jest.fn(),
      handleRemoveProductImage: jest.fn(),
      lifestyleShotsCount: 0, // No shots
      handleLifestyleShotsChange: jest.fn(),
      heroShotsCount: 0,
      handleHeroShotsChange: jest.fn(),
      closeUpsCount: 0,
      handleCloseUpsChange: jest.fn(),
      flatLayShotsCount: 0,
      handleFlatLayShotsChange: jest.fn(),
      macroShotsCount: 0,
      handleMacroShotsChange: jest.fn(),
      contextualShotsCount: 0,
      handleContextualShotsChange: jest.fn(),
      isPrimaryImage: false,
      handlePrimarySelection: jest.fn(),
      lifestyleBackground: null,
      handleLifestyleBackgroundUpload: jest.fn(),
      heroBackground: null,
      handleHeroBackgroundUpload: jest.fn(),
      closeUpsBackground: null,
      handleCloseUpsBackgroundUpload: jest.fn(),
      flatLayBackground: null,
      handleFlatLayBackgroundUpload: jest.fn(),
      macroBackground: null,
      handleMacroBackgroundUpload: jest.fn(),
      contextualBackground: null,
      handleContextualBackgroundUpload: jest.fn(),
      lifestyleCustomContext: '',
      handleLifestyleCustomContextChange: jest.fn(),
      heroCustomContext: '',
      handleHeroCustomContextChange: jest.fn(),
      closeUpsCustomContext: '',
      handleCloseUpsCustomContextChange: jest.fn(),
      flatLayCustomContext: '',
      handleFlatLayCustomContextChange: jest.fn(),
      macroCustomContext: '',
      handleMacroCustomContextChange: jest.fn(),
      contextualCustomContext: '',
      handleContextualCustomContextChange: jest.fn(),
      templates: [],
      saveContextTemplate: jest.fn()
    });
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
    (useProductUpload as jest.Mock).mockReturnValue({
      productImage: null,
      handleUpload: jest.fn(),
      handleRemoveProductImage: jest.fn(),
      lifestyleShotsCount: 1, // At least one shot
      handleLifestyleShotsChange: jest.fn(),
      heroShotsCount: 0,
      handleHeroShotsChange: jest.fn(),
      closeUpsCount: 0,
      handleCloseUpsChange: jest.fn(),
      flatLayShotsCount: 0,
      handleFlatLayShotsChange: jest.fn(),
      macroShotsCount: 0,
      handleMacroShotsChange: jest.fn(),
      contextualShotsCount: 0,
      handleContextualShotsChange: jest.fn(),
      isPrimaryImage: false,
      handlePrimarySelection: jest.fn(),
      lifestyleBackground: null,
      handleLifestyleBackgroundUpload: jest.fn(),
      heroBackground: null,
      handleHeroBackgroundUpload: jest.fn(),
      closeUpsBackground: null,
      handleCloseUpsBackgroundUpload: jest.fn(),
      flatLayBackground: null,
      handleFlatLayBackgroundUpload: jest.fn(),
      macroBackground: null,
      handleMacroBackgroundUpload: jest.fn(),
      contextualBackground: null,
      handleContextualBackgroundUpload: jest.fn(),
      lifestyleCustomContext: '',
      handleLifestyleCustomContextChange: jest.fn(),
      heroCustomContext: '',
      handleHeroCustomContextChange: jest.fn(),
      closeUpsCustomContext: '',
      handleCloseUpsCustomContextChange: jest.fn(),
      flatLayCustomContext: '',
      handleFlatLayCustomContextChange: jest.fn(),
      macroCustomContext: '',
      handleMacroCustomContextChange: jest.fn(),
      contextualCustomContext: '',
      handleContextualCustomContextChange: jest.fn(),
      templates: [],
      saveContextTemplate: jest.fn()
    });
    render(<App />);
    
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

  it('toggles custom context without crashing', () => {
    render(<App />);
    const addButtons = screen.getAllByTitle('Add custom context');
    fireEvent.click(addButtons[0]);
    
    expect(screen.getByText('Custom Context')).toBeInTheDocument();
  });

  it('populates and appends templates to custom context', () => {
    const onHeroCustomContextChange = jest.fn();
    (useProductUpload as jest.Mock).mockReturnValue({
      heroShotsCount: 1,
      heroCustomContext: 'Existing',
      handleHeroCustomContextChange: onHeroCustomContextChange,
      templates: [{ name: 'Kitchen', text: 'In a kitchen' }],
      // Need other fields to avoid crash
      lifestyleShotsCount: 0,
      closeUpsCount: 0,
      flatLayShotsCount: 0,
      macroShotsCount: 0,
      contextualShotsCount: 0,
    });

    render(<App />);
    
    // Open custom context section
    const addButtons = screen.getAllByTitle('Add custom context');
    fireEvent.click(addButtons[0]); // Hero shot is first

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Kitchen' } });

    expect(onHeroCustomContextChange).toHaveBeenCalledWith('Existing\nIn a kitchen');
  });
});
