export class ListingRepository {
  constructor(private dataLayer: any) {}

  async generateImages(params: { lifestyleCount: number, productImage?: string }) {
    const images: string[] = [];
    for (let i = 0; i < params.lifestyleCount; i++) {
      const imageUrl = await this.dataLayer.generateImage({ 
        type: 'lifestyle',
        prompt: 'a lifestyle shot of a product',
        productImage: params.productImage
      });
      images.push(imageUrl);
    }
    return { images };
  }
}
