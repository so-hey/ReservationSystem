import { APP_CONFIG } from '../constants';

/**
 * API リクエスト用の設定インターフェース
 */
export interface ApiConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

/**
 * デフォルト API 設定
 */
const DEFAULT_CONFIG: Required<ApiConfig> = {
  timeout: 10000, // 10秒
  retries: 3,
  retryDelay: 1000, // 1秒
};

/**
 * API エラークラス
 */
export class ApiError extends Error {
  constructor(message: string, public status?: number, public response?: Response) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * タイムアウト付きfetch
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number,
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

/**
 * リトライ機能付きAPI呼び出し
 */
export const apiRequest = async (
  url: string,
  options: RequestInit = {},
  config: ApiConfig = {},
): Promise<Response> => {
  const { timeout, retries, retryDelay } = { ...DEFAULT_CONFIG, ...config };

  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options, timeout);

      // 401エラー（認証エラー）の場合は自動ログアウト
      if (response.status === 401) {
        localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
        throw new ApiError('認証が無効です。再度ログインしてください。', 401, response);
      }

      return response;
    } catch (error) {
      lastError = error as Error;

      // 最後の試行の場合はエラーをそのまま投げる
      if (attempt === retries) {
        if (error instanceof ApiError) {
          throw error;
        }
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        throw new ApiError(`API request failed: ${errorMessage}`);
      }

      // リトライ前の待機
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  throw lastError!;
};

/**
 * 認証ヘッダー付きのAPIリクエスト
 */
export const authenticatedApiRequest = async (
  url: string,
  options: RequestInit = {},
  config: ApiConfig = {},
): Promise<Response> => {
  const authToken = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
  }

  return apiRequest(url, { ...options, headers }, config);
};
