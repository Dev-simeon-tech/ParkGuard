import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const STORAGE_ROOT = path.resolve(process.cwd(), 'storage', 'sessions');

// Filenames are always server-generated (see savePhoto) — this only exists
// to reject a client-supplied photoRef that isn't one of ours before it's
// ever used to build a filesystem path.
const PHOTO_FILENAME_PATTERN = /^[0-9a-f-]{36}\.(jpg|png)$/;

export function isValidPhotoFilename(filename: string): boolean {
  return PHOTO_FILENAME_PATTERN.test(filename);
}

export async function savePhoto(buffer: Buffer, mimeType: string): Promise<string> {
  await fs.mkdir(STORAGE_ROOT, { recursive: true });

  const extension = mimeType === 'image/png' ? 'png' : 'jpg';
  const filename = `${randomUUID()}.${extension}`;
  await fs.writeFile(path.join(STORAGE_ROOT, filename), buffer);

  return filename;
}

export async function readPhoto(filename: string): Promise<Buffer> {
  return fs.readFile(path.join(STORAGE_ROOT, path.basename(filename)));
}
