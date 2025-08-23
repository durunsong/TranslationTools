/**
 * 性能监控工具
 * 用于监控应用性能指标
 */

/**
 * 内存信息接口
 */
interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

/**
 * 扩展的Performance接口
 */
interface PerformanceWithMemory extends Performance {
  memory: MemoryInfo;
}

/**
 * 性能指标接口
 */
interface PerformanceMetrics {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

/**
 * 性能监控类
 */
export class PerformanceMonitor {
  private static metrics: Map<string, PerformanceMetrics> = new Map();

  /**
   * 开始性能监控
   * @param name 监控名称
   */
  static start(name: string): void {
    if (process.env.NODE_ENV === 'development') {
      this.metrics.set(name, {
        name,
        startTime: performance.now(),
      });
    }
  }

  /**
   * 结束性能监控
   * @param name 监控名称
   * @returns 持续时间（毫秒）
   */
  static end(name: string): number | undefined {
    if (process.env.NODE_ENV === 'development') {
      const metric = this.metrics.get(name);
      if (metric) {
        const endTime = performance.now();
        const duration = endTime - metric.startTime;
        
        metric.endTime = endTime;
        metric.duration = duration;
        
        console.log(`⏱️ Performance [${name}]: ${duration.toFixed(2)}ms`);
        return duration;
      }
    }
    return undefined;
  }

  /**
   * 获取所有性能指标
   * @returns 性能指标数组
   */
  static getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values());
  }

  /**
   * 清空性能指标
   */
  static clear(): void {
    this.metrics.clear();
  }

  /**
   * 测量函数执行时间
   * @param name 监控名称
   * @param fn 要测量的函数
   * @returns 函数执行结果
   */
  static async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name);
    try {
      const result = await fn();
      return result;
    } finally {
      this.end(name);
    }
  }

  /**
   * 测量同步函数执行时间
   * @param name 监控名称
   * @param fn 要测量的函数
   * @returns 函数执行结果
   */
  static measureSync<T>(name: string, fn: () => T): T {
    this.start(name);
    try {
      const result = fn();
      return result;
    } finally {
      this.end(name);
    }
  }
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 限制时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 内存使用情况监控
 * 仅在开发环境中工作
 */
export function logMemoryUsage(): void {
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memory = (performance as PerformanceWithMemory).memory;
    console.log('🧠 Memory Usage:', {
      used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
      total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`,
      usage: `${Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)}%`,
    });
  }
}

/**
 * 安全计算时间差
 * @param end 结束时间
 * @param start 开始时间
 * @returns 时间差（毫秒），如果无效则返回 0
 */
function safeTimeDiff(end: number, start: number): number {
  if (!end || !start || end < start) {
    return 0;
  }
  const diff = end - start;
  return isNaN(diff) ? 0 : Math.round(diff * 100) / 100; // 保留两位小数
}

/**
 * 页面加载性能监控
 */
export function logPageLoadPerformance(): void {
  if (process.env.NODE_ENV === 'development') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        try {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          if (!navigation) {
            console.warn('📊 Performance API not supported or navigation timing not available');
            return;
          }

          const performanceData = {
            'DNS查询': `${safeTimeDiff(navigation.domainLookupEnd, navigation.domainLookupStart)}ms`,
            'TCP连接': `${safeTimeDiff(navigation.connectEnd, navigation.connectStart)}ms`,
            'SSL握手': `${safeTimeDiff(navigation.connectEnd, navigation.secureConnectionStart)}ms`,
            '请求响应': `${safeTimeDiff(navigation.responseEnd, navigation.requestStart)}ms`,
            'DOM解析': `${safeTimeDiff(navigation.domContentLoadedEventEnd, navigation.domContentLoadedEventStart)}ms`,
            '资源加载': `${safeTimeDiff(navigation.loadEventEnd, navigation.loadEventStart)}ms`,
            '首字节时间(TTFB)': `${safeTimeDiff(navigation.responseStart, navigation.fetchStart)}ms`,
            'DOM准备时间': `${safeTimeDiff(navigation.domContentLoadedEventStart, navigation.fetchStart)}ms`,
            '页面完全加载': `${safeTimeDiff(navigation.loadEventEnd, navigation.fetchStart)}ms`,
          };

          console.log('📊 Page Load Performance:', performanceData);

          // 额外的性能指标
          if ('memory' in performance) {
            const memory = (performance as PerformanceWithMemory).memory;
            console.log('🧠 Memory Usage:', {
              used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
              total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
              limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`,
            });
          }

          // Core Web Vitals (如果支持)
          if ('getEntriesByType' in performance) {
            const paintEntries = performance.getEntriesByType('paint');
            paintEntries.forEach((entry) => {
              console.log(`🎨 ${entry.name}: ${Math.round(entry.startTime)}ms`);
            });
          }

        } catch (error) {
          console.error('📊 Performance monitoring error:', error);
        }
      }, 100); 
    });
  }
}

export default PerformanceMonitor;
