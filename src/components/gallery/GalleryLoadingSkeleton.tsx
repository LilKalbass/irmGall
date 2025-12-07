'use client';

import { cn } from '@/lib/utils';

/**
 * Props for GalleryLoadingSkeleton component
 */
interface GalleryLoadingSkeletonProps {
  /** Number of skeleton items to show */
  count?: number;
  /** Additional className */
  className?: string;
}

/**
 * Single skeleton polaroid card
 */
function SkeletonPolaroid() {
  return (
    <div className="flex justify-center">
      <div
        className={cn(
          'bg-white/30 backdrop-blur-sm rounded-sm',
          'shadow-polaroid',
          'p-3 pb-10'
        )}
        style={{
          width: 240,
          transform: `rotate(${Math.random() * 6 - 3}deg)`,
        }}
      >
        {/* Image skeleton */}
        <div 
          className={cn(
            'w-full aspect-square rounded-sm',
            'bg-gradient-to-r from-gray-200/50 via-gray-100/50 to-gray-200/50',
            'animate-shimmer bg-[length:200%_100%]'
          )}
        />
        
        {/* Text skeleton */}
        <div className="mt-3 space-y-2">
          <div 
            className={cn(
              'h-4 w-3/4 mx-auto rounded-full',
              'bg-gradient-to-r from-gray-200/50 via-gray-100/50 to-gray-200/50',
              'animate-shimmer bg-[length:200%_100%]'
            )}
            style={{ animationDelay: '0.1s' }}
          />
          <div 
            className={cn(
              'h-3 w-1/2 mx-auto rounded-full',
              'bg-gradient-to-r from-gray-200/50 via-gray-100/50 to-gray-200/50',
              'animate-shimmer bg-[length:200%_100%]'
            )}
            style={{ animationDelay: '0.2s' }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * GalleryLoadingSkeleton Component
 * 
 * A shimmer loading skeleton that matches the polaroid grid layout.
 * 
 * @example
 * ```tsx
 * {isLoading ? <GalleryLoadingSkeleton count={8} /> : <GalleryGrid photos={photos} />}
 * ```
 */
export function GalleryLoadingSkeleton({
  count = 8,
  className,
}: GalleryLoadingSkeletonProps) {
  return (
    <div
      className={cn(
        'grid gap-6 md:gap-8',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonPolaroid key={index} />
      ))}
    </div>
  );
}

export default GalleryLoadingSkeleton;

