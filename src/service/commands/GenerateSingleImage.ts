export const createGenerateSingleImage = (listingRepository: any) => {
  const execute = async (request: {
    type: string,
    customContext?: string,
    productImages?: string[],
    background?: string,
    model?: string,
    systemPrompt?: string
  }) => {
    return await listingRepository.generateSingleImage(request);
  };

  return { execute };
};
