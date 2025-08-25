import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { LanguageStore } from "@/types/stores";
import i18n from "@/i18n";

// 语言状态和方法
export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "zh", // 默认语言为中文
      setLanguage: (language) => {
        set({ language });
        // 同步更新 i18n 语言
        i18n.changeLanguage(language);
      },
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => localStorage), // 持久化存储
    }
  )
);
