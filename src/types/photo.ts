/**
 * Core photo types for the IRM Gallery application
 */

/**
 * Represents a single photo in the gallery
 */
export interface Photo {
  /** Unique identifier for the photo */
  id: string;
  /** URL or path to the image file */
  imageUrl: string;
  /** Title of the photo */
  title: string;
  /** Optional description or memory associated with the photo */
  description?: string;
  /** Date when the photo was taken */
  dateTaken?: string;
  /** Date when the photo was added to the gallery */
  dateAdded: string;
  /** Tags for categorization and filtering */
  tags: string[];
  /** Whether the photo is marked as favorite */
  isFavorite: boolean;
}

/**
 * Extended photo type with frame styling options
 */
export interface PhotoFrame extends Photo {
  /** Color theme for the polaroid frame */
  frameColor: FrameColor;
  /** Rotation angle in degrees (-5 to 5) */
  rotation: number;
  /** Position in the grid (for drag and drop) */
  position: number;
}

/**
 * Available frame color themes
 */
export type FrameColor = 'white' | 'cream' | 'pink' | 'lavender' | 'mint' | 'peach';

/**
 * Photo creation input (without auto-generated fields)
 */
export interface CreatePhotoInput {
  imageUrl: string;
  title: string;
  description?: string;
  dateTaken?: string;
  tags?: string[];
  isFavorite?: boolean;
  frameColor?: FrameColor;
}

/**
 * Photo update input (all fields optional)
 */
export interface UpdatePhotoInput {
  title?: string;
  description?: string;
  dateTaken?: string;
  tags?: string[];
  isFavorite?: boolean;
  frameColor?: FrameColor;
  position?: number;
}

/**
 * Filter options for querying photos
 */
export interface PhotoFilters {
  /** Search query for title and description */
  search?: string;
  /** Filter by specific tags */
  tags?: string[];
  /** Show only favorites */
  favoritesOnly?: boolean;
  /** Date range filter */
  dateRange?: {
    from?: string;
    to?: string;
  };
}

/**
 * Sort options for photo list
 */
export type PhotoSortOption = 
  | 'dateAdded-desc' 
  | 'dateAdded-asc' 
  | 'dateTaken-desc' 
  | 'dateTaken-asc' 
  | 'title-asc' 
  | 'title-desc'
  | 'favorites-first';

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  limit: number;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

