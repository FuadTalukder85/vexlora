import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SimilarProductItem } from "@/lib/api/imageSearch";

export interface RecentImageSearch {
  id: string;
  preview: string; // Base64 thumbnail data URL
  timestamp: number;
  resultCount?: number;
}

interface ImageSearchState {
  recentSearches: RecentImageSearch[];
  activeQueryPreview: string | null;
  activeResults: SimilarProductItem[];
  isSearching: boolean;
  uploadProgress: number; // 0 to 100
  searchError: string | null;

  // Actions
  addRecentSearch: (preview: string, resultCount?: number) => void;
  removeRecentSearch: (id: string) => void;
  clearRecentSearches: () => void;
  setActiveSearch: (preview: string, results: SimilarProductItem[]) => void;
  clearActiveSearch: () => void;
  setIsSearching: (isSearching: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setSearchError: (error: string | null) => void;
}

export const useImageSearchStore = create<ImageSearchState>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      activeQueryPreview: null,
      activeResults: [],
      isSearching: false,
      uploadProgress: 0,
      searchError: null,

      addRecentSearch: (preview: string, resultCount?: number) => {
        // Keep max 6 recent searches, avoiding duplicates
        const current = get().recentSearches;
        const newEntry: RecentImageSearch = {
          id: `img_search_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          preview,
          timestamp: Date.now(),
          resultCount,
        };

        const filtered = current.filter((item) => item.preview !== preview);
        const updated = [newEntry, ...filtered].slice(0, 6);

        set({ recentSearches: updated });
      },

      removeRecentSearch: (id: string) => {
        set({
          recentSearches: get().recentSearches.filter((item) => item.id !== id),
        });
      },

      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },

      setActiveSearch: (preview: string, results: SimilarProductItem[]) => {
        set({
          activeQueryPreview: preview,
          activeResults: results,
          searchError: null,
        });
      },

      clearActiveSearch: () => {
        set({
          activeQueryPreview: null,
          activeResults: [],
          searchError: null,
        });
      },

      setIsSearching: (isSearching: boolean) => {
        set({ isSearching });
      },

      setUploadProgress: (uploadProgress: number) => {
        set({ uploadProgress });
      },

      setSearchError: (searchError: string | null) => {
        set({ searchError });
      },
    }),
    {
      name: "vexlora_image_search_v1",
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        activeQueryPreview: state.activeQueryPreview,
        activeResults: state.activeResults,
      }),
    }
  )
);
