'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react';
import { cn, formatFileSize, isValidFileType } from '@/lib/utils';
import { GlassButton } from '@/components/ui/GlassButton';

/**
 * Accepted file types for upload
 */
const ACCEPTED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
};

const ACCEPTED_MIME_TYPES = Object.keys(ACCEPTED_TYPES);

/**
 * Maximum file size (10MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Upload status
 */
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

/**
 * Props for ImageUploader component
 */
interface ImageUploaderProps {
  /** Called when upload is complete */
  onUploadComplete: (imageUrl: string) => void;
  /** Called when upload fails */
  onUploadError?: (error: string) => void;
  /** Called when image is removed */
  onRemove?: () => void;
  /** Initial image URL (for editing) */
  initialImage?: string;
  /** Whether uploader is disabled */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * ImageUploader Component
 * 
 * A beautiful drag-and-drop image uploader with preview and progress.
 * 
 * @example
 * ```tsx
 * <ImageUploader
 *   onUploadComplete={(url) => setImageUrl(url)}
 *   onUploadError={(error) => toast.error(error)}
 * />
 * ```
 */
export function ImageUploader({
  onUploadComplete,
  onUploadError,
  onRemove,
  initialImage,
  disabled = false,
  className,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [status, setStatus] = useState<UploadStatus>(initialImage ? 'success' : 'idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    // Validate file type
    if (!isValidFileType(file, ACCEPTED_MIME_TYPES)) {
      const errorMsg = 'Please upload a valid image (JPEG, PNG, WebP, or GIF)';
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const errorMsg = `File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`;
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }
    
    // Clear previous errors
    setError(null);
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Start upload
    setStatus('uploading');
    setProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate progress (actual progress would come from XMLHttpRequest)
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }
      
      const result = await response.json();
      
      setProgress(100);
      setStatus('success');
      // API returns { data: { url } } structure
      onUploadComplete(result.data?.url || result.url);
      
      // Clean up object URL
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMsg);
      setStatus('error');
      onUploadError?.(errorMsg);
    }
  }, [onUploadComplete, onUploadError]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    disabled: disabled || status === 'uploading',
  });
  
  // Handle remove
  const handleRemove = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setStatus('idle');
    setProgress(0);
    setError(null);
    onRemove?.();
  };
  
  return (
    <div className={cn('w-full', className)}>
      <AnimatePresence mode="wait">
        {preview ? (
          /* Preview State */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative aspect-square rounded-xl overflow-hidden"
          >
            <Image
              src={preview}
              alt="Upload preview"
              fill
              className="object-cover"
            />
            
            {/* Upload progress overlay */}
            {status === 'uploading' && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
                <div className="w-32 h-2 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-white text-sm">{progress}%</span>
              </div>
            )}
            
            {/* Success overlay */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-2 right-2 p-2 rounded-full bg-emerald-500"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
            
            {/* Remove button */}
            {status !== 'uploading' && (
              <button
                onClick={handleRemove}
                className={cn(
                  'absolute top-2 left-2 p-2 rounded-full',
                  'bg-black/50 hover:bg-black/70',
                  'transition-colors duration-200'
                )}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </motion.div>
        ) : (
          /* Dropzone State */
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            {...(({ onDrag: _onDrag, onDragStart: _onDragStart, onDragEnd: _onDragEnd, onDragOver: _onDragOver, ...rest }) => rest)(getRootProps())}
            className={cn(
              'relative aspect-square rounded-xl cursor-pointer',
              'bg-white/20 backdrop-blur-sm',
              'border-2 border-dashed',
              'transition-all duration-300',
              isDragActive 
                ? 'border-rose-400 bg-rose-50/30' 
                : 'border-white/40 hover:border-rose-300/50 hover:bg-white/30',
              error && 'border-red-400/50',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input {...getInputProps()} />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
              {/* Icon */}
              <motion.div
                animate={{
                  y: isDragActive ? -10 : 0,
                  scale: isDragActive ? 1.1 : 1,
                }}
                className={cn(
                  'p-4 rounded-full',
                  'bg-rose-100/50 text-rose-400'
                )}
              >
                {isDragActive ? (
                  <Upload className="w-8 h-8" />
                ) : (
                  <ImageIcon className="w-8 h-8" />
                )}
              </motion.div>
              
              {/* Text */}
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-200">
                  {isDragActive ? 'Drop your image here' : 'Drag & drop an image'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  or click to browse
                </p>
              </div>
              
              {/* File type hint */}
              <p className="text-xs text-gray-400">
                JPEG, PNG, WebP, GIF • Max 10MB
              </p>
              
              {/* Browse button */}
              <GlassButton size="sm" variant="secondary">
                Browse Files
              </GlassButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mt-2 text-red-500 text-sm"
        >
          <AlertCircle size={14} />
          {error}
        </motion.div>
      )}
    </div>
  );
}

export default ImageUploader;

