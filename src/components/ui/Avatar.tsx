'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Size options for avatar
 */
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Props for Avatar component
 */
interface AvatarProps {
  /** Image source URL */
  src?: string | null;
  /** Alt text / name for fallback */
  name?: string;
  /** Size of the avatar */
  size?: AvatarSize;
  /** Whether to show online indicator */
  showStatus?: boolean;
  /** Online status */
  status?: 'online' | 'offline' | 'away';
  /** Additional className */
  className?: string;
}

/**
 * Size configurations
 */
const sizeConfig: Record<AvatarSize, { size: number; text: string; statusSize: string }> = {
  xs: { size: 24, text: 'text-xs', statusSize: 'w-2 h-2' },
  sm: { size: 32, text: 'text-sm', statusSize: 'w-2.5 h-2.5' },
  md: { size: 40, text: 'text-base', statusSize: 'w-3 h-3' },
  lg: { size: 48, text: 'text-lg', statusSize: 'w-3.5 h-3.5' },
  xl: { size: 64, text: 'text-xl', statusSize: 'w-4 h-4' },
};

/**
 * Status colors
 */
const statusColors = {
  online: 'bg-emerald-400',
  offline: 'bg-gray-400',
  away: 'bg-amber-400',
};

/**
 * Pastel background colors for initials
 */
const avatarColors = [
  'bg-rose-200 text-rose-700',
  'bg-purple-200 text-purple-700',
  'bg-sky-200 text-sky-700',
  'bg-emerald-200 text-emerald-700',
  'bg-amber-200 text-amber-700',
  'bg-pink-200 text-pink-700',
];

/**
 * Get initials from name
 */
function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Get consistent color based on name
 */
function getColorForName(name: string): string {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length];
}

/**
 * Avatar Component
 * 
 * A beautiful avatar component with image support and initials fallback.
 * 
 * @example
 * ```tsx
 * <Avatar name="Luna Star" size="md" showStatus status="online" />
 * ```
 */
export function Avatar({
  src,
  name = 'User',
  size = 'md',
  showStatus = false,
  status = 'online',
  className,
}: AvatarProps) {
  const config = sizeConfig[size];
  
  const initials = useMemo(() => getInitials(name), [name]);
  const colorClass = useMemo(() => getColorForName(name), [name]);
  
  return (
    <div className={cn('relative inline-block', className)}>
      {src ? (
        <Image
          src={src}
          alt={name}
          width={config.size}
          height={config.size}
          className="rounded-full object-cover"
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold',
            colorClass,
            config.text
          )}
          style={{
            width: config.size,
            height: config.size,
          }}
        >
          {initials}
        </div>
      )}
      
      {/* Status indicator */}
      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            config.statusSize,
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}

export default Avatar;

