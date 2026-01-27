export class GenerateListingImages {
  constructor(private listingRepository: any) {}

  async execute(request: { 
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
    return await this.listingRepository.generateImages(request);
  }
}
