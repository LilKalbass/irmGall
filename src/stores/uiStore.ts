import { create } from 'zustand';

/**
 * UI store state interface
 */
interface UIState {
  /** Whether photo editor modal is open */
  isEditorOpen: boolean;
  /** Whether uploader modal is open */
  isUploaderOpen: boolean;
  /** Whether settings panel is open */
  isSettingsOpen: boolean;
  /** Whether delete confirmation is open */
  isDeleteConfirmOpen: boolean;
  /** ID of photo to delete */
  photoToDelete: string | null;
  /** Whether the app is in dark mode */
  isDarkMode: boolean;
  /** Whether to reduce motion */
  reduceMotion: boolean;
}

/**
 * UI store actions interface
 */
interface UIActions {
  /** Open photo editor modal */
  openEditor: () => void;
  /** Close photo editor modal */
  closeEditor: () => void;
  /** Toggle photo editor modal */
  toggleEditor: () => void;
  /** Open uploader modal */
  openUploader: () => void;
  /** Close uploader modal */
  closeUploader: () => void;
  /** Open settings panel */
  openSettings: () => void;
  /** Close settings panel */
  closeSettings: () => void;
  /** Toggle settings panel */
  toggleSettings: () => void;
  /** Open delete confirmation */
  openDeleteConfirm: (photoId: string) => void;
  /** Close delete confirmation */
  closeDeleteConfirm: () => void;
  /** Set dark mode */
  setDarkMode: (isDark: boolean) => void;
  /** Toggle dark mode */
  toggleDarkMode: () => void;
  /** Set reduce motion */
  setReduceMotion: (reduce: boolean) => void;
  /** Close all modals */
  closeAllModals: () => void;
}

/**
 * Combined UI store type
 */
type UIStore = UIState & UIActions;

/**
 * UI store with Zustand
 * 
 * Manages all UI-related state like modals, panels, and preferences.
 */
export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  isEditorOpen: false,
  isUploaderOpen: false,
  isSettingsOpen: false,
  isDeleteConfirmOpen: false,
  photoToDelete: null,
  isDarkMode: false,
  reduceMotion: false,
  
  // Actions
  openEditor: () => set({ isEditorOpen: true }),
  closeEditor: () => set({ isEditorOpen: false }),
  toggleEditor: () => set((state) => ({ isEditorOpen: !state.isEditorOpen })),
  
  openUploader: () => set({ isUploaderOpen: true }),
  closeUploader: () => set({ isUploaderOpen: false }),
  
  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),
  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
  
  openDeleteConfirm: (photoId) => set({ 
    isDeleteConfirmOpen: true, 
    photoToDelete: photoId 
  }),
  closeDeleteConfirm: () => set({ 
    isDeleteConfirmOpen: false, 
    photoToDelete: null 
  }),
  
  setDarkMode: (isDarkMode) => {
    set({ isDarkMode });
    // Update document class for Tailwind dark mode
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
  },
  toggleDarkMode: () => set((state) => {
    const isDarkMode = !state.isDarkMode;
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
    return { isDarkMode };
  }),
  
  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
  
  closeAllModals: () => set({
    isEditorOpen: false,
    isUploaderOpen: false,
    isSettingsOpen: false,
    isDeleteConfirmOpen: false,
    photoToDelete: null,
  }),
}));

export default useUIStore;

