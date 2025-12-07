'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for ParticleOverlay component
 */
interface ParticleOverlayProps {
  /** Number of particles to display */
  count?: number;
  /** Particle colors (array of CSS colors) */
  colors?: string[];
  /** Whether particles are animated */
  animated?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Individual particle configuration
 */
interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  color: string;
  duration: number;
  delay: number;
  opacity: number;
}

/**
 * ParticleOverlay Component
 * 
 * Creates a subtle floating particle/bokeh effect for a dreamy atmosphere.
 * Uses pure CSS animations for performance.
 */
export function ParticleOverlay({
  count = 30,
  colors = [
    'rgba(251, 113, 133, 0.3)',  // Rose
    'rgba(216, 180, 254, 0.3)',  // Lavender
    'rgba(253, 186, 116, 0.25)', // Peach
    'rgba(125, 211, 252, 0.25)', // Sky
    'rgba(255, 255, 255, 0.4)',  // White
  ],
  animated = true,
  className,
}: ParticleOverlayProps) {
  // Generate particles with random properties
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 20 + 5, // 5-25px
      x: Math.random() * 100, // 0-100%
      y: Math.random() * 100, // 0-100%
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 20 + 15, // 15-35s
      delay: Math.random() * -20, // Stagger start times
      opacity: Math.random() * 0.5 + 0.2, // 0.2-0.7
    }));
  }, [count, colors]);
  
  return (
    <div 
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        className
      )}
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={cn(
            'absolute rounded-full blur-sm',
            animated && 'animate-float'
          )}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      
      {/* Extra large blurred orbs for depth */}
      <div 
        className={cn(
          'absolute w-32 h-32 rounded-full blur-2xl',
          'bg-rose-300/20',
          animated && 'animate-float'
        )}
        style={{
          top: '20%',
          right: '15%',
          animationDuration: '25s',
        }}
      />
      
      <div 
        className={cn(
          'absolute w-24 h-24 rounded-full blur-2xl',
          'bg-lavender-300/20',
          animated && 'animate-float-delayed'
        )}
        style={{
          bottom: '30%',
          left: '10%',
          animationDuration: '30s',
        }}
      />
    </div>
  );
}

export default ParticleOverlay;

