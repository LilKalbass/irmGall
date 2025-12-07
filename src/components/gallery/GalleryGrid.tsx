'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PolaroidFrame } from './PolaroidFrame';
import { GalleryEmptyState } from './GalleryEmptyState';
import { GalleryLoadingSkeleton } from './GalleryLoadingSkeleton';
import type { Photo } from '@/types/photo';
import { cn } from '@/lib/utils';

/**
 * Props for GalleryGrid component
 */
interface GalleryGridProps {
  /** Array of photos to display */
  photos: Photo[];
  /** Whether photos are loading */
  isLoading?: boolean;
  /** Whether the gallery is editable */
  editable?: boolean;
  /** Called when a photo is clicked */
  onPhotoClick?: (photo: Photo) => void;
  /** Called when edit is clicked */
  onPhotoEdit?: (photo: Photo) => void;
  /** Called when delete is clicked */
  onPhotoDelete?: (photo: Photo) => void;
  /** Called when favorite is toggled */
  onPhotoFavorite?: (photo: Photo) => void;
  /** Additional className */
  className?: string;
}

/**
 * Container animation variants
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

/**
 * GalleryGrid Component
 * 
 * A responsive grid layout for displaying polaroid photos
 * with smooth staggered animations.
 */
export function GalleryGrid({
  photos,
  isLoading = false,
  editable = false,
  onPhotoClick,
  onPhotoEdit,
  onPhotoDelete,
  onPhotoFavorite,
  className,
}: GalleryGridProps) {
  // Show loading skeleton
  if (isLoading) {
    return <GalleryLoadingSkeleton count={8} />;
  }
  
  // Show empty state
  if (photos.length === 0) {
    return <GalleryEmptyState />;
  }
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        // Responsive grid with proper gaps
        'grid gap-4 sm:gap-6 md:gap-8',
        // Responsive columns - adapts to screen size
        'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        // Prevent overflow
        'w-full max-w-full overflow-hidden',
        // Add padding for rotated cards
        'py-4',
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="flex justify-center items-start"
          >
            <PolaroidFrame
              photo={photo}
              size="md"
              editable={editable}
              decoration={index % 4 === 0 ? 'tape' : index % 4 === 2 ? 'pin' : 'none'}
              onClick={onPhotoClick}
              onEdit={onPhotoEdit}
              onDelete={onPhotoDelete}
              onFavorite={onPhotoFavorite}
              animationDelay={Math.min(index * 0.04, 0.4)}
            />
          </div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export default GalleryGrid;
