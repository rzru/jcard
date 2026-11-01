const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_SIZE = 20 * 1024 * 1024;

export function validateImage(file: File): string | undefined {
  if (!IMAGE_TYPES.has(file.type)) {
    return 'Choose a JPG, PNG, or WebP image.';
  }

  return file.size > MAX_IMAGE_SIZE ? 'Image must be smaller than 20 MB.' : undefined;
}
