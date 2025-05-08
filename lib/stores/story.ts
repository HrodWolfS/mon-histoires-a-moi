"use client";
import { StorySection } from "@/lib/hooks/useStoryGenerator";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type StoryStore = {
  story: StorySection[] | null;
  currentPage: number;
  setStory: (s: StorySection[]) => void;
  resetStory: () => void;
  setCurrentPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
};

export const useStoryStore = create<StoryStore>()(
  persist(
    (set, get) => ({
      story: null,
      currentPage: 0,
      setStory: (s) => set({ story: s, currentPage: 0 }),
      resetStory: () => set({ story: null, currentPage: 0 }),
      setCurrentPage: (page) => set({ currentPage: page }),
      nextPage: () => {
        const { currentPage, story } = get();
        if (story && currentPage < story.length - 1) {
          set({ currentPage: currentPage + 1 });
        }
      },
      prevPage: () => {
        const { currentPage } = get();
        if (currentPage > 0) {
          set({ currentPage: currentPage - 1 });
        }
      },
    }),
    {
      name: "story-storage",
    }
  )
);
