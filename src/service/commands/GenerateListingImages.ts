export class GenerateListingImages {
  constructor(private listingRepository: any) {}

  async execute(request: { lifestyleCount: number, productImage?: string }) {
    return await this.listingRepository.generateImages(request);
  }
}
