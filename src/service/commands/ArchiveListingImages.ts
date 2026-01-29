export const createArchiveListingImages = (listingRepository: any) => {
  const execute = async (request: { imageUrls: string[] }) => {
    if (!request.imageUrls || !Array.isArray(request.imageUrls)) {
      throw new Error('Image URLs array is required');
    }
    await listingRepository.archiveImages(request.imageUrls);
    return { success: true };
  };

  return { execute };
};
