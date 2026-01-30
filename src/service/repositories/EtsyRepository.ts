export const createEtsyRepository = (dataLayer: any) => {
  const createListing = async (listingData: any) => {
    return await dataLayer.createListing(listingData);
  };

  const uploadImage = async (shopId: string, listingId: string, imageUrl: string) => {
    return await dataLayer.uploadImage(shopId, listingId, imageUrl);
  };

  return { createListing, uploadImage };
};
