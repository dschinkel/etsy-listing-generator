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
      removeImage: jest.fn(), clearImages: jest.fn(), deleteImage: jest.fn(),
      setPrimaryImage: jest.fn(),
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
      themedEnvironmentShotsCount: 0,
      handleThemedEnvironmentShotsChange: jest.fn(),
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
      themedEnvironmentBackground: null,
      handleThemedEnvironmentBackgroundUpload: jest.fn(),
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
      themedEnvironmentCustomContext: '',
      handleThemedEnvironmentCustomContextChange: jest.fn(),
      templates: [],
      saveContextTemplate: jest.fn(),
      removeContextTemplate: jest.fn(),
      totalShots: 0,
      isReadyToGenerate: false
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
      removeImage: jest.fn(), clearImages: jest.fn(), deleteImage: jest.fn(),
      setPrimaryImage: jest.fn(),
      downloadImage: jest.fn(),
      downloadAllImagesAsZip: jest.fn(),
      fetchSystemPromptPreview: jest.fn()
    });

    (useProductUpload as jest.Mock).mockReturnValue({
      productImage: 'some-image',
      lifestyleShotsCount: 1,
      totalShots: 1,
      isReadyToGenerate: true,
      // ... include other necessary mock fields if needed, 
      // but usually the hook mock just needs what the component uses.
      // Let's ensure it has at least the basic return structure.
      heroShotsCount: 0,
      closeUpsCount: 0,
      flatLayShotsCount: 0,
      macroShotsCount: 0,
      contextualShotsCount: 0,
      themedEnvironmentShotsCount: 0,
      templates: [],
      saveContextTemplate: jest.fn(),
      removeContextTemplate: jest.fn(),
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
      removeImage: jest.fn(), clearImages: jest.fn(), deleteImage: jest.fn(),
      downloadImage: jest.fn(),
      downloadAllImagesAsZip: jest.fn(),
      fetchSystemPromptPreview: jest.fn()
    });

    (useProductUpload as jest.Mock).mockReturnValue({
      productImage: 'some-image',
      lifestyleShotsCount: 1,
      totalShots: 1,
      isReadyToGenerate: true,
      heroShotsCount: 0,
      closeUpsCount: 0,
      flatLayShotsCount: 0,
      macroShotsCount: 0,
      contextualShotsCount: 0,
      themedEnvironmentShotsCount: 0,
      templates: [],
      saveContextTemplate: jest.fn(),
      removeContextTemplate: jest.fn(),
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
      removeImage: jest.fn(), clearImages: jest.fn(), deleteImage: jest.fn(),
      downloadImage: jest.fn(),
      downloadAllImagesAsZip: jest.fn(),
      fetchSystemPromptPreview: jest.fn()
    });

    (useProductUpload as jest.Mock).mockReturnValue({
      productImage: 'some-image',
      lifestyleShotsCount: 0,
      totalShots: 0,
      isReadyToGenerate: false,
      heroShotsCount: 0,
      closeUpsCount: 0,
      flatLayShotsCount: 0,
      macroShotsCount: 0,
      contextualShotsCount: 0,
      themedEnvironmentShotsCount: 0,
      templates: [],
      saveContextTemplate: jest.fn(),
      removeContextTemplate: jest.fn(),
    });

    render(<App />);

    const button = screen.getByText('Generate Listing Images');
    expect(button).toBeDisabled();
  });

  it('is enabled when at least one shot is selected and product image is uploaded', () => {
    (useProductUpload as jest.Mock).mockReturnValue({
      productImage: 'some-image',
      handleUpload: jest.fn(),
      handleRemoveProductImage: jest.fn(),
      lifestyleShotsCount: 1, // At least one shot
      totalShots: 1,
      isReadyToGenerate: true,
      heroShotsCount: 0,
      closeUpsCount: 0,
      flatLayShotsCount: 0,
      macroShotsCount: 0,
      contextualShotsCount: 0,
      themedEnvironmentShotsCount: 0,
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
      themedEnvironmentBackground: null,
      handleThemedEnvironmentBackgroundUpload: jest.fn(),
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
      themedEnvironmentCustomContext: '',
      handleThemedEnvironmentCustomContextChange: jest.fn(),
      templates: [],
      saveContextTemplate: jest.fn(),
      removeContextTemplate: jest.fn()
    });

    render(<App />);

    const button = screen.getByText('Generate Listing Images');
    expect(button).not.toBeDisabled();
  });

  it('displays "Upload a product image to start" when no product image is uploaded', () => {
    (useProductUpload as jest.Mock).mockReturnValue({
      productImage: null,
      lifestyleShotsCount: 1,
      totalShots: 1,
      isReadyToGenerate: false,
      heroShotsCount: 0,
      closeUpsCount: 0,
      flatLayShotsCount: 0,
      macroShotsCount: 0,
      contextualShotsCount: 0,
      themedEnvironmentShotsCount: 0,
      templates: [],
      saveContextTemplate: jest.fn(),
      removeContextTemplate: jest.fn(),
    });
    render(<App />);
    const message = screen.getByText('Upload a product image to start');
    expect(message).toBeInTheDocument();
    expect(message.className).toContain('yellow');
    
    const button = screen.getByText('Generate Listing Images');
    expect(button).toBeDisabled();
  });

  it('displays "Specify a Shots Selection" in green when product image is uploaded but no shots selected', () => {
    (useProductUpload as jest.Mock).mockReturnValue({
      productImage: 'some-image',
      lifestyleShotsCount: 0, // No shots
      totalShots: 0,
      isReadyToGenerate: false,
      heroShotsCount: 0,
      closeUpsCount: 0,
      flatLayShotsCount: 0,
      macroShotsCount: 0,
      contextualShotsCount: 0,
      themedEnvironmentShotsCount: 0,
      templates: [],
      saveContextTemplate: jest.fn(),
      removeContextTemplate: jest.fn(),
      handleUpload: jest.fn(),
      handleRemoveProductImage: jest.fn(),
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
      themedEnvironmentBackground: null,
      handleThemedEnvironmentBackgroundUpload: jest.fn(),
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
      themedEnvironmentCustomContext: '',
      handleThemedEnvironmentCustomContextChange: jest.fn()
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

  it('hides "Specify a Shots Selection" when both product image and at least one shot are present', () => {
    (useProductUpload as jest.Mock).mockReturnValue({
      productImage: 'some-image',
      lifestyleShotsCount: 1, // At least one shot
      totalShots: 1,
      isReadyToGenerate: true,
      heroShotsCount: 0,
      closeUpsCount: 0,
      flatLayShotsCount: 0,
      macroShotsCount: 0,
      contextualShotsCount: 0,
      themedEnvironmentShotsCount: 0,
      templates: [],
      saveContextTemplate: jest.fn(),
      removeContextTemplate: jest.fn(),
      handleUpload: jest.fn(),
      handleRemoveProductImage: jest.fn(),
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
      themedEnvironmentBackground: null,
      handleThemedEnvironmentBackgroundUpload: jest.fn(),
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
      themedEnvironmentCustomContext: '',
      handleThemedEnvironmentCustomContextChange: jest.fn()
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
      removeImage: jest.fn(), clearImages: jest.fn(), deleteImage: jest.fn(),
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
      themedEnvironmentShotsCount: 0,
      handleThemedEnvironmentShotsChange: jest.fn(),
      handleLifestyleShotsChange: jest.fn(),
      handleCloseUpsChange: jest.fn(),
      handleFlatLayShotsChange: jest.fn(),
      handleMacroShotsChange: jest.fn(),
      handleContextualShotsChange: jest.fn(),
      lifestyleCustomContext: '',
      handleLifestyleCustomContextChange: jest.fn(),
      closeUpsCustomContext: '',
      handleCloseUpsCustomContextChange: jest.fn(),
      flatLayCustomContext: '',
      handleFlatLayCustomContextChange: jest.fn(),
      macroCustomContext: '',
      handleMacroCustomContextChange: jest.fn(),
      contextualCustomContext: '',
      handleContextualCustomContextChange: jest.fn(),
      themedEnvironmentCustomContext: '',
      handleThemedEnvironmentCustomContextChange: jest.fn(),
      saveContextTemplate: jest.fn(),
      removeContextTemplate: jest.fn(),
      handleUpload: jest.fn(),
      handleRemoveProductImage: jest.fn(),
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
      themedEnvironmentBackground: null,
      handleThemedEnvironmentBackgroundUpload: jest.fn(),
    });

    render(<App />);
    
    // Open custom context section
    const addButtons = screen.getAllByTitle('Add custom context');
    fireEvent.click(addButtons[0]); // Hero shot is first

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();

    fireEvent.change(select, { target: { value: 'Kitchen' } });

    expect(onHeroCustomContextChange).toHaveBeenCalledWith('Existing\nIn a kitchen');
  });

  it( 'removes a template', async () => {
    const onRemoveTemplate = jest.fn();
    (useProductUpload as jest.Mock).mockReturnValue({
      heroShotsCount: 1,
      heroCustomContext: '',
      handleHeroCustomContextChange: jest.fn(),
      templates: [{ name: 'Kitchen', text: 'In a kitchen' }],
      removeContextTemplate: onRemoveTemplate,
      lifestyleShotsCount: 0,
      closeUpsCount: 0,
      flatLayShotsCount: 0,
      macroShotsCount: 0,
      contextualShotsCount: 0,
      themedEnvironmentShotsCount: 0,
      handleThemedEnvironmentShotsChange: jest.fn(),
      handleLifestyleShotsChange: jest.fn(),
      handleCloseUpsChange: jest.fn(),
      handleFlatLayShotsChange: jest.fn(),
      handleMacroShotsChange: jest.fn(),
      handleContextualShotsChange: jest.fn(),
      lifestyleCustomContext: '',
      handleLifestyleCustomContextChange: jest.fn(),
      closeUpsCustomContext: '',
      handleCloseUpsCustomContextChange: jest.fn(),
      flatLayCustomContext: '',
      handleFlatLayCustomContextChange: jest.fn(),
      macroCustomContext: '',
      handleMacroCustomContextChange: jest.fn(),
      contextualCustomContext: '',
      handleContextualCustomContextChange: jest.fn(),
      themedEnvironmentCustomContext: '',
      handleThemedEnvironmentCustomContextChange: jest.fn(),
      saveContextTemplate: jest.fn(),
      handleUpload: jest.fn(),
      handleRemoveProductImage: jest.fn(),
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
      themedEnvironmentBackground: null,
      handleThemedEnvironmentBackgroundUpload: jest.fn(),
    });

    render(<App />);
    
    const addButtons = screen.getAllByTitle('Add custom context');
    fireEvent.click(addButtons[0]);

    const select = screen.getByTestId('hero-shots-template-select');
    fireEvent.change(select, { target: { value: 'Kitchen' } });

    const removeButton = screen.getByTestId('hero-shots-remove-template');
    fireEvent.click(removeButton);

    expect(screen.getByText(/Are you sure you want to remove/)).toBeInTheDocument();
    
    const confirmButton = screen.getByRole('button', { name: 'Remove Template' });
    fireEvent.click(confirmButton);

    expect(onRemoveTemplate).toHaveBeenCalledWith('Kitchen');
  });

  it('saves a template', async () => {
    const onSaveTemplate = jest.fn();
    (useProductUpload as jest.Mock).mockReturnValue({
      heroShotsCount: 1,
      heroCustomContext: 'My context',
      handleHeroCustomContextChange: jest.fn(),
      templates: [],
      saveContextTemplate: onSaveTemplate,
      lifestyleShotsCount: 0,
      closeUpsCount: 0,
      flatLayShotsCount: 0,
      macroShotsCount: 0,
      contextualShotsCount: 0,
      themedEnvironmentShotsCount: 0,
      handleThemedEnvironmentShotsChange: jest.fn(),
      handleLifestyleShotsChange: jest.fn(),
      handleCloseUpsChange: jest.fn(),
      handleFlatLayShotsChange: jest.fn(),
      handleMacroShotsChange: jest.fn(),
      handleContextualShotsChange: jest.fn(),
      lifestyleCustomContext: '',
      handleLifestyleCustomContextChange: jest.fn(),
      closeUpsCustomContext: '',
      handleCloseUpsCustomContextChange: jest.fn(),
      flatLayCustomContext: '',
      handleFlatLayCustomContextChange: jest.fn(),
      macroCustomContext: '',
      handleMacroCustomContextChange: jest.fn(),
      contextualCustomContext: '',
      handleContextualCustomContextChange: jest.fn(),
      themedEnvironmentCustomContext: '',
      handleThemedEnvironmentCustomContextChange: jest.fn(),
      removeContextTemplate: jest.fn(),
      handleUpload: jest.fn(),
      handleRemoveProductImage: jest.fn(),
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
      themedEnvironmentBackground: null,
      handleThemedEnvironmentBackgroundUpload: jest.fn(),
    });

    render(<App />);
    
    const addButtons = screen.getAllByTitle('Add custom context');
    fireEvent.click(addButtons[0]);

    const saveButton = screen.getByTitle('Save as template');
    fireEvent.click(saveButton);

    expect(screen.getByText('Save as Template')).toBeInTheDocument();
    
    const nameInput = screen.getByLabelText('Template Name');
    fireEvent.change(nameInput, { target: { value: 'New Template' } });
    
    const confirmSaveButton = screen.getByRole('button', { name: 'Save Template' });
    fireEvent.click(confirmSaveButton);
    expect(onSaveTemplate).toHaveBeenCalledWith('New Template', 'My context');
  });

  it('allows setting an image as primary', () => {
    const setPrimaryImage = jest.fn();
    (useListingGeneration as jest.Mock).mockReturnValue({
      images: [
        { url: 'image1.png', type: 'lifestyle' },
        { url: 'image2.png', type: 'hero' }
      ],
      systemPrompt: '',
      error: null,
      isGenerating: false,
      generateListing: jest.fn(),
      removeImage: jest.fn(), clearImages: jest.fn(), deleteImage: jest.fn(),
      setPrimaryImage,
      downloadImage: jest.fn(),
      downloadAllImagesAsZip: jest.fn(),
      fetchSystemPromptPreview: jest.fn()
    });

    render(<App />);

    const primaryCheckbox = screen.getByTestId('set-primary-etsy-image-0');
    fireEvent.click(primaryCheckbox);
    expect(setPrimaryImage).toHaveBeenCalledWith(0);
  });

  it('has reduced gap in listing preview items', () => {
    (useListingGeneration as jest.Mock).mockReturnValue({
      images: [{ url: 'image1.png', type: 'lifestyle' }],
      systemPrompt: '',
      error: null,
      isGenerating: false,
      generateListing: jest.fn(),
      removeImage: jest.fn(), clearImages: jest.fn(), deleteImage: jest.fn(),
      setPrimaryImage: jest.fn(),
      downloadImage: jest.fn(),
      downloadAllImagesAsZip: jest.fn(),
      fetchSystemPromptPreview: jest.fn()
    });

    render(<App />);
    
    // The container for the image and its details
    const previewItem = screen.getByTestId('listing-image-0').parentElement?.parentElement;
    expect(previewItem).toHaveClass('gap-1');
  });
});
