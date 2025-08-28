import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CredentialsStore } from "@/types/stores";
import { config } from "@/config/env";

// 状态和方法
export const useCredentialsStore = create<CredentialsStore>()(
  persist(
    (set, get) => ({
      appid: undefined,
      apiKey: undefined,
      setCredentials: (appid, apiKey) => set({ appid, apiKey }),
      
      // 初始化默认凭据
      initializeDefaults: () => {
        const current = get();
        // 如果当前没有保存的凭据，且环境变量中有默认值，则自动设置
        if (!current.appid && !current.apiKey && 
            config.defaultCredentials.appid && config.defaultCredentials.apiKey) {
          set({ 
            appid: config.defaultCredentials.appid, 
            apiKey: config.defaultCredentials.apiKey 
          });
        }
      },
    }),
    {
      name: "credentials-storage",
      storage: createJSONStorage(() => localStorage), // 使用 localStorage 作为持久化存储
      onRehydrateStorage: () => (state) => {
        // 在从localStorage恢复数据后，检查是否需要设置默认值
        if (state) {
          state.initializeDefaults?.();
        }
      },
    }
  )
);
