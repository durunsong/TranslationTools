import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CredentialsStore } from "@/types/stores";
import { config } from "@/config/env";

// 状态和方法
export const useCredentialsStore = create<CredentialsStore>()(
  persist(
    (set) => ({
      // 直接使用环境变量中的默认值作为初始状态
      appid: config.defaultCredentials.appid || undefined,
      apiKey: config.defaultCredentials.apiKey || undefined,
      setCredentials: (appid, apiKey) => set({ appid, apiKey }),
    }),
    {
      name: "credentials-storage",
      storage: createJSONStorage(() => localStorage), // 使用 localStorage 作为持久化存储
    }
  )
);
