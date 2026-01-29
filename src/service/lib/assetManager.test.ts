import * as fs from 'fs';
import * as path from 'path';
import { archiveImageFiles, saveImageToAssets } from './assetManager';

describe('Asset Manager Archiving', () => {
  const TEST_GENERATED_DIR = path.join(process.cwd(), 'src', 'assets', 'generated-images');
  const TEST_ARCHIVED_DIR = path.join(process.cwd(), 'src', 'assets', 'archived-images');
  const TEST_UPLOADS_DIR = path.join(process.cwd(), 'src', 'assets', 'uploads');

  beforeAll(() => {
    if (!fs.existsSync(TEST_GENERATED_DIR)) fs.mkdirSync(TEST_GENERATED_DIR, { recursive: true });
  });

  it('archives a file from generated-images to archived-images', async () => {
    const fileName = 'test-image.png';
    const filePath = path.join(TEST_GENERATED_DIR, fileName);
    fs.writeFileSync(filePath, 'fake-image-content');

    const imageUrl = `/src/assets/generated-images/${fileName}`;
    await archiveImageFiles([imageUrl], 'archived');

    const archivedPath = path.join(TEST_ARCHIVED_DIR, fileName);
    expect(fs.existsSync(archivedPath)).toBe(true);
    expect(fs.readFileSync(archivedPath, 'utf8')).toBe('fake-image-content');

    // Cleanup
    if (fs.existsSync(archivedPath)) fs.unlinkSync(archivedPath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  });

  it('archives a data URL to uploads directory', async () => {
    const dataUrl = 'data:image/png;base64,ZmFrZS1pbWFnZS1jb250ZW50'; // 'fake-image-content' in base64
    
    await archiveImageFiles([dataUrl], 'uploads');

    // Check if a file was created in uploads directory
    const files = fs.readdirSync(TEST_UPLOADS_DIR);
    const uploadedFile = files.find(f => f.startsWith('upload-') && f.endsWith('.png'));
    
    expect(uploadedFile).toBeDefined();
    const uploadedPath = path.join(TEST_UPLOADS_DIR, uploadedFile!);
    expect(fs.readFileSync(uploadedPath, 'utf8')).toBe('fake-image-content');

    // Also check if it was temporarily saved in generated-images (side effect of our implementation)
    const generatedFiles = fs.readdirSync(TEST_GENERATED_DIR);
    const tempFile = generatedFiles.find(f => f.startsWith('upload-') && f.endsWith('.png'));
    expect(tempFile).toBeDefined();

    // Cleanup
    if (uploadedPath && fs.existsSync(uploadedPath)) fs.unlinkSync(uploadedPath);
    if (tempFile) fs.unlinkSync(path.join(TEST_GENERATED_DIR, tempFile));
  });
});
