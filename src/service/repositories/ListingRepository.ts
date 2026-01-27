export class ListingRepository {
  constructor(private dataLayer: any) {}

  async generateImages(params: { 
    lifestyleCount?: number, 
    heroCount?: number,
    closeUpsCount?: number,
    productImage?: string 
  }) {
    const images: string[] = [];
    
    await this.lifestyleImages(params.lifestyleCount, params.productImage, images);
    await this.heroImages(params.heroCount, params.productImage, images);
    await this.closeUpsImages(params.closeUpsCount, params.productImage, images);

    return { images };
  }

  private async lifestyleImages(count: number = 0, productImage?: string, images: string[] = []) {
    for (let i = 0; i < count; i++) {
      images.push(await this.dataLayer.generateImage({ 
        type: 'lifestyle',
        prompt: 'a lifestyle shot of a product',
        productImage
      }));
    }
  }

  private async heroImages(count: number = 0, productImage?: string, images: string[] = []) {
    for (let i = 0; i < count; i++) {
      images.push(await this.dataLayer.generateImage({ 
        type: 'hero',
        prompt: 'a hero shot of a product',
        productImage
      }));
    }
  }

  private async closeUpsImages(count: number = 0, productImage?: string, images: string[] = []) {
    for (let i = 0; i < count; i++) {
      images.push(await this.dataLayer.generateImage({ 
        type: 'close-up',
        prompt: 'a close-up shot of a product',
        productImage
      }));
    }
  }
}
