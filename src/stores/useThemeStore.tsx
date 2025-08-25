import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ThemeStore } from "@/types/stores";

// 状态和方法
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      themeMode: "light",
      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    {
      name: "theme-mode-storage",
      storage: createJSONStorage(() => localStorage), // 持久化存储
    }
  )
);
