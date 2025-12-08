import { create } from 'zustand';
import type { PhotoFrame, PhotoFilters, PhotoSortOption } from '@/types/photo';

/**
 * Gallery store state interface
 */
interface GalleryState {
  /** All photos in the gallery */
  photos: PhotoFrame[];
  /** Currently selected photo (for editing) */
  selectedPhoto: PhotoFrame | null;
  /** Active filters */
  filters: PhotoFilters;
  /** Current sort option */
  sortOption: PhotoSortOption;
  /** Loading state */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** All available tags */
  allTags: string[];
  /** Total photo count (before filtering) */
  totalCount: number;
}

/**
 * Gallery store actions interface
 */
interface GalleryActions {
  /** Set photos array */
  setPhotos: (photos: PhotoFrame[], total?: number) => void;
  /** Add a new photo */
  addPhoto: (photo: PhotoFrame) => void;
  /** Update an existing photo */
  updatePhoto: (id: string, updates: Partial<PhotoFrame>) => void;
  /** Delete a photo */
  deletePhoto: (id: string) => void;
  /** Toggle favorite status */
  toggleFavorite: (id: string) => void;
  /** Select a photo for editing */
  selectPhoto: (photo: PhotoFrame | null) => void;
  /** Set filters */
  setFilters: (filters: PhotoFilters) => void;
  /** Update a single filter */
  updateFilter: <K extends keyof PhotoFilters>(key: K, value: PhotoFilters[K]) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Set sort option */
  setSortOption: (sort: PhotoSortOption) => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set error message */
  setError: (error: string | null) => void;
  /** Set available tags */
  setAllTags: (tags: string[]) => void;
  /** Reorder photos */
  reorderPhotos: (orderedIds: string[]) => void;
}

/**
 * Computed values interface
 */
interface GalleryComputed {
  /** Get filtered photos based on current filters */
  filteredPhotos: () => PhotoFrame[];
  /** Get favorite photos only */
  favoritePhotos: () => PhotoFrame[];
  /** Get unique tags from all photos */
  uniqueTags: () => string[];
  /** Get filtered photo count */
  filteredCount: () => number;
}

/**
 * Combined store type
 */
type GalleryStore = GalleryState & GalleryActions & GalleryComputed;

/**
 * Default filter state
 */
const DEFAULT_FILTERS: PhotoFilters = {};

/**
 * Gallery store with Zustand
 * 
 * Manages all photo-related state including photos, filters, and selection.
 */
export const useGalleryStore = create<GalleryStore>((set, get) => ({
  // Initial state
  photos: [],
  selectedPhoto: null,
  filters: DEFAULT_FILTERS,
  sortOption: 'dateAdded-desc',
  isLoading: false,
  error: null,
  allTags: [],
  totalCount: 0,
  
  // Actions
  setPhotos: (photos, total) => set({ 
    photos, 
    totalCount: total ?? photos.length,
    error: null,
  }),
  
  addPhoto: (photo) => set((state) => ({
    photos: [photo, ...state.photos],
    totalCount: state.totalCount + 1,
    allTags: Array.from(new Set([...state.allTags, ...photo.tags])),
  })),
  
  updatePhoto: (id, updates) => set((state) => ({
    photos: state.photos.map((p) => 
      p.id === id ? { ...p, ...updates } : p
    ),
    selectedPhoto: state.selectedPhoto?.id === id 
      ? { ...state.selectedPhoto, ...updates }
      : state.selectedPhoto,
  })),
  
  deletePhoto: (id) => set((state) => ({
    photos: state.photos.filter((p) => p.id !== id),
    totalCount: state.totalCount - 1,
    selectedPhoto: state.selectedPhoto?.id === id ? null : state.selectedPhoto,
  })),
  
  toggleFavorite: (id) => set((state) => ({
    photos: state.photos.map((p) =>
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ),
  })),
  
  selectPhoto: (photo) => set({ selectedPhoto: photo }),
  
  setFilters: (filters) => set({ filters }),
  
  updateFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value },
  })),
  
  clearFilters: () => set({ filters: DEFAULT_FILTERS }),
  
  setSortOption: (sortOption) => set({ sortOption }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  setAllTags: (allTags) => set({ allTags }),
  
  reorderPhotos: (orderedIds) => set((state) => {
    const photoMap = new Map(state.photos.map((p) => [p.id, p]));
    const reordered = orderedIds
      .map((id, index) => {
        const photo = photoMap.get(id);
        if (photo) {
          return { ...photo, position: index };
        }
        return null;
      })
      .filter((p): p is PhotoFrame => p !== null);
    
    return { photos: reordered };
  }),
  
  // Computed values
  filteredPhotos: () => {
    const { photos, filters, sortOption } = get();
    let result = [...photos];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.tags.some((t) => t.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter((p) =>
        filters.tags!.some((tag) => p.tags.includes(tag))
      );
    }
    
    // Apply favorites filter
    if (filters.favoritesOnly) {
      result = result.filter((p) => p.isFavorite);
    }
    
    // Apply sorting (already sorted from API, but sort again for local changes)
    result.sort((a, b) => {
      switch (sortOption) {
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
    
    return result;
  },
  
  favoritePhotos: () => {
    const { photos } = get();
    return photos.filter((p) => p.isFavorite);
  },
  
  uniqueTags: () => {
    const { photos } = get();
    const tagSet = new Set<string>();
    photos.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  },
  
  filteredCount: () => {
    return get().filteredPhotos().length;
  },
}));

export default useGalleryStore;

