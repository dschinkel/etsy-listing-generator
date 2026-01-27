export class ListingRepository {
  constructor(private dataLayer: any) {}

  async generateImages(params: { 
    lifestyleCount?: number, 
    heroCount?: number,
    closeUpsCount?: number,
    flatLayCount?: number,
    macroCount?: number,
    contextualCount?: number,
    productImage?: string,
    lifestyleBackground?: string,
    heroBackground?: string,
    closeUpsBackground?: string,
    flatLayBackground?: string,
    macroBackground?: string,
    contextualBackground?: string
  }) {
    const images: string[] = [];
    
    await this.lifestyleImages(params.lifestyleCount, params.productImage, params.lifestyleBackground, images);
    await this.heroImages(params.heroCount, params.productImage, params.heroBackground, images);
    await this.closeUpsImages(params.closeUpsCount, params.productImage, params.closeUpsBackground, images);
    await this.flatLayImages(params.flatLayCount, params.productImage, params.flatLayBackground, images);
    await this.macroImages(params.macroCount, params.productImage, params.macroBackground, images);
    await this.contextualImages(params.contextualCount, params.productImage, params.contextualBackground, images);

    return { images };
  }

  private async lifestyleImages(count: number = 0, productImage?: string, background?: string, images: string[] = []) {
    for (let i = 0; i < count; i++) {
      images.push(await this.dataLayer.generateImage({ 
        type: 'lifestyle',
        prompt: 'a lifestyle shot of the product in a realistic setting',
        productImage,
        background,
        count
      }));
    }
  }

  private async heroImages(count: number = 0, productImage?: string, background?: string, images: string[] = []) {
    for (let i = 0; i < count; i++) {
      images.push(await this.dataLayer.generateImage({ 
        type: 'hero',
        prompt: 'a hero shot of the product, prominently displayed',
        productImage,
        background,
        count
      }));
    }
  }

  private async closeUpsImages(count: number = 0, productImage?: string, background?: string, images: string[] = []) {
    for (let i = 0; i < count; i++) {
      images.push(await this.dataLayer.generateImage({ 
        type: 'close-up',
        prompt: 'a close-up shot of the product, showing fine details',
        productImage,
        background,
        count
      }));
    }
  }

  private async flatLayImages(count: number = 0, productImage?: string, background?: string, images: string[] = []) {
    for (let i = 0; i < count; i++) {
      images.push(await this.dataLayer.generateImage({ 
        type: 'flat-lay',
        prompt: 'a top-down flat lay shot of the product on a textured surface',
        productImage,
        background,
        count
      }));
    }
  }

  private async macroImages(count: number = 0, productImage?: string, background?: string, images: string[] = []) {
    for (let i = 0; i < count; i++) {
      images.push(await this.dataLayer.generateImage({ 
        type: 'macro',
        prompt: 'a macro close-up shot of the product, focusing on texture',
        productImage,
        background,
        count
      }));
    }
  }

  private async contextualImages(count: number = 0, productImage?: string, background?: string, images: string[] = []) {
    for (let i = 0; i < count; i++) {
      images.push(await this.dataLayer.generateImage({ 
        type: 'contextual',
        prompt: 'a contextual shot of the product in a real-world setting to show scale',
        productImage,
        background,
        count
      }));
    }
  }
}
