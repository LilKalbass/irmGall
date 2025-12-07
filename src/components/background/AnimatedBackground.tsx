'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { GradientMesh } from './GradientMesh';
import type { BackgroundType } from '@/types/settings';

/**
 * Props for AnimatedBackground component
 */
interface AnimatedBackgroundProps {
  /** Type of background to display */
  type?: BackgroundType;
  /** URL for image or video background */
  url?: string;
  /** Blur intensity (0-20) */
  blurIntensity?: number;
  /** Overlay opacity (0-100) */
  overlayOpacity?: number;
  /** Custom gradient CSS */
  gradient?: string;
  /** Solid background color */
  color?: string;
  /** Whether background is transitioning */
  isTransitioning?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * AnimatedBackground Component
 * 
 * A versatile background component supporting video, image, gradient, and solid backgrounds
 * with beautiful blur effects and smooth transitions.
 */
export function AnimatedBackground({
  type = 'gradient',
  url,
  blurIntensity = 10,
  overlayOpacity = 30,
  gradient,
  color,
  isTransitioning = false,
  className,
}: AnimatedBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [previousUrl, setPreviousUrl] = useState<string | undefined>();
  
  // Handle URL changes with crossfade
  useEffect(() => {
    if (url !== currentUrl) {
      setPreviousUrl(currentUrl);
      setCurrentUrl(url);
      setIsLoaded(false);
    }
  }, [url, currentUrl]);
  
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    // Clear previous URL after transition
    setTimeout(() => setPreviousUrl(undefined), 500);
  }, []);
  
  // Calculate blur style
  const blurStyle = {
    filter: `blur(${blurIntensity}px)`,
    transform: 'scale(1.1)', // Prevent blur edges from showing
  };
  
  return (
    <div className={cn('fixed inset-0 -z-10 overflow-hidden', className)}>
      {/* Gradient background */}
      {type === 'gradient' && (
        <GradientMesh animated={!isTransitioning} />
      )}
      
      {/* Solid color background */}
      {type === 'solid' && (
        <div 
          className="absolute inset-0 transition-colors duration-500"
          style={{ backgroundColor: color || '#fdf2f8' }}
        />
      )}
      
      {/* Custom gradient background */}
      {type === 'gradient' && gradient && (
        <div 
          className="absolute inset-0 transition-all duration-500"
          style={{ background: gradient }}
        />
      )}
      
      {/* Image background */}
      {type === 'image' && currentUrl && (
        <>
          {/* Previous image (for crossfade) */}
          {previousUrl && (
            <div 
              className={cn(
                'absolute inset-0 transition-opacity duration-500',
                isLoaded ? 'opacity-0' : 'opacity-100'
              )}
              style={blurStyle}
            >
              <Image
                src={previousUrl}
                alt="Background"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
          {/* Current image */}
          <div 
            className={cn(
              'absolute inset-0 transition-opacity duration-500',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            style={blurStyle}
          >
            <Image
              src={currentUrl}
              alt="Background"
              fill
              className="object-cover"
              priority
              onLoad={handleLoad}
            />
          </div>
        </>
      )}
      
      {/* Video background */}
      {type === 'video' && currentUrl && (
        <div 
          className="absolute inset-0"
          style={blurStyle}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={handleLoad}
            className={cn(
              'absolute inset-0 w-full h-full object-cover',
              'transition-opacity duration-500',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
          >
            <source src={currentUrl} type="video/mp4" />
          </video>
        </div>
      )}
      
      {/* Gradient overlay for better text readability */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(255, 255, 255, ${overlayOpacity / 200}) 0%,
            rgba(255, 255, 255, ${overlayOpacity / 100}) 50%,
            rgba(255, 255, 255, ${overlayOpacity / 200}) 100%
          )`,
        }}
      />
      
      {/* Subtle vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 0%,
            rgba(0, 0, 0, 0.05) 100%
          )`,
        }}
      />
    </div>
  );
}

export default AnimatedBackground;

