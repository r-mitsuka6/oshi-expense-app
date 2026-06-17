export const TIMINGS = {
  /** 支出登録後、一覧タブへ自動遷移するまでの待機時間 (ms) */
  AFTER_SUBMIT_REDIRECT_MS: 800,
  /** 削除確認状態が自動リセットされるまでの時間 (ms) */
  DELETE_CONFIRM_RESET_MS: 3000,
  /** 登録成功フィードバックの表示時間 (ms) */
  SUCCESS_FEEDBACK_MS: 2000,
} as const;
