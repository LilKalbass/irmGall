'use client';

import { motion } from 'framer-motion';
import { Plus, Settings, LogOut, Camera, Sparkles, RefreshCw, Wifi } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { cn } from '@/lib/utils';

/**
 * Props for GalleryHeader component
 */
interface GalleryHeaderProps {
  /** Current user's nickname */
  userName?: string;
  /** Total photo count */
  photoCount?: number;
  /** Whether real-time sync is active */
  isSyncing?: boolean;
  /** Called when add photo is clicked */
  onAddPhoto?: () => void;
  /** Called when settings is clicked */
  onSettings?: () => void;
  /** Called when logout is clicked */
  onLogout?: () => void;
  /** Called when manual refresh is requested */
  onRefresh?: () => void;
  /** Additional className */
  className?: string;
}

/**
 * GalleryHeader Component
 * 
 * The main header for the gallery with warm, lovely styling.
 */
export function GalleryHeader({
  userName,
  photoCount = 0,
  isSyncing = false,
  onAddPhoto,
  onSettings,
  onLogout,
  onRefresh,
  className,
}: GalleryHeaderProps) {
  return (
    <GlassCard
      blur="medium"
      opacity={70}
      rounded="xl"
      hoverEffect="none"
      className={cn('p-4 md:p-5', className)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Title and info */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo/Icon */}
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            className={cn(
              'p-2.5 sm:p-3 rounded-xl flex-shrink-0',
              'bg-gradient-to-br from-blush-300 to-blush-400',
              'shadow-cute'
            )}
          >
            <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </motion.div>
          
          {/* Title */}
          <div className="min-w-0">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg xs:text-xl sm:text-2xl font-display font-bold flex items-center gap-2"
            >
              <span className="gradient-text truncate">IRM Gallery</span>
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                className="flex-shrink-0"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cream-500" />
              </motion.span>
            </motion.h1>
            
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className="text-xs sm:text-sm text-blush-600/70 dark:text-blush-300/70 truncate">
                {photoCount === 0 ? (
                  'Start your memories'
                ) : photoCount === 1 ? (
                  '1 precious memory'
                ) : (
                  `${photoCount} precious memories`
                )}
                {userName && (
                  <span className="hidden sm:inline ml-1">
                    • <span className="text-blush-500 dark:text-blush-300 font-medium">{userName}</span>
                  </span>
                )}
              </p>
              
              {/* Live sync indicator */}
              <div 
                className="flex items-center gap-1 text-xs text-sage-600 dark:text-sage-400 flex-shrink-0" 
                title="Real-time sync active"
              >
                <Wifi size={10} />
                <span className="hidden xs:inline">Live</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Manual Refresh */}
          {onRefresh && (
            <GlassButton
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              aria-label="Refresh"
              title="Refresh gallery"
            >
              <RefreshCw 
                size={16} 
                className={cn(isSyncing && 'animate-spin')} 
              />
            </GlassButton>
          )}
          
          {/* Add Photo - Primary action */}
          {onAddPhoto && (
            <GlassButton
              variant="primary"
              size="md"
              leftIcon={<Plus size={18} />}
              onClick={onAddPhoto}
              glow
            >
              <span className="hidden sm:inline">Add Photo</span>
              <span className="sm:hidden">Add</span>
            </GlassButton>
          )}
          
          {/* Settings */}
          {onSettings && (
            <GlassButton
              variant="secondary"
              size="icon"
              onClick={onSettings}
              aria-label="Settings"
            >
              <Settings size={16} />
            </GlassButton>
          )}
          
          {/* Logout */}
          {onLogout && (
            <GlassButton
              variant="ghost"
              size="icon"
              onClick={onLogout}
              aria-label="Logout"
            >
              <LogOut size={16} />
            </GlassButton>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

export default GalleryHeader;
