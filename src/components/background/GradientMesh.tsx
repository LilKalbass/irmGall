'use client';

import { cn } from '@/lib/utils';

/**
 * Props for GradientMesh component
 */
interface GradientMeshProps {
  /** Whether animations are enabled */
  animated?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * GradientMesh Component
 * 
 * A beautiful animated gradient mesh background with warm, lovely pastel colors.
 * Creates a dreamy, romantic atmosphere perfect for the gallery.
 */
export function GradientMesh({ animated = true, className }: GradientMeshProps) {
  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      {/* Base warm gradient - light mode */}
      <div 
        className={cn(
          'absolute inset-0 dark:opacity-0 transition-opacity duration-500',
          animated && 'animate-gradient-shift'
        )}
        style={{
          background: `
            linear-gradient(
              135deg,
              #fff5f7 0%,
              #fff8f5 15%,
              #fffbf5 30%,
              #fff5f7 45%,
              #faf7fc 60%,
              #fff8f5 75%,
              #fff5f0 90%,
              #fff5f7 100%
            )
          `,
          backgroundSize: '400% 400%',
        }}
      />
      
      {/* Base gradient - dark mode */}
      <div 
        className={cn(
          'absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-500',
          animated && 'animate-gradient-shift'
        )}
        style={{
          background: `
            linear-gradient(
              135deg,
              #1a1418 0%,
              #1e181c 15%,
              #1c1619 30%,
              #1a1418 45%,
              #1d171b 60%,
              #1e181c 75%,
              #1b1519 90%,
              #1a1418 100%
            )
          `,
          backgroundSize: '400% 400%',
        }}
      />
      
      {/* Warm pink orb - top right */}
      <div 
        className={cn(
          'absolute w-[500px] h-[500px] rounded-full',
          'bg-gradient-to-br from-blush-200/50 to-blush-300/30',
          'dark:from-blush-900/30 dark:to-blush-800/20',
          'blur-3xl',
          animated && 'animate-float'
        )}
        style={{
          top: '-5%',
          right: '-8%',
        }}
      />
      
      {/* Soft peach orb - bottom left */}
      <div 
        className={cn(
          'absolute w-[450px] h-[450px] rounded-full',
          'bg-gradient-to-tr from-peach-200/40 to-cream-200/30',
          'dark:from-peach-900/25 dark:to-cream-900/15',
          'blur-3xl',
          animated && 'animate-float-delayed'
        )}
        style={{
          bottom: '-5%',
          left: '-8%',
        }}
      />
      
      {/* Lavender accent - center */}
      <div 
        className={cn(
          'absolute w-[350px] h-[350px] rounded-full',
          'bg-gradient-to-bl from-lavender-200/30 to-blush-100/20',
          'dark:from-lavender-900/20 dark:to-blush-900/10',
          'blur-3xl',
          animated && 'animate-float'
        )}
        style={{
          top: '35%',
          left: '45%',
          transform: 'translateX(-50%)',
          animationDelay: '1s',
        }}
      />
      
      {/* Cream highlight - top left */}
      <div 
        className={cn(
          'absolute w-[300px] h-[300px] rounded-full',
          'bg-gradient-to-r from-cream-100/50 to-peach-100/30',
          'dark:from-cream-900/20 dark:to-peach-900/15',
          'blur-3xl',
          animated && 'animate-float-delayed'
        )}
        style={{
          top: '15%',
          left: '8%',
          animationDelay: '2s',
        }}
      />
      
      {/* Small accent orb - bottom right */}
      <div 
        className={cn(
          'absolute w-[250px] h-[250px] rounded-full',
          'bg-gradient-to-tl from-blush-100/40 to-lavender-100/25',
          'dark:from-blush-900/25 dark:to-lavender-900/15',
          'blur-2xl',
          animated && 'animate-float'
        )}
        style={{
          bottom: '20%',
          right: '10%',
          animationDelay: '1.5s',
        }}
      />
      
      {/* Subtle warm overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 245, 240, 0.4) 0%, transparent 70%)',
        }}
      />
      
      {/* Very subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

export default GradientMesh;
