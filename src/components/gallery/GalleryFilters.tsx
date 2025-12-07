'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Heart, SortAsc, Tag } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { cn } from '@/lib/utils';
import type { PhotoFilters, PhotoSortOption } from '@/types/photo';

/**
 * Sort option labels
 */
const SORT_OPTIONS: { value: PhotoSortOption; label: string }[] = [
  { value: 'dateAdded-desc', label: 'Newest First' },
  { value: 'dateAdded-asc', label: 'Oldest First' },
  { value: 'dateTaken-desc', label: 'Recently Taken' },
  { value: 'dateTaken-asc', label: 'Oldest Taken' },
  { value: 'title-asc', label: 'Title (A-Z)' },
  { value: 'title-desc', label: 'Title (Z-A)' },
  { value: 'favorites-first', label: 'Favorites First' },
];

/**
 * Props for GalleryFilters component
 */
interface GalleryFiltersProps {
  /** Current filter values */
  filters: PhotoFilters;
  /** Called when filters change */
  onFiltersChange: (filters: PhotoFilters) => void;
  /** Current sort option */
  sortOption: PhotoSortOption;
  /** Called when sort changes */
  onSortChange: (sort: PhotoSortOption) => void;
  /** Available tags for filtering */
  availableTags?: string[];
  /** Total photo count */
  totalCount?: number;
  /** Filtered photo count */
  filteredCount?: number;
  /** Additional className */
  className?: string;
}

/**
 * GalleryFilters Component
 * 
 * Beautiful warm-themed filter bar for the gallery.
 */
export function GalleryFilters({
  filters,
  onFiltersChange,
  sortOption,
  onSortChange,
  availableTags = [],
  totalCount = 0,
  filteredCount,
  className,
}: GalleryFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  // Check if any filters are active
  const hasActiveFilters = 
    !!filters.search || 
    (filters.tags && filters.tags.length > 0) || 
    filters.favoritesOnly;
  
  // Update search
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined });
  };
  
  // Toggle favorites filter
  const toggleFavorites = () => {
    onFiltersChange({ ...filters, favoritesOnly: !filters.favoritesOnly });
  };
  
  // Toggle tag filter
  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    onFiltersChange({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
  };
  
  // Clear all filters
  const clearFilters = () => {
    onFiltersChange({});
    setIsExpanded(false);
  };
  
  return (
    <GlassCard
      blur="medium"
      opacity={65}
      rounded="xl"
      hoverEffect="none"
      className={cn('p-3 sm:p-4', className)}
    >
      <div className="flex flex-col gap-3">
        {/* Main filter row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search input */}
          <div className="flex-1 min-w-[160px] max-w-xs">
            <GlassInput
              type="text"
              placeholder="Search..."
              leftIcon={<Search size={16} />}
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              size="sm"
            />
          </div>
          
          {/* Favorites toggle */}
          <GlassButton
            variant={filters.favoritesOnly ? 'primary' : 'secondary'}
            size="sm"
            leftIcon={
              <Heart 
                size={14} 
                className={cn(filters.favoritesOnly && 'fill-current')} 
              />
            }
            onClick={toggleFavorites}
          >
            <span className="hidden sm:inline">Favorites</span>
            <span className="sm:hidden">♥</span>
          </GlassButton>
          
          {/* Sort dropdown */}
          <div className="relative">
            <GlassButton
              variant="secondary"
              size="sm"
              leftIcon={<SortAsc size={14} />}
              onClick={() => setShowSortMenu(!showSortMenu)}
            >
              <span className="hidden sm:inline">Sort</span>
            </GlassButton>
            
            <AnimatePresence>
              {showSortMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={cn(
                    'absolute right-0 top-full mt-1 z-50',
                    'min-w-[150px] py-1.5',
                    'bg-white/95 backdrop-blur-md rounded-lg',
                    'border border-blush-100 shadow-lg',
                    'overflow-hidden'
                  )}
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onSortChange(option.value);
                        setShowSortMenu(false);
                      }}
                      className={cn(
                        'w-full px-3 py-1.5 text-left text-sm',
                        'transition-colors',
                        sortOption === option.value
                          ? 'bg-blush-50 text-blush-700 font-medium'
                          : 'text-blush-600 hover:bg-blush-50/50'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Tags toggle */}
          {availableTags.length > 0 && (
            <GlassButton
              variant={isExpanded ? 'primary' : 'secondary'}
              size="sm"
              leftIcon={<Tag size={14} />}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span className="hidden sm:inline">Tags</span>
            </GlassButton>
          )}
          
          {/* Clear filters */}
          {hasActiveFilters && (
            <GlassButton
              variant="ghost"
              size="sm"
              leftIcon={<X size={14} />}
              onClick={clearFilters}
            >
              Clear
            </GlassButton>
          )}
        </div>
        
        {/* Expanded filters (tags) */}
        <AnimatePresence>
          {isExpanded && availableTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 border-t border-blush-100/50">
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => {
                    const isSelected = filters.tags?.includes(tag);
                    return (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-medium',
                          'transition-all duration-200 truncate max-w-[120px]',
                          isSelected
                            ? 'bg-blush-200 text-blush-700 ring-1 ring-blush-300'
                            : 'bg-cream-100/70 text-blush-600 hover:bg-cream-200/70'
                        )}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Results count */}
        {filteredCount !== undefined && totalCount > 0 && (
          <div className="text-xs text-blush-500/70">
            {hasActiveFilters 
              ? `${filteredCount} of ${totalCount} photos`
              : `${totalCount} photos`
            }
          </div>
        )}
      </div>
      
      {/* Click outside to close sort menu */}
      {showSortMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowSortMenu(false)}
        />
      )}
    </GlassCard>
  );
}

export default GalleryFilters;
