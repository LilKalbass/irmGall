import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 * @param inputs - Class names to merge
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Generate a random rotation for polaroid effect
 * @param range - Maximum rotation in degrees (positive and negative)
 * @returns Random rotation value
 */
export function getRandomRotation(range: number = 3): number {
  return Math.random() * range * 2 - range;
}

/**
 * Format a date string for display
 * @param dateString - ISO date string
 * @param format - Display format
 * @returns Formatted date string
 */
export function formatDate(dateString: string, format: 'short' | 'long' | 'cute' = 'cute'): string {
  const date = new Date(dateString);
  
  if (format === 'cute') {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options) + ' ♡';
  }
  
  if (format === 'long') {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }
  
  // Short format
  return date.toLocaleDateString('en-US');
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Delay execution for a specified time
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate a unique ID
 * @returns Unique string identifier
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if we're running on the client side
 * @returns True if running in browser
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Debounce function execution
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

/**
 * Validate file type for upload
 * @param file - File to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns True if file type is valid
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get contrasting text color based on background
 * @param hexColor - Background hex color
 * @returns 'white' or 'black'
 */
export function getContrastColor(hexColor: string): 'white' | 'black' {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'black' : 'white';
}

