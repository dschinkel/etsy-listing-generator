export class ListingRepository {
  constructor(private dataLayer: any) {}

  async generateImages(params: { 
    lifestyleCount?: number, 
    heroCount?: number,
    closeUpsCount?: number,
    productImage?: string,
    lifestyleBackground?: string,
    heroBackground?: string,
    closeUpsBackground?: string
  }) {
    const images: string[] = [];
    
    await this.lifestyleImages(params.lifestyleCount, params.productImage, params.lifestyleBackground, images);
    await this.heroImages(params.heroCount, params.productImage, params.heroBackground, images);
    await this.closeUpsImages(params.closeUpsCount, params.productImage, params.closeUpsBackground, images);

    return { images };
  }

  private async lifestyleImages(count: number = 0, productImage?: string, background?: string, images: string[] = []) {
    for (let i = 0; i < count; i++) {
      images.push(await this.dataLayer.generateImage({ 
        type: 'lifestyle',
        prompt: 'a lifestyle shot of the product in a realistic setting',
        productImage,
        background
      }));
    }
  }

  private async heroImages(count: number = 0, productImage?: string, background?: string, images: string[] = []) {
    for (let i = 0; i < count; i++) {
      images.push(await this.dataLayer.generateImage({ 
        type: 'hero',
        prompt: 'a hero shot of the product, prominently displayed',
        productImage,
        background
      }));
    }
  }

  private async closeUpsImages(count: number = 0, productImage?: string, background?: string, images: string[] = []) {
    for (let i = 0; i < count; i++) {
      images.push(await this.dataLayer.generateImage({ 
        type: 'close-up',
        prompt: 'a close-up shot of the product, showing fine details',
        productImage,
        background
      }));
    }
  }
}
