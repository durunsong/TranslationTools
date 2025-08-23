import { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button } from 'antd';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * 错误边界组件
 * 用于捕获子组件中的JavaScript错误，记录错误并显示备用UI
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * 当子组件抛出错误时调用
   */
  static getDerivedStateFromError(error: Error): State {
    // 更新state，下次渲染将显示错误UI
    return { hasError: true, error };
  }

  /**
   * 当子组件抛出错误时调用，用于记录错误信息
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误信息到控制台（生产环境可以发送到错误监控服务）
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  /**
   * 重置错误状态
   */
  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // 如果有自定义的fallback UI，则使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认的错误UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full">
            <Result
              status="error"
              title="页面出现错误"
              subTitle="抱歉，页面遇到了一些问题。您可以尝试刷新页面或联系技术支持。"
              extra={[
                <Button type="primary" key="refresh" onClick={this.handleReset}>
                  重试
                </Button>,
                <Button key="reload" onClick={() => window.location.reload()}>
                  刷新页面
                </Button>,
              ]}
            />
            
            {/* 开发环境显示详细错误信息 */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <summary className="cursor-pointer font-medium text-red-800 dark:text-red-200">
                  错误详情 (仅开发环境显示)
                </summary>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p><strong>错误信息:</strong> {this.state.error.message}</p>
                  <p><strong>错误堆栈:</strong></p>
                  <pre className="whitespace-pre-wrap text-xs bg-red-100 dark:bg-red-900/40 p-2 rounded mt-1">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <>
                      <p><strong>组件堆栈:</strong></p>
                      <pre className="whitespace-pre-wrap text-xs bg-red-100 dark:bg-red-900/40 p-2 rounded mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
