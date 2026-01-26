export class ListingRepository {
  constructor(private dataLayer: any) {}

  async generateListingImages(params: { type: string }) {
    const imageUrl = await this.dataLayer.generateImage(params);
    return { images: [imageUrl] };
  }
}
