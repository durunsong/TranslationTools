/**
 * 环境配置
 * 统一管理应用的环境变量和配置
 */

/**
 * 应用配置接口
 */
interface AppConfig {
  // 应用信息
  name: string;
  version: string;
  
  // 环境信息
  isDevelopment: boolean;
  isProduction: boolean;
  
  // API配置
  api: {
    baiduTranslateUrl: string;
    proxyApiUrl: string;
    timeout: number;
    maxRetries: number;
  };
  
  // 默认凭据配置
  defaultCredentials: {
    appid: string;
    apiKey: string;
  };
  
  // 功能开关
  features: {
    enablePerformanceMonitoring: boolean;
    enableErrorReporting: boolean;
    enableDebugMode: boolean;
  };
  
  // 限制配置
  limits: {
    maxTextLength: number;
    maxFileSize: number;
    requestTimeout: number;
  };
}

/**
 * 获取应用配置
 */
export const config: AppConfig = {
  name: 'TranslationTools',
  version: '1.0.0',
  
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  api: {
    baiduTranslateUrl: 'https://api.fanyi.baidu.com/api/trans/vip/translate',
    proxyApiUrl: import.meta.env.VITE_PROXY_API_URL || 'http://localhost:4500/api/translation/translate',
    timeout: 10000, // 10秒
    maxRetries: 3,
  },
  
  defaultCredentials: {
    appid: import.meta.env.VITE_DEFAULT_APPID || '',
    apiKey: import.meta.env.VITE_DEFAULT_API_KEY || '',
  },
  
  features: {
    enablePerformanceMonitoring: import.meta.env.DEV,
    enableErrorReporting: import.meta.env.PROD,
    enableDebugMode: import.meta.env.DEV,
  },
  
  limits: {
    maxTextLength: 6000, // 百度翻译API限制
    maxFileSize: 1024 * 1024, // 1MB
    requestTimeout: 10000, // 10秒
  },
};

/**
 * 获取环境变量
 * @param key 环境变量键名
 * @param defaultValue 默认值
 * @returns 环境变量值
 */
export function getEnvVar(key: string, defaultValue?: string): string | undefined {
  return import.meta.env[key] || defaultValue;
}

/**
 * 检查是否为开发环境
 */
export const isDev = config.isDevelopment;

/**
 * 检查是否为生产环境
 */
export const isProd = config.isProduction;

/**
 * 日志工具
 */
export const logger = {
  debug: (...args: unknown[]) => {
    if (config.features.enableDebugMode) {
      console.log('🐛 [DEBUG]', ...args);
    }
  },
  
  info: (...args: unknown[]) => {
    if (config.features.enableDebugMode) {
      console.info('ℹ️ [INFO]', ...args);
    }
  },
  
  warn: (...args: unknown[]) => {
    console.warn('⚠️ [WARN]', ...args);
  },
  
  error: (...args: unknown[]) => {
    console.error('❌ [ERROR]', ...args);
  },
};

export default config;
