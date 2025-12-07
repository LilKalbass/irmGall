'use client';

import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useGalleryStore } from '@/stores/galleryStore';
import { usePolling } from './usePolling';
import type { PhotoFrame, PhotoFilters, PhotoSortOption, CreatePhotoInput, UpdatePhotoInput } from '@/types/photo';

/**
 * Configuration for usePhotos hook
 */
interface UsePhotosOptions {
  /** Enable auto-polling for real-time updates */
  enablePolling?: boolean;
  /** Polling interval in milliseconds (default: 15000 = 15 seconds) */
  pollingInterval?: number;
}

/**
 * API client for photo operations
 */
const photoApi = {
  async fetchPhotos(filters?: PhotoFilters, sort?: PhotoSortOption) {
    const params = new URLSearchParams();
    
    if (filters?.search) {
      params.set('search', filters.search);
    }
    if (filters?.tags && filters.tags.length > 0) {
      params.set('tags', filters.tags.join(','));
    }
    if (filters?.favoritesOnly) {
      params.set('favoritesOnly', 'true');
    }
    if (sort) {
      params.set('sort', sort);
    }
    
    const response = await fetch(`/api/photos?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch photos');
    }
    return response.json();
  },
  
  async createPhoto(data: CreatePhotoInput) {
    const response = await fetch('/api/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create photo');
    }
    return response.json();
  },
  
  async updatePhoto(id: string, data: UpdatePhotoInput) {
    const response = await fetch(`/api/photos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update photo');
    }
    return response.json();
  },
  
  async deletePhoto(id: string) {
    const response = await fetch(`/api/photos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete photo');
    }
    return response.json();
  },
  
  async toggleFavorite(id: string, isFavorite: boolean) {
    return this.updatePhoto(id, { isFavorite });
  },
};

/**
 * Custom hook for managing photos with real-time polling support
 * 
 * Combines the Zustand store with API calls and provides
 * a clean interface for photo operations. Supports automatic
 * polling for real-time updates across multiple users.
 * 
 * @param options - Configuration options
 * @param options.enablePolling - Enable auto-refresh (default: true)
 * @param options.pollingInterval - Refresh interval in ms (default: 15000)
 * 
 * @example
 * ```tsx
 * const { photos, isLoading, addPhoto, updatePhoto, deletePhoto } = usePhotos({
 *   enablePolling: true,
 *   pollingInterval: 10000, // 10 seconds
 * });
 * ```
 */
export function usePhotos(options: UsePhotosOptions = {}) {
  const {
    enablePolling = true,
    pollingInterval = 15000, // 15 seconds default
  } = options;
  
  // Track if this is the initial load
  const isInitialLoad = useRef(true);
  
  const {
    photos,
    selectedPhoto,
    filters,
    sortOption,
    isLoading,
    error,
    allTags,
    totalCount,
    setPhotos,
    addPhoto: addPhotoToStore,
    updatePhoto: updatePhotoInStore,
    deletePhoto: deletePhotoFromStore,
    toggleFavorite: toggleFavoriteInStore,
    selectPhoto,
    setFilters,
    clearFilters,
    setSortOption,
    setLoading,
    setError,
    setAllTags,
    filteredPhotos,
    filteredCount,
  } = useGalleryStore();
  
  /**
   * Fetch photos from API
   * @param silent - If true, don't show loading state (for background polling)
   */
  const fetchPhotos = useCallback(async (silent: boolean = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);
    
    try {
      const result = await photoApi.fetchPhotos(filters, sortOption);
      
      if (result.success) {
        setPhotos(result.data.photos, result.data.total);
        setAllTags(result.data.allTags || []);
        
        // Mark initial load as complete
        if (isInitialLoad.current) {
          isInitialLoad.current = false;
        }
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch photos';
      setError(message);
      // Only show error toast on initial load, not during background polling
      if (!silent) {
        toast.error(message);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [filters, sortOption, setPhotos, setAllTags, setLoading, setError]);
  
  /**
   * Silent fetch for polling (doesn't show loading state)
   */
  const silentFetch = useCallback(async () => {
    await fetchPhotos(true);
  }, [fetchPhotos]);
  
  /**
   * Create a new photo
   */
  const addPhoto = useCallback(async (data: CreatePhotoInput): Promise<PhotoFrame | null> => {
    try {
      const result = await photoApi.createPhoto(data);
      
      if (result.success) {
        addPhotoToStore(result.data);
        toast.success('Photo added successfully! ✨');
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add photo';
      toast.error(message);
      return null;
    }
  }, [addPhotoToStore]);
  
  /**
   * Update an existing photo
   */
  const updatePhoto = useCallback(async (
    id: string,
    data: UpdatePhotoInput
  ): Promise<PhotoFrame | null> => {
    // Optimistic update
    updatePhotoInStore(id, data);
    
    try {
      const result = await photoApi.updatePhoto(id, data);
      
      if (result.success) {
        updatePhotoInStore(id, result.data);
        toast.success('Photo updated! 💕');
        return result.data;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      // Revert on error - refetch photos
      fetchPhotos();
      const message = err instanceof Error ? err.message : 'Failed to update photo';
      toast.error(message);
      return null;
    }
  }, [updatePhotoInStore, fetchPhotos]);
  
  /**
   * Delete a photo
   */
  const deletePhoto = useCallback(async (id: string): Promise<boolean> => {
    // Optimistic update
    deletePhotoFromStore(id);
    
    try {
      const result = await photoApi.deletePhoto(id);
      
      if (result.success) {
        toast.success('Photo deleted');
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      // Revert on error - refetch photos
      fetchPhotos();
      const message = err instanceof Error ? err.message : 'Failed to delete photo';
      toast.error(message);
      return false;
    }
  }, [deletePhotoFromStore, fetchPhotos]);
  
  /**
   * Toggle favorite status
   */
  const toggleFavorite = useCallback(async (photo: PhotoFrame): Promise<void> => {
    const newFavoriteStatus = !photo.isFavorite;
    
    // Optimistic update
    toggleFavoriteInStore(photo.id);
    
    try {
      await photoApi.toggleFavorite(photo.id, newFavoriteStatus);
      
      if (newFavoriteStatus) {
        toast.success('Added to favorites! 💕');
      }
    } catch (err) {
      // Revert on error
      toggleFavoriteInStore(photo.id);
      toast.error('Failed to update favorite');
    }
  }, [toggleFavoriteInStore]);
  
  /**
   * Auto-fetch photos on mount and when filters/sort change
   */
  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);
  
  /**
   * Set up polling for real-time updates
   */
  const { refresh, isPolling } = usePolling(silentFetch, {
    interval: pollingInterval,
    enabled: enablePolling && !isInitialLoad.current,
    immediate: false,
  });
  
  // Enable polling after initial load
  useEffect(() => {
    if (!isInitialLoad.current && enablePolling) {
      // Polling is automatically started by the usePolling hook
    }
  }, [enablePolling, isLoading]);
  
  return {
    // State
    photos: filteredPhotos(),
    allPhotos: photos,
    selectedPhoto,
    filters,
    sortOption,
    isLoading,
    error,
    allTags,
    totalCount,
    filteredCount: filteredCount(),
    
    // Polling state
    isPolling,
    
    // Actions
    fetchPhotos: () => fetchPhotos(false),
    refreshPhotos: refresh,
    addPhoto,
    updatePhoto,
    deletePhoto,
    toggleFavorite,
    selectPhoto,
    setFilters,
    clearFilters,
    setSortOption,
  };
}

export default usePhotos;

