/**
 * localStorage への安全なアクセスラッパー。
 *
 * 以下の3ケースを吸収する：
 * - SSR（window が未定義）でのクラッシュ
 * - QuotaExceededError（容量超過）
 * - その他の予期しない例外
 */
export const safeStorage = {
  get(key: string): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // QuotaExceededError: 容量超過時はサイレントに失敗
      console.warn('[safeStorage] setItem failed:', e);
    }
  },
};
