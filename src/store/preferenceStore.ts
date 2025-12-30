/**
 * Preference Store
 * Manages user preference selections using Zustand
 */

import { create } from 'zustand';
import {
  Mood,
  EnergyLevel,
  RuntimePreference,
  ContentType,
  UserPreferences,
} from '../types';

interface PreferenceStore {
  // State
  mood: Mood | null;
  energy: EnergyLevel | null;
  runtime: RuntimePreference | null;
  contentType: ContentType;
  step: number; // 0 = mood, 1 = energy, 2 = runtime

  // Actions
  setMood: (mood: Mood) => void;
  setEnergy: (energy: EnergyLevel) => void;
  setRuntime: (runtime: RuntimePreference) => void;
  setContentType: (contentType: ContentType) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
  getPreferences: () => UserPreferences | null;
  isComplete: () => boolean;
}

const initialState = {
  mood: null as Mood | null,
  energy: null as EnergyLevel | null,
  runtime: null as RuntimePreference | null,
  contentType: 'both' as ContentType,
  step: 0,
};

export const usePreferenceStore = create<PreferenceStore>((set, get) => ({
  ...initialState,

  /**
   * Set mood preference
   */
  setMood: (mood: Mood) => {
    set({ mood });
  },

  /**
   * Set energy level preference
   */
  setEnergy: (energy: EnergyLevel) => {
    set({ energy });
  },

  /**
   * Set runtime preference
   */
  setRuntime: (runtime: RuntimePreference) => {
    set({ runtime });
  },

  /**
   * Set content type preference
   */
  setContentType: (contentType: ContentType) => {
    set({ contentType });
  },

  /**
   * Move to next step
   */
  nextStep: () => {
    set((state) => ({
      step: Math.min(state.step + 1, 2),
    }));
  },

  /**
   * Move to previous step
   */
  prevStep: () => {
    set((state) => ({
      step: Math.max(state.step - 1, 0),
    }));
  },

  /**
   * Go to specific step
   */
  goToStep: (step: number) => {
    set({ step: Math.max(0, Math.min(step, 2)) });
  },

  /**
   * Reset preferences to initial state
   */
  reset: () => {
    set(initialState);
  },

  /**
   * Get complete preferences object or null if incomplete
   */
  getPreferences: (): UserPreferences | null => {
    const { mood, energy, runtime, contentType } = get();

    if (!mood || !energy || !runtime) {
      return null;
    }

    return {
      mood,
      energy,
      runtime,
      contentType,
    };
  },

  /**
   * Check if all preferences are selected
   */
  isComplete: (): boolean => {
    const { mood, energy, runtime } = get();
    return mood !== null && energy !== null && runtime !== null;
  },
}));
