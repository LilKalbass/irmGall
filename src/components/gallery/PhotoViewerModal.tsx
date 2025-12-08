'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Edit3, 
  Trash2,
  Download,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { Photo } from '@/types/photo';

/**
 * Props for PhotoViewerModal component
 */
interface PhotoViewerModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Called when modal should close */
  onClose: () => void;
  /** Photo to display */
  photo: Photo | null;
  /** All photos for navigation */
  photos?: Photo[];
  /** Called when navigating to previous photo */
  onPrevious?: () => void;
  /** Called when navigating to next photo */
  onNext?: () => void;
  /** Called when edit is clicked */
  onEdit?: (photo: Photo) => void;
  /** Called when delete is clicked */
  onDelete?: (photo: Photo) => void;
  /** Called when favorite is toggled */
  onFavorite?: (photo: Photo) => void;
}

/**
 * PhotoViewerModal Component
 * 
 * A full-screen photo viewer with navigation and actions.
 * 
 * @example
 * ```tsx
 * <PhotoViewerModal
 *   isOpen={viewerOpen}
 *   onClose={() => setViewerOpen(false)}
 *   photo={selectedPhoto}
 *   photos={allPhotos}
 *   onEdit={handleEdit}
 *   onFavorite={handleFavorite}
 * />
 * ```
 */
export function PhotoViewerModal({
  isOpen,
  onClose,
  photo,
  photos = [],
  onPrevious,
  onNext,
  onEdit,
  onDelete,
  onFavorite,
}: PhotoViewerModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Get current index and navigation availability
  const currentIndex = photo ? photos.findIndex(p => p.id === photo.id) : -1;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;
  
  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrevious && onPrevious) onPrevious();
          break;
        case 'ArrowRight':
          if (hasNext && onNext) onNext();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasPrevious, hasNext, onPrevious, onNext, onClose]);
  
  // Reset state when photo changes
  useEffect(() => {
    setIsZoomed(false);
    setImageLoaded(false);
  }, [photo?.id]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Handle download
  const handleDownload = useCallback(() => {
    if (!photo) return;
    
    const link = document.createElement('a');
    link.href = photo.imageUrl;
    link.download = `${photo.title || 'photo'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [photo]);
  
  if (!photo) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
        >
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={cn(
              'absolute top-0 left-0 right-0 z-10',
              'flex items-center justify-between p-4',
              'bg-gradient-to-b from-black/50 to-transparent'
            )}
          >
            {/* Photo info */}
            <div className="text-white">
              <h2 className="font-display font-semibold text-lg">
                {photo.title}
              </h2>
              {photo.dateTaken && (
                <p className="text-white/70 text-sm">
                  {formatDate(photo.dateTaken, 'long')}
                </p>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Favorite */}
              {onFavorite && (
                <button
                  onClick={() => onFavorite(photo)}
                  className={cn(
                    'p-2 rounded-full transition-colors',
                    'hover:bg-white/10',
                    photo.isFavorite && 'text-rose-400'
                  )}
                >
                  <Heart 
                    size={22} 
                    className={photo.isFavorite ? 'fill-current' : ''} 
                  />
                </button>
              )}
              
              {/* Download */}
              <button
                onClick={handleDownload}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
              >
                <Download size={22} />
              </button>
              
              {/* Zoom */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
              >
                {isZoomed ? <ZoomOut size={22} /> : <ZoomIn size={22} />}
              </button>
              
              {/* Edit */}
              {onEdit && (
                <button
                  onClick={() => onEdit(photo)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                >
                  <Edit3 size={22} />
                </button>
              )}
              
              {/* Delete */}
              {onDelete && (
                <button
                  onClick={() => onDelete(photo)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors text-white hover:text-red-400"
                >
                  <Trash2 size={22} />
                </button>
              )}
              
              {/* Close */}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white ml-2"
              >
                <X size={24} />
              </button>
            </div>
          </motion.div>
          
          {/* Image container */}
          <div 
            className="flex-1 flex items-center justify-center p-4 pt-20 pb-20"
            onClick={() => !isZoomed && onClose()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className={cn(
                'relative max-w-full max-h-full',
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              )}
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
            >
              {/* Loading skeleton */}
              {!imageLoaded && (
                <div className="w-96 h-96 bg-white/10 rounded-lg animate-pulse" />
              )}
              
              <Image
                src={photo.imageUrl}
                alt={photo.title}
                width={isZoomed ? 1920 : 1200}
                height={isZoomed ? 1080 : 800}
                className={cn(
                  'object-contain max-h-[80vh] rounded-lg transition-all duration-300',
                  imageLoaded ? 'opacity-100' : 'opacity-0',
                  isZoomed && 'max-h-none'
                )}
                onLoad={() => setImageLoaded(true)}
                priority
              />
            </motion.div>
          </div>
          
          {/* Navigation arrows */}
          {hasPrevious && onPrevious && (
            <button
              onClick={onPrevious}
              className={cn(
                'absolute left-4 top-1/2 -translate-y-1/2',
                'p-3 rounded-full',
                'bg-white/10 hover:bg-white/20',
                'transition-colors text-white'
              )}
            >
              <ChevronLeft size={28} />
            </button>
          )}
          
          {hasNext && onNext && (
            <button
              onClick={onNext}
              className={cn(
                'absolute right-4 top-1/2 -translate-y-1/2',
                'p-3 rounded-full',
                'bg-white/10 hover:bg-white/20',
                'transition-colors text-white'
              )}
            >
              <ChevronRight size={28} />
            </button>
          )}
          
          {/* Footer with description and tags */}
          {(photo.description || photo.tags.length > 0) && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={cn(
                'absolute bottom-0 left-0 right-0',
                'p-4 pt-8',
                'bg-gradient-to-t from-black/70 to-transparent',
                'text-white'
              )}
            >
              {photo.description && (
                <p className="text-white/90 mb-2 max-w-2xl">
                  {photo.description}
                </p>
              )}
              
              {photo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {photo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full text-xs bg-white/20 text-white/80"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
          
          {/* Photo counter */}
          {photos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {currentIndex + 1} / {photos.length}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PhotoViewerModal;

