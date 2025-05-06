import { create } from "zustand";
import { persist } from "zustand/middleware";

type WizardStore = {
  // États
  mission: string | null;
  missionDetails: string | null;
  location: string | null;
  locationDetails: string | null;

  // Actions
  addMission: (mission: string, details?: string | null) => void;
  addLocation: (location: string, details?: string | null) => void;
  resetWizard: () => void;
};

export const useWizardStore = create<WizardStore>()(
  persist(
    (set) => ({
      mission: null,
      missionDetails: null,
      location: null,
      locationDetails: null,

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
        }),
    }),
    {
      name: "wizard-storage",
    }
  )
);
