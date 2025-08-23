import jsonp from 'jsonp';
import MD5 from 'md5';
import { config, logger } from '@/config/env';
import PerformanceMonitor from '@/utils/performance';

/**
 * 翻译API响应接口
 */
export interface TranslationResponse {
  from: string;
  to: string;
  trans_result: Array<{
    src: string;
    dst: string;
  }>;
  error_code?: string;
  error_msg?: string;
}

/**
 * 翻译请求参数接口
 */
export interface TranslationParams {
  query: string;
  from: string;
  to: string;
  appid: string;
  apiKey: string;
}

/**
 * 翻译服务类
 * 封装百度翻译API调用逻辑
 */
export class TranslationService {
  private static readonly API_URL = config.api.baiduTranslateUrl;
  
  /**
   * 生成签名
   * @param appid 应用ID
   * @param query 查询字符串
   * @param salt 随机数
   * @param apiKey API密钥
   * @returns 签名字符串
   */
  private static generateSign(appid: string, query: string, salt: string, apiKey: string): string {
    return MD5(appid + query + salt + apiKey).toString();
  }

  /**
   * 构建请求URL
   * @param params 翻译参数
   * @returns 完整的请求URL
   */
  private static buildRequestUrl(params: TranslationParams): string {
    const salt = Date.now().toString();
    const sign = this.generateSign(params.appid, params.query, salt, params.apiKey);
    
    const urlParams = new URLSearchParams({
      q: params.query,
      appid: params.appid,
      salt,
      from: params.from,
      to: params.to,
      sign,
    });

    return `${this.API_URL}?${urlParams.toString()}`;
  }

  /**
   * 执行翻译请求
   * @param params 翻译参数
   * @returns Promise<string> 翻译结果
   */
  static async translate(params: TranslationParams): Promise<string> {
    return PerformanceMonitor.measure('translation-request', async () => {
      return new Promise((resolve, reject) => {
        const url = this.buildRequestUrl(params);
        
        logger.debug('发起翻译请求:', { from: params.from, to: params.to, queryLength: params.query.length });
        
        jsonp(url, { 
          param: 'callback', 
          timeout: config.api.timeout 
        }, (err, data: TranslationResponse) => {
          if (err) {
            logger.error('翻译请求失败:', err);
            reject(new Error(`网络请求失败: ${err.message}`));
            return;
          }

          // 检查API返回的错误
          if (data.error_code) {
            const errorMessage = this.getErrorMessage(data.error_code);
            logger.error('翻译API错误:', { code: data.error_code, message: errorMessage });
            reject(new Error(errorMessage));
            return;
          }

          // 检查翻译结果
          if (!data.trans_result || data.trans_result.length === 0) {
            logger.error('翻译结果为空:', data);
            reject(new Error('翻译结果为空'));
            return;
          }

          // 合并翻译结果
          const result = data.trans_result
            .map(item => item.dst)
            .join('\n');
          
          logger.debug('翻译成功:', { resultLength: result.length });
          resolve(result);
        });
      });
    });
  }

  /**
   * 获取错误信息
   * @param errorCode 错误代码
   * @returns 错误信息
   */
  private static getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      '52001': 'APP ID 不存在，请检查您的 APP ID 是否正确',
      '52002': '签名错误，请检查您的密钥是否正确',
      '52003': '访问频率受限，请降低请求频率',
      '52004': '账户余额不足，请及时充值',
      '52005': '长query请求频繁，请降低长query的发送频率',
      '54000': '必填参数为空，请检查是否少传参数',
      '54001': '签名错误，请检查您的签名生成方法',
      '54003': '访问频率受限，请降低您的调用频率',
      '54004': '账户余额不足，请前往管理控制台为账户充值',
      '54005': '长query请求频繁，请降低长query的发送频率',
      '58000': '客户端IP非法，检查个人资料里填写的IP地址是否正确',
      '58001': '译文语言方向不支持，检查译文语言是否在语言列表里',
      '58002': '服务当前已关闭，请前往管理控制台开启服务',
      '90107': '认证未通过或未生效，请前往我的认证查看认证进度',
    };

    return errorMessages[errorCode] || `翻译服务错误 (错误码: ${errorCode})`;
  }

  /**
   * 验证翻译参数
   * @param params 翻译参数
   * @returns 验证结果
   */
  static validateParams(params: Partial<TranslationParams>): { isValid: boolean; message?: string } {
    if (!params.appid || !params.apiKey) {
      return { isValid: false, message: '请先配置 APP ID 和 API Key' };
    }

    if (!params.query || !params.query.trim()) {
      return { isValid: false, message: '请输入需要翻译的内容' };
    }

    if (params.query.length > config.limits.maxTextLength) {
      return { isValid: false, message: `翻译内容过长，请控制在${config.limits.maxTextLength}字符以内` };
    }

    if (!params.from || !params.to) {
      return { isValid: false, message: '请选择源语言和目标语言' };
    }

    return { isValid: true };
  }
}

export default TranslationService;
