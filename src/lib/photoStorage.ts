import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { Photo, PhotoFrame, PhotoFilters, PhotoSortOption, FrameColor } from '@/types/photo';
import { getRandomRotation } from './utils';

/**
 * Path to the photos data file
 */
const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const PHOTOS_FILE = path.join(DATA_DIR, 'photos.json');

/**
 * Ensure data directory and file exist
 */
async function ensureDataFile(): Promise<void> {
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
 * Read photos from the data file
 */
async function readPhotos(): Promise<PhotoFrame[]> {
  await ensureDataFile();
  const data = await fs.readFile(PHOTOS_FILE, 'utf-8');
  return JSON.parse(data);
}

/**
 * Write photos to the data file
 */
async function writePhotos(photos: PhotoFrame[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(PHOTOS_FILE, JSON.stringify(photos, null, 2));
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
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      photos = photos.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.tags.some((t) => t.toLowerCase().includes(searchLower))
      );
    }
    
    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      photos = photos.filter((p) =>
        filters.tags!.some((tag) => p.tags.includes(tag))
      );
    }
    
    // Favorites filter
    if (filters.favoritesOnly) {
      photos = photos.filter((p) => p.isFavorite);
    }
    
    // Date range filter
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
  
  // Update positions
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
  
  // Create a map for quick lookup
  const photoMap = new Map(photos.map((p) => [p.id, p]));
  
  // Reorder based on the provided IDs
  const reordered = orderedIds
    .map((id, index) => {
      const photo = photoMap.get(id);
      if (photo) {
        return { ...photo, position: index };
      }
      return null;
    })
    .filter((p): p is PhotoFrame => p !== null);
  
  // Add any photos not in the ordered list at the end
  photos.forEach((photo) => {
    if (!orderedIds.includes(photo.id)) {
      reordered.push({ ...photo, position: reordered.length });
    }
  });
  
  await writePhotos(reordered);
  return reordered;
}

