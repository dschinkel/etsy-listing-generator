export class GenerateListingImages {
  constructor(private listingRepository: any) {}

  async execute(request: { lifestyleCount: number }) {
    return await this.listingRepository.generateImages(request);
  }
}
