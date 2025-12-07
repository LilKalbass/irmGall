'use client';

import { useState, useRef, useCallback, type KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Props for TagInput component
 */
interface TagInputProps {
  /** Current tags */
  value: string[];
  /** Called when tags change */
  onChange: (tags: string[]) => void;
  /** Suggestions for autocomplete */
  suggestions?: string[];
  /** Placeholder text */
  placeholder?: string;
  /** Maximum number of tags */
  maxTags?: number;
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Pastel colors for tags
 */
const tagColors = [
  'bg-rose-100 text-rose-700 border-rose-200',
  'bg-lavender-100 text-purple-700 border-lavender-200',
  'bg-sky-100 text-sky-700 border-sky-200',
  'bg-mint-100 text-emerald-700 border-mint-200',
  'bg-peach-100 text-orange-700 border-peach-200',
  'bg-amber-100 text-amber-700 border-amber-200',
];

/**
 * Get consistent color for a tag based on its content
 */
function getTagColor(tag: string): string {
  const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return tagColors[hash % tagColors.length];
}

/**
 * TagInput Component
 * 
 * A beautiful glass-styled tag input with autocomplete suggestions.
 * 
 * @example
 * ```tsx
 * <TagInput
 *   value={tags}
 *   onChange={setTags}
 *   suggestions={allTags}
 *   placeholder="Add tags..."
 *   maxTags={5}
 * />
 * ```
 */
export function TagInput({
  value,
  onChange,
  suggestions = [],
  placeholder = 'Add a tag...',
  maxTags = 10,
  label,
  error,
  disabled = false,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Filter suggestions based on input
  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
      !value.includes(suggestion)
  ).slice(0, 5);
  
  // Add a tag
  const addTag = useCallback((tag: string) => {
    const normalizedTag = tag.trim().toLowerCase();
    if (
      normalizedTag &&
      !value.includes(normalizedTag) &&
      value.length < maxTags
    ) {
      onChange([...value, normalizedTag]);
      setInputValue('');
    }
  }, [value, onChange, maxTags]);
  
  // Remove a tag
  const removeTag = useCallback((tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  }, [value, onChange]);
  
  // Handle keyboard events
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
    inputRef.current?.focus();
  };
  
  const canAddMore = value.length < maxTags;
  
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200 ml-1">
          {label}
        </label>
      )}
      
      {/* Input container */}
      <div
        className={cn(
          'relative flex flex-wrap gap-2 p-2 min-h-[44px]',
          'bg-white/20 backdrop-blur-sm rounded-xl',
          'border border-white/30',
          'transition-all duration-300',
          isFocused && 'ring-2 ring-rose-400/50 border-rose-300/50 bg-white/30',
          error && 'border-red-400/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Tags */}
        <AnimatePresence mode="popLayout">
          {value.map((tag) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              layout
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-full',
                'text-xs font-medium border',
                'transition-all duration-200',
                getTagColor(tag)
              )}
            >
              #{tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                  className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </motion.span>
          ))}
        </AnimatePresence>
        
        {/* Input */}
        {canAddMore && !disabled && (
          <div className="flex-1 min-w-[100px] flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              onKeyDown={handleKeyDown}
              placeholder={value.length === 0 ? placeholder : ''}
              className={cn(
                'flex-1 bg-transparent outline-none',
                'text-sm text-gray-700 dark:text-gray-200',
                'placeholder:text-gray-400'
              )}
              disabled={disabled}
            />
          </div>
        )}
        
        {/* Add button hint */}
        {canAddMore && inputValue && (
          <button
            type="button"
            onClick={() => addTag(inputValue)}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-full',
              'text-xs font-medium',
              'bg-rose-100 text-rose-600',
              'hover:bg-rose-200 transition-colors'
            )}
          >
            <Plus size={12} />
            Add
          </button>
        )}
      </div>
      
      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isFocused && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'absolute z-50 mt-1 w-full',
              'bg-white/90 backdrop-blur-md rounded-lg',
              'border border-white/50 shadow-lg',
              'overflow-hidden'
            )}
            style={{ top: '100%' }}
          >
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm',
                  'text-gray-700 hover:bg-rose-50',
                  'transition-colors duration-150'
                )}
              >
                #{suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error or helper text */}
      <div className="flex justify-between items-center ml-1">
        {error && (
          <span className="text-xs text-red-500">{error}</span>
        )}
        <span className="text-xs text-gray-400 ml-auto">
          {value.length}/{maxTags} tags
        </span>
      </div>
    </div>
  );
}

export default TagInput;

