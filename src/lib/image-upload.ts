const JPEG = [0xff, 0xd8, 0xff];
const PNG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

const startsWith = (bytes: Uint8Array, signature: number[]) =>
  bytes.length >= signature.length && signature.every((value, index) => bytes[index] === value);

export type AllowedImageType = 'image/jpeg' | 'image/png' | 'image/webp';

export async function sniffAllowedImageType(file: File): Promise<AllowedImageType | null> {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (startsWith(bytes, JPEG)) return 'image/jpeg';
  if (startsWith(bytes, PNG)) return 'image/png';
  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
}
