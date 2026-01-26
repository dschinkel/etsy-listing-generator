export class ListingRepository {
  constructor(private dataLayer: any) {}

  async generateImages(params: { lifestyleCount: number }) {
    const images: string[] = [];
    for (let i = 0; i < params.lifestyleCount; i++) {
      const imageUrl = await this.dataLayer.generateImage({ 
        type: 'lifestyle',
        prompt: 'a lifestyle shot of a product'
      });
      images.push(imageUrl);
    }
    return { images };
  }
}
