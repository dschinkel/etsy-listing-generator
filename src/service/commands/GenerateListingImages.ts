export const createGenerateListingImages = (listingRepository: any) => {
  const execute = async (request: { 
    lifestyleCount?: number, 
    heroCount?: number,
    closeUpsCount?: number,
    flatLayCount?: number,
    macroCount?: number,
    contextualCount?: number,
    themedEnvironmentCount?: number,
    productImages?: string[],
    lifestyleBackground?: string,
    heroBackground?: string,
    closeUpsBackground?: string,
    flatLayBackground?: string,
    macroBackground?: string,
    contextualBackground?: string,
    themedEnvironmentBackground?: string,
    lifestyleCustomContext?: string,
    heroCustomContext?: string,
    closeUpsCustomContext?: string,
    flatLayCustomContext?: string,
    macroCustomContext?: string,
    contextualCustomContext?: string,
    themedEnvironmentCustomContext?: string,
    lifestyleCreateSimilar?: boolean,
    heroCreateSimilar?: boolean,
    closeUpsCreateSimilar?: boolean,
    flatLayCreateSimilar?: boolean,
    macroCreateSimilar?: boolean,
    contextualCreateSimilar?: boolean,
    themedEnvironmentCreateSimilar?: boolean,
    editSpecifications?: {field: string, value: string}[],
    editCount?: number,
    temperature?: number,
    model?: string,
    systemPromptTemplate?: string,
    editPromptTemplate?: string,
    editPromptLineTemplate?: string
  }) => {
    return await listingRepository.generateImages(request);
  };

  return { execute };
};
