'use client';

import { motion } from 'framer-motion';
import { ImagePlus, Camera, Sparkles, Heart } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { cn } from '@/lib/utils';

/**
 * Props for GalleryEmptyState component
 */
interface GalleryEmptyStateProps {
  /** Title text */
  title?: string;
  /** Description text */
  description?: string;
  /** Called when add photo is clicked */
  onAddPhoto?: () => void;
  /** Additional className */
  className?: string;
}

/**
 * GalleryEmptyState Component
 * 
 * Beautiful warm-themed empty state with cute illustrations.
 */
export function GalleryEmptyState({
  title = 'Your gallery awaits',
  description = 'Start adding your precious memories and watch your gallery come to life',
  onAddPhoto,
  className,
}: GalleryEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('flex justify-center py-12 px-4', className)}
    >
      <GlassCard
        blur="medium"
        opacity={60}
        rounded="2xl"
        hoverEffect="none"
        className="p-8 sm:p-10 max-w-md text-center"
      >
        {/* Cute illustration */}
        <div className="relative mb-6 inline-block">
          {/* Main camera icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className={cn(
              'p-5 rounded-2xl',
              'bg-gradient-to-br from-blush-200/60 to-blush-300/40',
              'shadow-cute'
            )}
          >
            <Camera className="w-10 h-10 text-blush-500" />
          </motion.div>
          
          {/* Floating decorations */}
          <motion.div
            animate={{ 
              y: [0, -6, 0],
              rotate: [0, 5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-5 h-5 text-cream-500" />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, 5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
            className="absolute -bottom-1 -left-2"
          >
            <Heart className="w-4 h-4 text-blush-400 fill-blush-400" />
          </motion.div>
        </div>
        
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl font-display font-bold text-blush-800 mb-2"
        >
          {title}
        </motion.h2>
        
        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-blush-600/70 mb-6 max-w-xs mx-auto"
        >
          {description}
        </motion.p>
        
        {/* Action button */}
        {onAddPhoto && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassButton
              variant="primary"
              leftIcon={<ImagePlus size={18} />}
              onClick={onAddPhoto}
              glow
            >
              Add Your First Photo
            </GlassButton>
          </motion.div>
        )}
        
        {/* Cute emoji row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 flex justify-center gap-2 text-lg"
        >
          <span>📸</span>
          <span>✨</span>
          <span>💕</span>
          <span>🌸</span>
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}

export default GalleryEmptyState;
