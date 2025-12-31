/**
 * Unit tests for Preference Store
 */

import { renderHook, act } from '@testing-library/react-native';
import { usePreferenceStore } from './preferenceStore';

describe('Preference Store', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => usePreferenceStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => usePreferenceStore());

      expect(result.current.mood).toBeNull();
      expect(result.current.energy).toBeNull();
      expect(result.current.runtime).toBeNull();
      expect(result.current.contentType).toBe('both');
      expect(result.current.step).toBe(0);
    });
  });

  describe('setMood', () => {
    it('should set mood preference', () => {
      const { result } = renderHook(() => usePreferenceStore());

      act(() => {
        result.current.setMood('happy');
      });

      expect(result.current.mood).toBe('happy');
    });

    it('should update mood preference', () => {
      const { result } = renderHook(() => usePreferenceStore());

      act(() => {
        result.current.setMood('happy');
      });

      expect(result.current.mood).toBe('happy');

      act(() => {
        result.current.setMood('scary');
      });

      expect(result.current.mood).toBe('scary');
    });
  });

  describe('setEnergy', () => {
    it('should set energy level preference', () => {
      const { result } = renderHook(() => usePreferenceStore());

      act(() => {
        result.current.setEnergy('intense');
      });

      expect(result.current.energy).toBe('intense');
    });

    it('should update energy level preference', () => {
      const { result } = renderHook(() => usePreferenceStore());

      act(() => {
        result.current.setEnergy('chill');
      });

      expect(result.current.energy).toBe('chill');

      act(() => {
        result.current.setEnergy('moderate');
      });

      expect(result.current.energy).toBe('moderate');
    });
  });

  describe('setRuntime', () => {
    it('should set runtime preference', () => {
      const { result } = renderHook(() => usePreferenceStore());

      act(() => {
        result.current.setRuntime('short');
      });

      expect(result.current.runtime).toBe('short');
    });

    it('should update runtime preference', () => {
      const { result } = renderHook(() => usePreferenceStore());

      act(() => {
        result.current.setRuntime('long');
      });

      expect(result.current.runtime).toBe('long');

      act(() => {
        result.current.setRuntime('medium');
      });

      expect(result.current.runtime).toBe('medium');
    });
  });

  describe('setContentType', () => {
    it('should set content type preference', () => {
      const { result } = renderHook(() => usePreferenceStore());

      act(() => {
        result.current.setContentType('movie');
      });

      expect(result.current.contentType).toBe('movie');
    });

    it('should update content type preference', () => {
      const { result } = renderHook(() => usePreferenceStore());

      act(() => {
        result.current.setContentType('tv');
      });

      expect(result.current.contentType).toBe('tv');

      act(() => {
        result.current.setContentType('both');
      });

      expect(result.current.contentType).toBe('both');
    });
  });

  describe('Step Navigation', () => {
    describe('nextStep', () => {
      it('should move to next step', () => {
        const { result } = renderHook(() => usePreferenceStore());

        expect(result.current.step).toBe(0);

        act(() => {
          result.current.nextStep();
        });

        expect(result.current.step).toBe(1);
      });

      it('should not exceed maximum step', () => {
        const { result } = renderHook(() => usePreferenceStore());

        act(() => {
          result.current.nextStep();
          result.current.nextStep();
          result.current.nextStep();
          result.current.nextStep();
        });

        expect(result.current.step).toBe(2);
      });
    });

    describe('prevStep', () => {
      it('should move to previous step', () => {
        const { result } = renderHook(() => usePreferenceStore());

        act(() => {
          result.current.goToStep(2);
        });

        expect(result.current.step).toBe(2);

        act(() => {
          result.current.prevStep();
        });

        expect(result.current.step).toBe(1);
      });

      it('should not go below minimum step', () => {
        const { result } = renderHook(() => usePreferenceStore());

        act(() => {
          result.current.prevStep();
          result.current.prevStep();
        });

        expect(result.current.step).toBe(0);
      });
    });

    describe('goToStep', () => {
      it('should go to specific step', () => {
        const { result } = renderHook(() => usePreferenceStore());

        act(() => {
          result.current.goToStep(1);
        });

        expect(result.current.step).toBe(1);

        act(() => {
          result.current.goToStep(2);
        });

        expect(result.current.step).toBe(2);
      });

      it('should clamp step to valid range', () => {
        const { result } = renderHook(() => usePreferenceStore());

        act(() => {
          result.current.goToStep(-1);
        });

        expect(result.current.step).toBe(0);

        act(() => {
          result.current.goToStep(10);
        });

        expect(result.current.step).toBe(2);
      });
    });
  });

  describe('getPreferences', () => {
    it('should return null when preferences are incomplete', () => {
      const { result } = renderHook(() => usePreferenceStore());

      expect(result.current.getPreferences()).toBeNull();

      act(() => {
        result.current.setMood('happy');
      });

      expect(result.current.getPreferences()).toBeNull();

      act(() => {
        result.current.setEnergy('chill');
      });

      expect(result.current.getPreferences()).toBeNull();
    });

    it('should return complete preferences object when all selections made', () => {
      const { result } = renderHook(() => usePreferenceStore());

      act(() => {
        result.current.setMood('happy');
        result.current.setEnergy('chill');
        result.current.setRuntime('short');
        result.current.setContentType('movie');
      });

      const preferences = result.current.getPreferences();

      expect(preferences).toEqual({
        mood: 'happy',
        energy: 'chill',
        runtime: 'short',
        contentType: 'movie',
      });
    });

    it('should use default contentType if not explicitly set', () => {
      const { result } = renderHook(() => usePreferenceStore());

      act(() => {
        result.current.setMood('thrilling');
        result.current.setEnergy('intense');
        result.current.setRuntime('long');
      });

      const preferences = result.current.getPreferences();

      expect(preferences?.contentType).toBe('both');
    });
  });

  describe('isComplete', () => {
    it('should return false when preferences are incomplete', () => {
      const { result } = renderHook(() => usePreferenceStore());

      expect(result.current.isComplete()).toBe(false);

      act(() => {
        result.current.setMood('happy');
      });

      expect(result.current.isComplete()).toBe(false);

      act(() => {
        result.current.setEnergy('chill');
      });

      expect(result.current.isComplete()).toBe(false);
    });

    it('should return true when all required preferences are set', () => {
      const { result } = renderHook(() => usePreferenceStore());

      act(() => {
        result.current.setMood('happy');
        result.current.setEnergy('chill');
        result.current.setRuntime('short');
      });

      expect(result.current.isComplete()).toBe(true);
    });

    it('should not require contentType for completion', () => {
      const { result } = renderHook(() => usePreferenceStore());

      act(() => {
        result.current.setMood('romantic');
        result.current.setEnergy('moderate');
        result.current.setRuntime('medium');
      });

      expect(result.current.isComplete()).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset all preferences to initial state', () => {
      const { result } = renderHook(() => usePreferenceStore());

      act(() => {
        result.current.setMood('happy');
        result.current.setEnergy('intense');
        result.current.setRuntime('long');
        result.current.setContentType('movie');
        result.current.nextStep();
        result.current.nextStep();
      });

      expect(result.current.isComplete()).toBe(true);
      expect(result.current.step).toBe(2);

      act(() => {
        result.current.reset();
      });

      expect(result.current.mood).toBeNull();
      expect(result.current.energy).toBeNull();
      expect(result.current.runtime).toBeNull();
      expect(result.current.contentType).toBe('both');
      expect(result.current.step).toBe(0);
      expect(result.current.isComplete()).toBe(false);
    });
  });

  describe('Full Preference Flow', () => {
    it('should handle complete preference selection flow', () => {
      const { result } = renderHook(() => usePreferenceStore());

      // Step 0: Select mood
      expect(result.current.step).toBe(0);
      act(() => {
        result.current.setMood('funny');
        result.current.nextStep();
      });

      // Step 1: Select energy
      expect(result.current.step).toBe(1);
      act(() => {
        result.current.setEnergy('moderate');
        result.current.nextStep();
      });

      // Step 2: Select runtime
      expect(result.current.step).toBe(2);
      act(() => {
        result.current.setRuntime('medium');
        result.current.setContentType('tv');
      });

      expect(result.current.isComplete()).toBe(true);

      const preferences = result.current.getPreferences();
      expect(preferences).toEqual({
        mood: 'funny',
        energy: 'moderate',
        runtime: 'medium',
        contentType: 'tv',
      });
    });

    it('should allow going back and changing selections', () => {
      const { result } = renderHook(() => usePreferenceStore());

      act(() => {
        result.current.setMood('scary');
        result.current.nextStep();
        result.current.setEnergy('intense');
        result.current.nextStep();
        result.current.setRuntime('long');
      });

      expect(result.current.getPreferences()?.mood).toBe('scary');

      // Go back to step 0 and change mood
      act(() => {
        result.current.goToStep(0);
        result.current.setMood('funny');
      });

      expect(result.current.getPreferences()?.mood).toBe('funny');
      expect(result.current.getPreferences()?.energy).toBe('intense');
    });
  });
});
