export class ListingController {
  async generate(ctx: any) {
    // Scaffold: Passthrough to command will be added in Step 4
    ctx.body = { images: [] };
    ctx.status = 200;
  }
}
