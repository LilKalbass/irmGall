'use client';

import { forwardRef, type TextareaHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

/**
 * Props for GlassTextarea component
 */
interface GlassTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Label text */
  label?: string;
  /** Helper text below textarea */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Maximum character count */
  maxLength?: number;
  /** Show character count */
  showCount?: boolean;
  /** Whether textarea is full width */
  fullWidth?: boolean;
}

/**
 * GlassTextarea Component
 * 
 * A beautiful glass-styled textarea with label, error states, and character count.
 * 
 * @example
 * ```tsx
 * <GlassTextarea
 *   label="Description"
 *   placeholder="Enter a description..."
 *   maxLength={500}
 *   showCount
 * />
 * ```
 */
export const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  (
    {
      label,
      helperText,
      error,
      maxLength,
      showCount = false,
      fullWidth = true,
      className,
      onChange,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState(
      String(value || defaultValue || '').length
    );
    
    const hasError = !!error;
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };
    
    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200 ml-1">
            {label}
          </label>
        )}
        
        {/* Textarea */}
        <textarea
          ref={ref}
          maxLength={maxLength}
          onChange={handleChange}
          value={value}
          defaultValue={defaultValue}
          className={cn(
            // Base styles
            'w-full rounded-xl min-h-[100px] resize-y',
            'bg-white/20 backdrop-blur-sm',
            'border border-white/30',
            'text-gray-800 dark:text-white',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'transition-all duration-300 ease-out',
            'px-4 py-3 text-base',
            
            // Focus styles
            'focus:outline-none focus:ring-2 focus:ring-rose-400/50',
            'focus:border-rose-300/50 focus:bg-white/30',
            
            // Scrollbar
            'scrollbar-cute',
            
            // Error state
            hasError && 'border-red-400/50 focus:ring-red-400/50 focus:border-red-400/50',
            
            // Disabled state
            'disabled:opacity-50 disabled:cursor-not-allowed',
            
            className
          )}
          {...props}
        />
        
        {/* Footer: Helper text, error, and character count */}
        <div className="flex justify-between items-center ml-1 mr-1">
          {/* Helper text or error */}
          <div className={cn(
            'text-xs flex items-center gap-1',
            hasError ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
          )}>
            {hasError && <AlertCircle size={12} />}
            {error || helperText || ' '}
          </div>
          
          {/* Character count */}
          {showCount && maxLength && (
            <div className={cn(
              'text-xs',
              charCount >= maxLength ? 'text-red-500' : 'text-gray-400'
            )}>
              {charCount}/{maxLength}
            </div>
          )}
        </div>
      </div>
    );
  }
);

GlassTextarea.displayName = 'GlassTextarea';

export default GlassTextarea;

