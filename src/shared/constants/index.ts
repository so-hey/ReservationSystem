import { AvailableTime } from '../types';

/**
 * 2週先の月曜日から4週先の日曜日までの日付リストを生成
 */
export const DATE_UNTIL_NEXT_MONTH: string[] = (() => {
  const today = new Date();
  const todayDay = today.getDay(); // 0=日, 1=月, ..., 6=土
  const daysToMonday = todayDay === 0 ? 6 : todayDay - 1;

  // 今週の月曜日
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - daysToMonday);
  currentMonday.setHours(0, 0, 0, 0);

  // 2週先の月曜日（開始）
  const startDate = new Date(currentMonday);
  startDate.setDate(currentMonday.getDate() + 14);

  // 4週先の日曜日（終了）= 今週月曜 + 28日 + 6日
  const endDate = new Date(currentMonday);
  endDate.setDate(currentMonday.getDate() + 34);

  const dates: string[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    dates.push(`${y}-${m}-${d}`);
    current.setDate(current.getDate() + 1);
  }
  return dates;
})();

/**
 * 利用可能な時間テーブル（09:00〜20:00, 30分刻み）
 */
export const TIME_TABLE: AvailableTime[] = Array.from({ length: 22 }, (_, i) => {
  const startHour = 9 + Math.floor((i * 30) / 60);
  const startMinute = (i * 30) % 60;
  const endHour = 9 + Math.floor((i * 30 + 30) / 60);
  const endMinute = (i * 30 + 30) % 60;

  return {
    startTime: `${startHour < 10 ? '0' + startHour : startHour}:${startMinute === 0 ? '00' : '30'}`,
    endTime: `${endHour < 10 ? '0' + endHour : endHour}:${endMinute === 0 ? '00' : '30'}`,
    isAvailable: undefined,
  };
});

/**
 * アプリケーション設定
 */
export const APP_CONFIG = {
  // バックエンドURL
  BACKEND_URL: (import.meta as any).env.VITE_BACKEND_URL || 'http://127.0.0.1:8000',

  // API設定
  API: {
    TIMEOUT: 10000,
    RETRIES: 3,
    RETRY_DELAY: 1000,
  },

  // ページネーション設定
  PAGINATION: {
    ITEMS_PER_PAGE: 10,
  },

  // ローカルストレージキー
  STORAGE_KEYS: {
    AUTH_TOKEN: (import.meta as any).env.VITE_AUTH_TOKEN_KEY || 'admin_auth_token',
  },

  // Gmail 送信アカウント（空の場合はブラウザのデフォルトアカウントを使用）
  GMAIL_SENDER: (import.meta as any).env.VITE_GMAIL_SENDER || '',
} as const;
