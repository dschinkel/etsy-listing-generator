export const createGenerateListingImages = (listingRepository: any) => {
  const execute = async (request: { 
    lifestyleCount?: number, 
    heroCount?: number,
    closeUpsCount?: number,
    flatLayCount?: number,
    macroCount?: number,
    contextualCount?: number,
    productImage?: string,
    lifestyleBackground?: string,
    heroBackground?: string,
    closeUpsBackground?: string,
    flatLayBackground?: string,
    macroBackground?: string,
    contextualBackground?: string,
    model?: string
  }) => {
    return await listingRepository.generateImages(request);
  };

  return { execute };
};
