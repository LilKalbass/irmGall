'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Edit3, Trash2, RotateCcw } from 'lucide-react';
import { cn, formatDate, getRandomRotation } from '@/lib/utils';
import type { Photo, FrameColor } from '@/types/photo';

/**
 * Size variants for the polaroid frame
 */
type PolaroidSize = 'sm' | 'md' | 'lg';

/**
 * Decoration type for the frame
 */
type DecorationStyle = 'none' | 'tape' | 'pin' | 'clip';

/**
 * Props for PolaroidFrame component
 */
interface PolaroidFrameProps {
  /** Photo data to display */
  photo: Photo;
  /** Size of the polaroid */
  size?: PolaroidSize;
  /** Whether the frame is editable */
  editable?: boolean;
  /** Frame color theme */
  frameColor?: FrameColor;
  /** Custom rotation (if not provided, random is generated) */
  rotation?: number;
  /** Decoration style */
  decoration?: DecorationStyle;
  /** Called when edit is clicked */
  onEdit?: (photo: Photo) => void;
  /** Called when delete is clicked */
  onDelete?: (photo: Photo) => void;
  /** Called when favorite is toggled */
  onFavorite?: (photo: Photo) => void;
  /** Called when the polaroid is clicked */
  onClick?: (photo: Photo) => void;
  /** Animation delay for staggered entrance */
  animationDelay?: number;
  /** Additional className */
  className?: string;
}

/**
 * Size configuration - responsive friendly
 */
const sizeConfig: Record<PolaroidSize, { 
  width: string; 
  maxWidth: number;
  imageHeight: string; 
  padding: number; 
  bottomPadding: number;
}> = {
  sm: { width: 'w-36 sm:w-44', maxWidth: 176, imageHeight: 'aspect-square', padding: 6, bottomPadding: 40 },
  md: { width: 'w-44 sm:w-56', maxWidth: 224, imageHeight: 'aspect-square', padding: 8, bottomPadding: 48 },
  lg: { width: 'w-56 sm:w-72', maxWidth: 288, imageHeight: 'aspect-square', padding: 10, bottomPadding: 56 },
};

/**
 * Frame color styles - warm palette with dark mode support
 */
const frameColors: Record<FrameColor, string> = {
  white: 'bg-[#fffcf9] dark:bg-[#2a2428]',
  cream: 'bg-[#fffaf5] dark:bg-[#2c2624]',
  pink: 'bg-[#fff8f7] dark:bg-[#2d2528]',
  lavender: 'bg-[#faf8fc] dark:bg-[#28262c]',
  mint: 'bg-[#f8fcf9] dark:bg-[#262a28]',
  peach: 'bg-[#fff9f6] dark:bg-[#2c2826]',
};

/**
 * PolaroidFrame Component
 * 
 * A beautiful polaroid-style photo frame with warm, lovely aesthetics.
 */
export function PolaroidFrame({
  photo,
  size = 'md',
  editable = false,
  frameColor = 'cream',
  rotation: customRotation,
  decoration = 'none',
  onEdit,
  onDelete,
  onFavorite,
  onClick,
  animationDelay = 0,
  className,
}: PolaroidFrameProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  
  // Generate consistent rotation for this photo
  const rotation = useMemo(
    () => customRotation ?? getRandomRotation(3),
    [customRotation]
  );
  
  const config = sizeConfig[size];
  
  // Handle double-click to flip
  const handleDoubleClick = () => {
    if (photo.description) {
      setIsFlipped(!isFlipped);
    }
  };
  
  // Handle favorite with animation
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHeartAnimating(true);
    setTimeout(() => setIsHeartAnimating(false), 400);
    onFavorite?.(photo);
  };
  
  // Handle click
  const handleClick = () => {
    onClick?.(photo);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -16 }}
      transition={{
        duration: 0.5,
        delay: animationDelay,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{ scale: 1.02 }}
      className={cn('relative', config.width, 'max-w-full', className)}
      style={{ perspective: '1000px' }}
    >
      {/* Decoration - Tape */}
      {decoration === 'tape' && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
          <div 
            className="w-10 h-5 bg-cream-200/70 backdrop-blur-sm rounded-sm"
            style={{
              transform: 'rotate(-2deg)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          />
        </div>
      )}
      
      {/* Decoration - Pin */}
      {decoration === 'pin' && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-20">
          <div className="w-3 h-3 rounded-full bg-blush-400 shadow-sm" />
        </div>
      )}
      
      {/* Main Card Container */}
      <motion.div
        className="relative cursor-pointer w-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotate(${rotation}deg)`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={handleDoubleClick}
        onClick={handleClick}
      >
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            /* Front Side */
            <motion.div
              key="front"
              initial={false}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: 90 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative paper-texture w-full',
                frameColors[frameColor],
                'shadow-polaroid transition-shadow duration-300',
                isHovered && 'shadow-polaroid-hover'
              )}
              style={{
                padding: config.padding,
                paddingBottom: config.bottomPadding,
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Image Container */}
              <div className={cn('relative overflow-hidden bg-cream-100', config.imageHeight)}>
                {/* Loading skeleton */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cream-100 via-cream-50 to-cream-100 animate-shimmer" />
                )}
                
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  className={cn(
                    'object-cover transition-opacity duration-300',
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  )}
                  onLoad={() => setImageLoaded(true)}
                  sizes="(max-width: 640px) 176px, (max-width: 768px) 224px, 288px"
                />
                
                {/* Favorite Button */}
                <button
                  onClick={handleFavorite}
                  className={cn(
                    'absolute top-2 right-2 p-1.5 rounded-full',
                    'bg-white/80 backdrop-blur-sm',
                    'transition-all duration-200',
                    'hover:scale-110 active:scale-95',
                    photo.isFavorite && 'bg-blush-100/90'
                  )}
                >
                  <Heart
                    size={size === 'sm' ? 14 : size === 'md' ? 16 : 18}
                    className={cn(
                      'transition-colors duration-200',
                      photo.isFavorite ? 'text-blush-500 fill-blush-500' : 'text-blush-300',
                      isHeartAnimating && 'animate-heart-beat'
                    )}
                  />
                </button>
                
                {/* Edit/Delete buttons on hover */}
                {editable && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute bottom-2 left-2 flex gap-1"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(photo);
                      }}
                      className={cn(
                        'p-1.5 rounded-full',
                        'bg-white/80 backdrop-blur-sm',
                        'transition-all duration-200',
                        'hover:scale-110 hover:bg-white active:scale-95'
                      )}
                    >
                      <Edit3 size={size === 'sm' ? 12 : 14} className="text-blush-600" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(photo);
                      }}
                      className={cn(
                        'p-1.5 rounded-full',
                        'bg-white/80 backdrop-blur-sm',
                        'transition-all duration-200',
                        'hover:scale-110 hover:bg-red-50 active:scale-95'
                      )}
                    >
                      <Trash2 size={size === 'sm' ? 12 : 14} className="text-blush-500 hover:text-red-500" />
                    </button>
                  </motion.div>
                )}
              </div>
              
              {/* Caption Area */}
              <div 
                className="mt-2 text-center overflow-hidden"
                style={{ minHeight: config.bottomPadding - config.padding - 8 }}
              >
                <h3 
                  className={cn(
                    'font-handwriting text-blush-800 dark:text-blush-200 leading-tight truncate px-1',
                    size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
                  )}
                >
                  {photo.title}
                </h3>
                {photo.dateTaken && (
                  <p 
                    className={cn(
                      'font-handwriting text-blush-400 dark:text-blush-300 mt-0.5 truncate',
                      size === 'sm' ? 'text-xs' : 'text-sm'
                    )}
                  >
                    {formatDate(photo.dateTaken, 'cute')}
                  </p>
                )}
                {photo.description && (
                  <p 
                    className={cn(
                      'font-handwriting text-blush-500 dark:text-blush-300/70 mt-1 line-clamp-2 px-1',
                      size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
                    )}
                    title={photo.description}
                  >
                    {photo.description}
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            /* Back Side - Description */
            <motion.div
              key="back"
              initial={{ rotateY: -90 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: 90 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'relative paper-texture w-full min-h-[200px]',
                frameColors[frameColor],
                'shadow-polaroid'
              )}
              style={{
                padding: config.padding,
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Flip back button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className={cn(
                  'absolute top-2 right-2 p-1.5 rounded-full',
                  'bg-cream-100 dark:bg-cream-800 hover:bg-cream-200 dark:hover:bg-cream-700',
                  'transition-colors duration-200'
                )}
              >
                <RotateCcw size={14} className="text-blush-500 dark:text-blush-300" />
              </button>
              
              {/* Description content */}
              <div className="pt-6 px-1">
                <h3 className="font-handwriting text-base text-blush-700 dark:text-blush-200 mb-2 truncate">
                  {photo.title}
                </h3>
                <p className="font-handwriting text-blush-600 dark:text-blush-300 text-sm leading-relaxed text-ellipsis-3">
                  {photo.description}
                </p>
                
                {/* Tags */}
                {photo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {photo.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          'px-2 py-0.5 rounded-full text-xs',
                          'bg-blush-100 dark:bg-blush-800/50 text-blush-600 dark:text-blush-300',
                          'truncate max-w-[80px]'
                        )}
                      >
                        #{tag}
                      </span>
                    ))}
                    {photo.tags.length > 3 && (
                      <span className="text-xs text-blush-400 dark:text-blush-500">+{photo.tags.length - 3}</span>
                    )}
                  </div>
                )}
                
                {/* Date */}
                {photo.dateTaken && (
                  <p className="font-handwriting text-blush-400 dark:text-blush-500 text-xs mt-3">
                    {formatDate(photo.dateTaken, 'long')}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default PolaroidFrame;
