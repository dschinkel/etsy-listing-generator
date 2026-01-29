import * as fs from 'fs';
import * as path from 'path';
import { fetch } from 'undici';

const GENERATED_ASSETS_DIR = path.join(process.cwd(), 'assets', 'generated-images');

if (!fs.existsSync(GENERATED_ASSETS_DIR)) {
  fs.mkdirSync(GENERATED_ASSETS_DIR, { recursive: true });
}

/**
 * Saves an image (base64 data URL or external URL) to the assets/generated-images directory.
 * Returns the local URL path.
 */
export async function saveImageToAssets(imageData: string, type: string): Promise<string> {
  const fileName = `${type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  let extension = 'png';
  let buffer: Buffer;

  if (imageData.startsWith('data:image/')) {
    const match = imageData.match(/^data:image\/(\w+);base64,(.+)$/);
    if (match) {
      extension = match[1];
      buffer = Buffer.from(match[2], 'base64');
    } else {
      throw new Error('Invalid base64 image data');
    }
  } else if (imageData.startsWith('http')) {
    const response = await fetch(imageData);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${imageData}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
    
    // Try to guess extension from content-type or URL
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.startsWith('image/')) {
      extension = contentType.split('/')[1];
    } else {
      const urlExtension = imageData.split('.').pop()?.split(/[?#]/)[0];
      if (urlExtension && ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(urlExtension.toLowerCase())) {
        extension = urlExtension;
      }
    }
  } else {
    throw new Error('Unsupported image data format');
  }

  const fullFileName = `${fileName}.${extension}`;
  const filePath = path.join(GENERATED_ASSETS_DIR, fullFileName);
  
  fs.writeFileSync(filePath, buffer);
  
  return `/assets/generated-images/${fullFileName}`;
}

/**
 * Deletes an image from the assets/generated-images directory.
 */
export async function deleteImageFromAssets(imageUrl: string): Promise<void> {
  if (!imageUrl.startsWith('/assets/generated-images/')) {
    return; // Not a local generated image
  }

  const fileName = imageUrl.replace('/assets/generated-images/', '');
  const filePath = path.join(GENERATED_ASSETS_DIR, fileName);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(`Failed to delete image: ${filePath}`, error);
  }
}
