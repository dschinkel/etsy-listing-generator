export const createSaveListingImage = (listingRepository: any) => {
  const execute = async (request: { imageUrl: string, type: string }) => {
    if (!request.imageUrl) {
      throw new Error('Image URL is required');
    }
    if (!request.type) {
      throw new Error('Image type is required');
    }
    const savedUrl = await listingRepository.saveImage(request.imageUrl, request.type);
    return { url: savedUrl };
  };

  return { execute };
};
