'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Trash2, Heart, Save } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassTextarea } from '@/components/ui/GlassTextarea';
import { TagInput } from '@/components/ui/TagInput';
import { ImageUploader } from './ImageUploader';
import type { Photo, CreatePhotoInput, UpdatePhotoInput } from '@/types/photo';

/**
 * Form validation schema
 */
const photoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  dateTaken: z.string().optional(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed'),
  isFavorite: z.boolean(),
});

type PhotoFormData = z.infer<typeof photoSchema>;

/**
 * Props for PhotoEditorModal component
 */
interface PhotoEditorModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Called when modal should close */
  onClose: () => void;
  /** Photo to edit (null for new photo) */
  photo?: Photo | null;
  /** Called when photo is saved */
  onSave: (data: CreatePhotoInput | UpdatePhotoInput, imageUrl?: string) => Promise<void>;
  /** Called when photo is deleted */
  onDelete?: (photoId: string) => Promise<void>;
  /** Available tags for suggestions */
  availableTags?: string[];
}

/**
 * PhotoEditorModal Component
 * 
 * A beautiful modal for creating and editing photos with glass morphism design.
 * 
 * @example
 * ```tsx
 * <PhotoEditorModal
 *   isOpen={isEditorOpen}
 *   onClose={() => setEditorOpen(false)}
 *   photo={selectedPhoto}
 *   onSave={handleSavePhoto}
 *   onDelete={handleDeletePhoto}
 * />
 * ```
 */
export function PhotoEditorModal({
  isOpen,
  onClose,
  photo,
  onSave,
  onDelete,
  availableTags = [],
}: PhotoEditorModalProps) {
  const isEditing = !!photo;
  
  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PhotoFormData>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      title: '',
      description: '',
      dateTaken: '',
      tags: [],
      isFavorite: false,
    },
  });
  
  // Watch form values
  const tags = watch('tags');
  const isFavorite = watch('isFavorite');
  const imageUrl = watch('imageUrl' as keyof PhotoFormData) as string | undefined;
  
  // Track uploaded image URL separately
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(photo?.imageUrl || '');
  
  // Reset form when photo changes
  useEffect(() => {
    if (photo) {
      reset({
        title: photo.title,
        description: photo.description || '',
        dateTaken: photo.dateTaken || '',
        tags: photo.tags,
        isFavorite: photo.isFavorite,
      });
      setUploadedImageUrl(photo.imageUrl);
    } else {
      reset({
        title: '',
        description: '',
        dateTaken: format(new Date(), 'yyyy-MM-dd'),
        tags: [],
        isFavorite: false,
      });
      setUploadedImageUrl('');
    }
  }, [photo, reset]);
  
  // Handle form submission
  const onSubmit = async (data: PhotoFormData) => {
    if (!uploadedImageUrl && !isEditing) {
      return; // Can't create without image
    }
    
    await onSave(
      {
        ...data,
        imageUrl: uploadedImageUrl,
      },
      isEditing ? undefined : uploadedImageUrl
    );
    
    onClose();
  };
  
  // Handle delete
  const handleDelete = async () => {
    if (!photo || !onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this photo? This cannot be undone.')) {
      await onDelete(photo.id);
      onClose();
    }
  };
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            <GlassCard
              blur="heavy"
              opacity={40}
              rounded="2xl"
              className="p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold gradient-text">
                  {isEditing ? 'Edit Photo' : 'Add New Photo'} ✨
                </h2>
                <button
                  onClick={onClose}
                  className={cn(
                    'p-2 rounded-full',
                    'hover:bg-white/20 transition-colors'
                  )}
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              {/* Content */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Image Upload */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Photo
                    </label>
                    <ImageUploader
                      initialImage={photo?.imageUrl}
                      onUploadComplete={setUploadedImageUrl}
                      onRemove={() => setUploadedImageUrl('')}
                    />
                  </div>
                  
                  {/* Right: Form Fields */}
                  <div className="space-y-4">
                    {/* Title */}
                    <GlassInput
                      label="Title"
                      placeholder="Give your photo a name..."
                      {...register('title')}
                      error={errors.title?.message}
                    />
                    
                    {/* Description */}
                    <GlassTextarea
                      label="Description"
                      placeholder="Tell the story behind this photo..."
                      maxLength={500}
                      showCount
                      {...register('description')}
                      error={errors.description?.message}
                    />
                    
                    {/* Date Taken */}
                    <GlassInput
                      type="date"
                      label="Date Taken"
                      leftIcon={<Calendar size={18} />}
                      {...register('dateTaken')}
                    />
                    
                    {/* Tags */}
                    <TagInput
                      label="Tags"
                      value={tags}
                      onChange={(newTags) => setValue('tags', newTags)}
                      suggestions={availableTags}
                      placeholder="Add tags..."
                      maxTags={10}
                    />
                    
                    {/* Favorite Toggle */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setValue('isFavorite', !isFavorite)}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 rounded-full',
                          'transition-all duration-200',
                          isFavorite
                            ? 'bg-rose-100 text-rose-600'
                            : 'bg-white/20 text-gray-600 hover:bg-white/30'
                        )}
                      >
                        <Heart
                          size={18}
                          className={cn(
                            'transition-all duration-200',
                            isFavorite && 'fill-rose-500 text-rose-500'
                          )}
                        />
                        <span className="text-sm font-medium">
                          {isFavorite ? 'Favorited' : 'Add to Favorites'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  {/* Delete button (only for editing) */}
                  {isEditing && onDelete && (
                    <GlassButton
                      type="button"
                      variant="danger"
                      leftIcon={<Trash2 size={18} />}
                      onClick={handleDelete}
                    >
                      Delete
                    </GlassButton>
                  )}
                  
                  {/* Spacer */}
                  {!isEditing && <div />}
                  
                  {/* Save/Cancel buttons */}
                  <div className="flex items-center gap-3">
                    <GlassButton
                      type="button"
                      variant="ghost"
                      onClick={onClose}
                    >
                      Cancel
                    </GlassButton>
                    <GlassButton
                      type="submit"
                      variant="primary"
                      leftIcon={<Save size={18} />}
                      isLoading={isSubmitting}
                      loadingText="Saving..."
                      disabled={!uploadedImageUrl && !isEditing}
                    >
                      {isEditing ? 'Save Changes' : 'Add Photo'}
                    </GlassButton>
                  </div>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default PhotoEditorModal;

