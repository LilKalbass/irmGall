import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import type { Photo, PhotoFrame, PhotoFilters, PhotoSortOption, FrameColor } from '@/types/photo';
import { getRandomRotation } from './utils';

/**
 * Check if we're in a Vercel environment with Blob storage
 */
const HAS_BLOB_TOKEN = !!process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Local file storage path
 */
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const PHOTOS_FILE = path.join(DATA_DIR, 'photos.json');

/**
 * Blob storage filename for photos data
 */
const PHOTOS_BLOB_NAME = 'photos-data.json';

/**
 * In-memory cache
 */
let memoryCache: PhotoFrame[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 5000; // 5 seconds

/**
 * Ensure local data directory exists
 */
async function ensureLocalDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
  try {
    await fs.access(PHOTOS_FILE);
  } catch {
    await fs.writeFile(PHOTOS_FILE, JSON.stringify([], null, 2));
  }
}

/**
 * Read photos from local file
 */
async function readPhotosLocal(): Promise<PhotoFrame[]> {
  try {
    await ensureLocalDataDir();
    const data = await fs.readFile(PHOTOS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('Could not read local photos.json:', error);
    return [];
  }
}

/**
 * Write photos to local file
 */
async function writePhotosLocal(photos: PhotoFrame[]): Promise<void> {
  try {
    await ensureLocalDataDir();
    await fs.writeFile(PHOTOS_FILE, JSON.stringify(photos, null, 2));
  } catch (error) {
    console.warn('Could not write to local photos.json:', error);
  }
}

/**
 * Read photos from Vercel Blob storage
 */
async function readPhotosBlob(): Promise<PhotoFrame[]> {
  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: PHOTOS_BLOB_NAME });
    
    if (blobs.length === 0) {
      return [];
    }
    
    const response = await fetch(blobs[0].url);
    if (!response.ok) {
      throw new Error('Failed to fetch photos data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error reading photos from blob:', error);
    return [];
  }
}

/**
 * Write photos to Vercel Blob storage
 */
async function writePhotosBlob(photos: PhotoFrame[]): Promise<void> {
  try {
    const { put, list, del } = await import('@vercel/blob');
    
    // Delete old blob if exists
    const { blobs } = await list({ prefix: PHOTOS_BLOB_NAME });
    for (const blob of blobs) {
      await del(blob.url);
    }
    
    // Write new data
    const jsonData = JSON.stringify(photos, null, 2);
    await put(PHOTOS_BLOB_NAME, jsonData, {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    });
  } catch (error) {
    console.error('Error writing photos to blob:', error);
  }
}

/**
 * Read photos (auto-selects storage based on environment)
 */
async function readPhotos(): Promise<PhotoFrame[]> {
  const now = Date.now();
  if (memoryCache !== null && (now - lastFetchTime) < CACHE_TTL) {
    return memoryCache;
  }
  
  const photos = HAS_BLOB_TOKEN ? await readPhotosBlob() : await readPhotosLocal();
  memoryCache = photos;
  lastFetchTime = now;
  return photos;
}

/**
 * Write photos (auto-selects storage based on environment)
 */
async function writePhotos(photos: PhotoFrame[]): Promise<void> {
  memoryCache = photos;
  lastFetchTime = Date.now();
  
  if (HAS_BLOB_TOKEN) {
    await writePhotosBlob(photos);
  } else {
    await writePhotosLocal(photos);
  }
}

/**
 * Get all photos with optional filtering and sorting
 */
export async function getAllPhotos(
  filters?: PhotoFilters,
  sort: PhotoSortOption = 'dateAdded-desc'
): Promise<PhotoFrame[]> {
  let photos = await readPhotos();
  
  // Apply filters
  if (filters) {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      photos = photos.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.tags.some((t) => t.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters.tags && filters.tags.length > 0) {
      photos = photos.filter((p) =>
        filters.tags!.some((tag) => p.tags.includes(tag))
      );
    }
    
    if (filters.favoritesOnly) {
      photos = photos.filter((p) => p.isFavorite);
    }
    
    if (filters.dateRange) {
      if (filters.dateRange.from) {
        photos = photos.filter(
          (p) => p.dateTaken && p.dateTaken >= filters.dateRange!.from!
        );
      }
      if (filters.dateRange.to) {
        photos = photos.filter(
          (p) => p.dateTaken && p.dateTaken <= filters.dateRange!.to!
        );
      }
    }
  }
  
  // Apply sorting
  photos.sort((a, b) => {
    switch (sort) {
      case 'dateAdded-desc':
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      case 'dateAdded-asc':
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      case 'dateTaken-desc':
        if (!a.dateTaken) return 1;
        if (!b.dateTaken) return -1;
        return new Date(b.dateTaken).getTime() - new Date(a.dateTaken).getTime();
      case 'dateTaken-asc':
        if (!a.dateTaken) return 1;
        if (!b.dateTaken) return -1;
        return new Date(a.dateTaken).getTime() - new Date(b.dateTaken).getTime();
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'favorites-first':
        if (a.isFavorite === b.isFavorite) {
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        }
        return a.isFavorite ? -1 : 1;
      default:
        return 0;
    }
  });
  
  return photos;
}

/**
 * Get a single photo by ID
 */
export async function getPhotoById(id: string): Promise<PhotoFrame | null> {
  const photos = await readPhotos();
  return photos.find((p) => p.id === id) || null;
}

/**
 * Create a new photo
 */
export async function createPhoto(
  data: Omit<Photo, 'id' | 'dateAdded'> & { frameColor?: FrameColor }
): Promise<PhotoFrame> {
  const photos = await readPhotos();
  
  const newPhoto: PhotoFrame = {
    ...data,
    id: uuidv4(),
    dateAdded: new Date().toISOString(),
    tags: data.tags || [],
    isFavorite: data.isFavorite || false,
    frameColor: data.frameColor || 'white',
    rotation: getRandomRotation(4),
    position: photos.length,
  };
  
  photos.push(newPhoto);
  await writePhotos(photos);
  
  return newPhoto;
}

/**
 * Update an existing photo
 */
export async function updatePhoto(
  id: string,
  data: Partial<Omit<PhotoFrame, 'id' | 'dateAdded'>>
): Promise<PhotoFrame | null> {
  const photos = await readPhotos();
  const index = photos.findIndex((p) => p.id === id);
  
  if (index === -1) {
    return null;
  }
  
  photos[index] = {
    ...photos[index],
    ...data,
  };
  
  await writePhotos(photos);
  return photos[index];
}

/**
 * Delete a photo
 */
export async function deletePhoto(id: string): Promise<boolean> {
  const photos = await readPhotos();
  const index = photos.findIndex((p) => p.id === id);
  
  if (index === -1) {
    return false;
  }
  
  photos.splice(index, 1);
  
  photos.forEach((photo, i) => {
    photo.position = i;
  });
  
  await writePhotos(photos);
  return true;
}

/**
 * Get all unique tags from photos
 */
export async function getAllTags(): Promise<string[]> {
  const photos = await readPhotos();
  const tagSet = new Set<string>();
  
  photos.forEach((photo) => {
    photo.tags.forEach((tag) => tagSet.add(tag));
  });
  
  return Array.from(tagSet).sort();
}

/**
 * Reorder photos
 */
export async function reorderPhotos(
  orderedIds: string[]
): Promise<PhotoFrame[]> {
  const photos = await readPhotos();
  
  const photoMap = new Map(photos.map((p) => [p.id, p]));
  
  const reordered = orderedIds
    .map((id, index) => {
      const photo = photoMap.get(id);
      if (photo) {
        return { ...photo, position: index };
      }
      return null;
    })
    .filter((p): p is PhotoFrame => p !== null);
  
  photos.forEach((photo) => {
    if (!orderedIds.includes(photo.id)) {
      reordered.push({ ...photo, position: reordered.length });
    }
  });
  
  await writePhotos(reordered);
  return reordered;
}
