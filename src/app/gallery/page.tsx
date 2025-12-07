'use client';

import { useState, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { AnimatedBackground } from '@/components/background';
import { 
  GalleryHeader, 
  GalleryFilters, 
  GalleryGrid, 
  PhotoEditorModal,
  PhotoViewerModal 
} from '@/components/gallery';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { ConfirmDialog, Confetti } from '@/components/ui';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { usePhotos } from '@/hooks/usePhotos';
import { useBackground } from '@/context/BackgroundContext';
import type { Photo, PhotoFrame, CreatePhotoInput, UpdatePhotoInput } from '@/types/photo';

/**
 * Gallery Page
 * 
 * The main gallery view showing all photos in a beautiful polaroid grid.
 * Protected by authentication.
 */
function GalleryContent() {
  const { data: session } = useSession();
  const {
    photos,
    filters,
    sortOption,
    isLoading,
    allTags,
    totalCount,
    filteredCount,
    isPolling,
    addPhoto,
    updatePhoto,
    deletePhoto,
    toggleFavorite,
    selectPhoto,
    selectedPhoto,
    setFilters,
    clearFilters,
    setSortOption,
    refreshPhotos,
  } = usePhotos({
    enablePolling: true,
    pollingInterval: 15000, // Refresh every 15 seconds
  });
  
  const { type, url, gradient, color, blurIntensity, overlayOpacity } = useBackground();
  
  // UI state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<PhotoFrame | null>(null);
  const [viewingPhoto, setViewingPhoto] = useState<PhotoFrame | null>(null);
  const [photoToDelete, setPhotoToDelete] = useState<Photo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Get user nickname from session
  const userName = (session?.user as { nickname?: string })?.nickname || session?.user?.name;
  
  // Handle add photo click
  const handleAddPhoto = useCallback(() => {
    setEditingPhoto(null);
    setIsEditorOpen(true);
  }, []);
  
  // Handle photo click - open viewer
  const handlePhotoClick = useCallback((photo: Photo) => {
    setViewingPhoto(photo as PhotoFrame);
    setIsViewerOpen(true);
  }, []);
  
  // Handle photo edit click
  const handlePhotoEdit = useCallback((photo: Photo) => {
    setViewingPhoto(null);
    setIsViewerOpen(false);
    setEditingPhoto(photo as PhotoFrame);
    setIsEditorOpen(true);
  }, []);
  
  // Handle photo delete request
  const handlePhotoDelete = useCallback((photo: Photo) => {
    setPhotoToDelete(photo);
    setIsDeleteConfirmOpen(true);
  }, []);
  
  // Confirm delete
  const handleConfirmDelete = useCallback(async () => {
    if (!photoToDelete) return;
    
    setIsDeleting(true);
    await deletePhoto(photoToDelete.id);
    setIsDeleting(false);
    setIsDeleteConfirmOpen(false);
    setPhotoToDelete(null);
    
    // Close viewer if deleting the viewed photo
    if (viewingPhoto?.id === photoToDelete.id) {
      setIsViewerOpen(false);
      setViewingPhoto(null);
    }
  }, [photoToDelete, deletePhoto, viewingPhoto]);
  
  // Handle photo favorite toggle
  const handlePhotoFavorite = useCallback((photo: Photo) => {
    toggleFavorite(photo as PhotoFrame);
  }, [toggleFavorite]);
  
  // Handle save from editor
  const handleSavePhoto = useCallback(async (
    data: CreatePhotoInput | UpdatePhotoInput,
    imageUrl?: string
  ) => {
    const wasFirstPhoto = totalCount === 0;
    
    if (editingPhoto) {
      // Update existing photo
      await updatePhoto(editingPhoto.id, data as UpdatePhotoInput);
    } else if (imageUrl) {
      // Create new photo
      const newPhoto = await addPhoto({
        ...data as CreatePhotoInput,
        imageUrl,
      });
      
      // Show confetti for first photo or randomly for others
      if (newPhoto && (wasFirstPhoto || Math.random() > 0.7)) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 100);
      }
    }
    setIsEditorOpen(false);
    setEditingPhoto(null);
  }, [editingPhoto, addPhoto, updatePhoto, totalCount]);
  
  // Handle delete from editor
  const handleDeleteFromEditor = useCallback(async (photoId: string) => {
    await deletePhoto(photoId);
    setIsEditorOpen(false);
    setEditingPhoto(null);
  }, [deletePhoto]);
  
  // Handle editor close
  const handleEditorClose = useCallback(() => {
    setIsEditorOpen(false);
    setEditingPhoto(null);
  }, []);
  
  // Handle logout
  const handleLogout = useCallback(async () => {
    await signOut({ callbackUrl: '/login' });
  }, []);
  
  // Navigate to previous photo in viewer
  const handlePreviousPhoto = useCallback(() => {
    if (!viewingPhoto) return;
    const currentIndex = photos.findIndex(p => p.id === viewingPhoto.id);
    if (currentIndex > 0) {
      setViewingPhoto(photos[currentIndex - 1] as PhotoFrame);
    }
  }, [viewingPhoto, photos]);
  
  // Navigate to next photo in viewer
  const handleNextPhoto = useCallback(() => {
    if (!viewingPhoto) return;
    const currentIndex = photos.findIndex(p => p.id === viewingPhoto.id);
    if (currentIndex < photos.length - 1) {
      setViewingPhoto(photos[currentIndex + 1] as PhotoFrame);
    }
  }, [viewingPhoto, photos]);
  
  // Close viewer
  const handleViewerClose = useCallback(() => {
    setIsViewerOpen(false);
    setViewingPhoto(null);
  }, []);
  
  return (
    <div className="min-h-screen">
      {/* Background */}
      <AnimatedBackground
        type={type}
        url={url}
        gradient={gradient}
        color={color}
        blurIntensity={blurIntensity}
        overlayOpacity={overlayOpacity}
      />
      
      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <GalleryHeader
          userName={userName}
          photoCount={totalCount}
          isSyncing={isPolling}
          onAddPhoto={handleAddPhoto}
          onSettings={() => setIsSettingsOpen(true)}
          onLogout={handleLogout}
          onRefresh={refreshPhotos}
        />
        
        {/* Filters */}
        <GalleryFilters
          filters={filters}
          onFiltersChange={setFilters}
          sortOption={sortOption}
          onSortChange={setSortOption}
          availableTags={allTags}
          totalCount={totalCount}
          filteredCount={filteredCount}
        />
        
        {/* Photo Grid */}
        <GalleryGrid
          photos={photos}
          isLoading={isLoading}
          editable
          onPhotoClick={handlePhotoClick}
          onPhotoEdit={handlePhotoEdit}
          onPhotoDelete={handlePhotoDelete}
          onPhotoFavorite={handlePhotoFavorite}
        />
      </main>
      
      {/* Photo Editor Modal */}
      <PhotoEditorModal
        isOpen={isEditorOpen}
        onClose={handleEditorClose}
        photo={editingPhoto}
        onSave={handleSavePhoto}
        onDelete={handleDeleteFromEditor}
        availableTags={allTags}
      />
      
      {/* Photo Viewer Modal */}
      <PhotoViewerModal
        isOpen={isViewerOpen}
        onClose={handleViewerClose}
        photo={viewingPhoto}
        photos={photos}
        onPrevious={handlePreviousPhoto}
        onNext={handleNextPhoto}
        onEdit={handlePhotoEdit}
        onDelete={handlePhotoDelete}
        onFavorite={handlePhotoFavorite}
      />
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setPhotoToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Photo?"
        message="This action cannot be undone. The photo will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
      
      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      
      {/* Celebration Confetti */}
      <Confetti show={showConfetti} duration={3000} count={60} />
    </div>
  );
}

/**
 * Gallery Page with Auth Guard
 */
export default function GalleryPage() {
  return (
    <AuthGuard>
      <GalleryContent />
    </AuthGuard>
  );
}

