export const createGetSystemPromptPreview = (listingRepository: any) => {
  const execute = async (request: { 
    lifestyleCount?: number, 
    heroCount?: number,
    closeUpsCount?: number,
    flatLayCount?: number,
    macroCount?: number,
    contextualCount?: number
  }) => {
    return listingRepository.getPromptPreview(request);
  };

  return { execute };
};
