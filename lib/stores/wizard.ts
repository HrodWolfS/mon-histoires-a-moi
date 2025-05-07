import { create } from "zustand";
import { persist } from "zustand/middleware";

type WizardStore = {
  // États
  mission: string | null;
  missionDetails: string | null;
  location: string | null;
  locationDetails: string | null;
  morale: string | null;

  // Actions
  addMission: (mission: string, details?: string | null) => void;
  addLocation: (location: string, details?: string | null) => void;
  resetWizard: () => void;
  setMorale: (value: string | null) => void;
};

export const useWizardStore = create<WizardStore>()(
  persist(
    (set) => ({
      mission: null,
      missionDetails: null,
      location: null,
      locationDetails: null,
      morale: null,

      addMission: (mission, details = null) =>
        set({ mission, missionDetails: details }),

      addLocation: (location, details = null) =>
        set({ location, locationDetails: details }),

      resetWizard: () =>
        set({
          mission: null,
          missionDetails: null,
          location: null,
          locationDetails: null,
          morale: null,
        }),

      setMorale: (morale) => set({ morale }),
    }),
    {
      name: "wizard-storage",
    }
  )
);
