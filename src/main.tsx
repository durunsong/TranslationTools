import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/assets/css/index.css'
import './i18n' // 导入国际化配置
import App from './App.tsx'
import { logPageLoadPerformance } from './utils/performance'
import { config } from './config/env'

// 初始化性能监控
if (config.features.enablePerformanceMonitoring) {
  logPageLoadPerformance();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
