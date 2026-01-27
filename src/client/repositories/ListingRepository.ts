export class ListingRepository {
  async generateImages(params: { 
    lifestyleCount?: number, 
    heroCount?: number, 
    closeUpsCount?: number,
    productImage?: string | null,
    lifestyleBackground?: string | null,
    heroBackground?: string | null,
    closeUpsBackground?: string | null
  }) {
    const response = await fetch('/listings/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server Error (${response.status}): ${errorText}`);
    }

    return await response.json();
  }
}
