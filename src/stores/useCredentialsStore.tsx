import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CredentialsStore } from "@/types/stores";

// 定义状态和方法
export const useCredentialsStore = create<CredentialsStore>()(
  persist(
    (set) => ({
      appid: undefined,
      apiKey: undefined,
      setCredentials: (appid, apiKey) => set({ appid, apiKey }),
    }),
    {
      name: "credentials-storage",
      storage: createJSONStorage(() => localStorage), // 使用 localStorage 作为持久化存储
    }
  )
);
