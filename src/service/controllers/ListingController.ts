import { GenerateListingImages } from '../commands/GenerateListingImages';
import { ListingRepository } from '../repositories/ListingRepository';
import { GeminiImageGenerator } from '../data/GeminiImageGenerator';

export class ListingController {
  private generateListingImages: GenerateListingImages;

  constructor() {
    const dataLayer = new GeminiImageGenerator();
    const repository = new ListingRepository(dataLayer);
    this.generateListingImages = new GenerateListingImages(repository);
  }

  async generate(ctx: any) {
    const request = ctx.request.body;
    const result = await this.generateListingImages.execute(request);
    ctx.body = result;
    ctx.status = 200;
  }
}
