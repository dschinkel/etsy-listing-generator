export class GenerateListingImages {
  constructor(private listingRepository: any) {}

  async execute(request: { 
    lifestyleCount?: number, 
    heroCount?: number,
    closeUpsCount?: number,
    productImage?: string,
    lifestyleBackground?: string,
    heroBackground?: string,
    closeUpsBackground?: string
  }) {
    return await this.listingRepository.generateImages(request);
  }
}
