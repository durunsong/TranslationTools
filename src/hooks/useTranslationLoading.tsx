import { useState, useCallback, useEffect } from 'react';

interface UseTranslationLoadingReturn {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

// 创建一个全局单例模式的状态
let isGlobalLoading = false;
const listeners: Set<(loading: boolean) => void> = new Set();

/**
 * 用于管理翻译过程中的全局loading状态
 * 使用单例模式确保所有组件共享同一个loading状态
 * @returns 包含loading状态和控制方法的对象
 */
export function useTranslationLoading(): UseTranslationLoadingReturn {
  const [isLoading, setIsLoading] = useState<boolean>(isGlobalLoading);

  // 组件挂载时添加监听器，卸载时移除
  useEffect(() => {
    const updateState = (loading: boolean) => {
      setIsLoading(loading);
    };
    
    listeners.add(updateState);
    
    // 清理函数：组件卸载时移除监听器
    return () => {
      listeners.delete(updateState);
    };
  }, []);

  // 开始加载
  const startLoading = useCallback(() => {
    if (!isGlobalLoading) {
      isGlobalLoading = true;
      listeners.forEach(listener => listener(true));
    }
  }, []);

  // 停止加载
  const stopLoading = useCallback(() => {
    if (isGlobalLoading) {
      isGlobalLoading = false;
      listeners.forEach(listener => listener(false));
    }
  }, []);

  return { isLoading, startLoading, stopLoading };
} 