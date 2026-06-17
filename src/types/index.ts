export type ExpenseCategory =
  | 'グッズ'
  | 'チケット'
  | '遠征費・交通費'
  | '貯金'
  | 'その他';

/**
 * 支出1件分のデータ構造。
 * 文字列フィールドはすべて JSX の {} 展開のみで描画すること。
 * dangerouslySetInnerHTML への渡し込みは禁止。
 */
export interface Expense {
  id: string;
  date: string;           // "YYYY-MM-DD"（年月の絞り込みにも使用）
  title: string;          // グッズ名・イベント名など
  amount: number;         // 円（整数）
  category: ExpenseCategory;
  receiptNumber?: string; // 任意：注文番号等（完全一致重複防止用）
  memo?: string;          // 任意：メモ（最大100文字）
  createdAt: string;      // ISO文字列（登録順ソート用）
}

export interface MemberColor {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  text: string;
}

export type DuplicateCheckResult =
  | { type: 'none' }
  | { type: 'receiptNumber'; existingTitle: string; receiptNumber: string }
  | { type: 'hash'; amount: number; category: ExpenseCategory; date: string };
