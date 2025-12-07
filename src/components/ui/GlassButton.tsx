'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * Button variant options
 */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';

/**
 * Button size options
 */
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

/**
 * Props for GlassButton component
 */
interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children?: ReactNode;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Icon to show on the left */
  leftIcon?: ReactNode;
  /** Icon to show on the right */
  rightIcon?: ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Loading text to display */
  loadingText?: string;
  /** Whether button is full width */
  fullWidth?: boolean;
  /** Whether to show glow effect on hover */
  glow?: boolean;
}

/**
 * Variant style mapping - warm palette
 */
const variantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-gradient-to-r from-blush-300 to-blush-400',
    'text-blush-900',
    'hover:from-blush-400 hover:to-blush-500',
    'shadow-cute hover:shadow-cute-lg',
    'border-blush-200/50'
  ),
  secondary: cn(
    'bg-white/40 hover:bg-white/55',
    'text-blush-800',
    'border-blush-200/40',
    'hover:border-blush-300/50'
  ),
  ghost: cn(
    'bg-transparent hover:bg-blush-50/50',
    'text-blush-700',
    'border-transparent',
    'hover:border-blush-200/30'
  ),
  danger: cn(
    'bg-gradient-to-r from-red-300 to-red-400',
    'text-red-900',
    'hover:from-red-400 hover:to-red-500',
    'border-red-200/50'
  ),
  success: cn(
    'bg-gradient-to-r from-sage-300 to-sage-400',
    'text-sage-900',
    'hover:from-sage-400 hover:to-sage-500',
    'border-sage-200/50'
  ),
};

/**
 * Size style mapping
 */
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2',
  icon: 'p-2 aspect-square',
};

/**
 * Icon size mapping
 */
const iconSizes: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  lg: 18,
  icon: 18,
};

/**
 * GlassButton Component
 * 
 * A beautiful warm-tinted glass button with multiple variants and states.
 */
export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      isLoading = false,
      loadingText,
      fullWidth = false,
      glow = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          'font-medium rounded-full',
          'border backdrop-blur-sm',
          'transition-all duration-300 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blush-300/50',
          
          // Variant styles
          variantClasses[variant],
          
          // Size styles
          sizeClasses[size],
          
          // Full width
          fullWidth && 'w-full',
          
          // Glow effect
          glow && 'hover:shadow-glow',
          
          // Disabled state
          isDisabled && 'opacity-60 cursor-not-allowed hover:transform-none',
          
          // Active state
          !isDisabled && 'active:scale-[0.97]',
          
          // Hover transform
          !isDisabled && 'hover:scale-[1.02]',
          
          // Prevent text wrapping
          'whitespace-nowrap',
          
          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <Loader2 
            className="animate-spin mr-1.5" 
            size={iconSizes[size]} 
          />
        )}
        
        {/* Left icon */}
        {!isLoading && leftIcon && (
          <span className="flex-shrink-0">
            {leftIcon}
          </span>
        )}
        
        {/* Button text */}
        {children && (
          <span className="truncate">
            {isLoading && loadingText ? loadingText : children}
          </span>
        )}
        
        {/* Right icon */}
        {!isLoading && rightIcon && (
          <span className="flex-shrink-0">
            {rightIcon}
          </span>
        )}
        
        {/* Shine effect overlay */}
        <div 
          className={cn(
            'absolute inset-0 rounded-full opacity-0 transition-opacity duration-300',
            'bg-gradient-to-r from-transparent via-white/20 to-transparent',
            !isDisabled && 'hover:opacity-100'
          )}
        />
      </button>
    );
  }
);

GlassButton.displayName = 'GlassButton';

export default GlassButton;
