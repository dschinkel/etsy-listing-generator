export const createPushToEtsy = (etsyRepository: any) => {
  const execute = async (request: any) => {
    const { shop_id, images, ...listingDetails } = request;
    
    const result = await etsyRepository.createListing({
      shop_id,
      ...listingDetails
    });
    
    const listingId = result.listing_id;
    
    if (images && images.length > 0) {
      for (const imageUrl of images) {
        await etsyRepository.uploadImage(shop_id, listingId, imageUrl);
      }
    }
    
    return {
      success: true,
      listing_id: listingId,
      url: `https://www.etsy.com/listing/${listingId}`
    };
  };

  return { execute };
};
