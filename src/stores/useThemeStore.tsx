import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ThemeStore } from "@/types/stores";

// 定义状态和方法
export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      themeMode: "light", // 默认主题模式
      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    {
      name: "theme-mode-storage",
      storage: createJSONStorage(() => localStorage), // 持久化存储
    }
  )
);
