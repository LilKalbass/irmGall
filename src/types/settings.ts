/**
 * Settings types for the IRM Gallery application
 */

/**
 * Available theme modes
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Accent color options
 */
export type AccentColor = 'rose' | 'lavender' | 'mint' | 'peach' | 'sky';

/**
 * Background type options
 */
export type BackgroundType = 'video' | 'image' | 'gradient' | 'solid';

/**
 * Preset background option
 */
export interface PresetBackground {
  id: string;
  name: string;
  type: BackgroundType;
  url?: string;
  gradient?: string;
  color?: string;
  thumbnail?: string;
}

/**
 * User settings configuration
 */
export interface UserSettings {
  /** Appearance settings */
  appearance: {
    theme: ThemeMode;
    accentColor: AccentColor;
    fontSize: 'small' | 'medium' | 'large';
    reduceMotion: boolean;
  };
  
  /** Background settings */
  background: {
    type: BackgroundType;
    selectedId?: string;
    customUrl?: string;
    blurIntensity: number; // 0-20
    overlayOpacity: number; // 0-100
  };
  
  /** Gallery display settings */
  gallery: {
    defaultSort: string;
    cardsPerRow: number;
    showDates: boolean;
    showTags: boolean;
  };
}

/**
 * Default settings values
 */
export const DEFAULT_SETTINGS: UserSettings = {
  appearance: {
    theme: 'light',
    accentColor: 'rose',
    fontSize: 'medium',
    reduceMotion: false,
  },
  background: {
    type: 'gradient',
    blurIntensity: 10,
    overlayOpacity: 30,
  },
  gallery: {
    defaultSort: 'dateAdded-desc',
    cardsPerRow: 4,
    showDates: true,
    showTags: true,
  },
};

