import { useEffect } from 'react';

/**
 * ページロード時にスムーズにページトップにスクロールするカスタムフック
 * 全ページで統一的にスクロール処理を実行するために使用
 */
export const useScrollToTop = (delay: number = 100) => {
  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    // 少し遅延させてからスクロール（ページレンダリング完了後）
    const timer = setTimeout(scrollToTop, delay);

    return () => clearTimeout(timer);
  }, [delay]);
};
