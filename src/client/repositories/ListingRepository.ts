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
      let errorDetail = '';
      try {
        const errorJson = await response.json();
        errorDetail = errorJson.error || errorJson.message || JSON.stringify(errorJson);
      } catch (e) {
        errorDetail = await response.text();
      }
      throw new Error(`Server Error (${response.status}): ${errorDetail}`);
    }

    return await response.json();
  }
}
