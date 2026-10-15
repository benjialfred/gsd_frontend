import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingData {
  gender?: string;
  birth_date?: string;
  country_code?: string;
  city?: string;
  location_visibility?: string;
  profession?: string;
  education_level?: string;
  denomination?: string;
  church_attendance?: string;
  spiritual_commitment?: string;
  languages?: number[];
  interests?: number[];
  sports?: number[];
  hobbies?: number[];
  marriage_objectives?: string;
  marriage_expectations?: string;
  pref_age_min?: number;
  pref_age_max?: number;
  pref_distance?: number;
}

interface OnboardingStore {
  currentStep: number;
  highestStepReached: number;
  formData: OnboardingData;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      highestStepReached: 1,
      formData: {},
      setStep: (step) => set((state) => ({ 
        currentStep: step,
        highestStepReached: Math.max(state.highestStepReached, step)
      })),
      nextStep: () => set((state) => {
        const next = state.currentStep + 1;
        return {
          currentStep: next,
          highestStepReached: Math.max(state.highestStepReached, next)
        };
      }),
      prevStep: () => set((state) => ({ 
        currentStep: Math.max(1, state.currentStep - 1) 
      })),
      updateFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
      })),
      resetOnboarding: () => set({ currentStep: 1, highestStepReached: 1, formData: {} })
    }),
    {
      name: 'gsd-onboarding-storage', // saves to localStorage so users don't lose progress if they refresh
    }
  )
);
