'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Input size options
 */
type InputSize = 'sm' | 'md' | 'lg';

/**
 * Props for GlassInput component
 */
interface GlassInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Icon on the left side */
  leftIcon?: ReactNode;
  /** Icon on the right side */
  rightIcon?: ReactNode;
  /** Size variant */
  size?: InputSize;
  /** Whether input is full width */
  fullWidth?: boolean;
}

/**
 * Size class mapping
 */
const sizeClasses: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-3.5 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
};

/**
 * Icon container size mapping
 */
const iconContainerClasses: Record<InputSize, string> = {
  sm: 'pl-8',
  md: 'pl-9',
  lg: 'pl-10',
};

/**
 * GlassInput Component
 * 
 * A beautiful warm-tinted glass input with label, icons, and error states.
 */
export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      size = 'md',
      fullWidth = true,
      type = 'text',
      className,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;
    
    const hasError = !!error;
    
    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label className="text-xs font-medium text-blush-700 ml-0.5">
            {label}
          </label>
        )}
        
        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-blush-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              // Base styles
              'w-full rounded-xl',
              'bg-white/50 backdrop-blur-sm',
              'border border-blush-200/50',
              'text-blush-800 placeholder:text-blush-400/70',
              'transition-all duration-200 ease-out',
              
              // Focus styles
              'focus:outline-none focus:ring-2 focus:ring-blush-300/50',
              'focus:border-blush-300/60 focus:bg-white/60',
              
              // Size
              sizeClasses[size],
              
              // Left icon padding
              leftIcon && iconContainerClasses[size],
              
              // Right icon/password padding
              (rightIcon || isPassword) && 'pr-9',
              
              // Error state
              hasError && 'border-red-300/60 focus:ring-red-300/50 focus:border-red-300/60',
              
              // Disabled state
              'disabled:opacity-50 disabled:cursor-not-allowed',
              
              className
            )}
            {...props}
          />
          
          {/* Right icon or password toggle */}
          {(rightIcon || isPassword) && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-blush-400 hover:text-blush-600 transition-colors p-0.5"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              ) : (
                <span className="text-blush-400 pointer-events-none">
                  {rightIcon}
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Helper text or error */}
        {(helperText || error) && (
          <div className={cn(
            'text-xs ml-0.5 flex items-center gap-1',
            hasError ? 'text-red-500' : 'text-blush-500/70'
          )}>
            {hasError && <AlertCircle size={11} />}
            <span className="truncate">{error || helperText}</span>
          </div>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';

export default GlassInput;
