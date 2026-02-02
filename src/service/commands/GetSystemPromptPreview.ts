export const createGetSystemPromptPreview = (listingRepository: any) => {
  const execute = async (request: { 
    lifestyleCount?: number, 
    heroCount?: number,
    closeUpsCount?: number,
    flatLayCount?: number,
    macroCount?: number,
    contextualCount?: number,
    themedEnvironmentCount?: number,
    lifestyleCustomContext?: string,
    heroCustomContext?: string,
    closeUpsCustomContext?: string,
    flatLayCustomContext?: string,
    macroCustomContext?: string,
    contextualCustomContext?: string,
    themedEnvironmentCustomContext?: string,
    editSpecifications?: {field: string, value: string}[],
    editCount?: number,
    systemPromptTemplate?: string,
    editPromptTemplate?: string,
    editPromptLineTemplate?: string
  }) => {
    return listingRepository.getPromptPreview(request);
  };

  return { execute };
};
