'use client';

import { useState, memo } from 'react';
import { useOshiTheme } from '@/context/ThemeContext';
import { Expense, ExpenseCategory } from '@/types';
import { CATEGORY_ORDER } from '@/hooks/useExpenses';

type SummaryMode = 'month' | 'year';

interface CategorySummaryProps {
  /** 選択中の年（年間集計に使用） */
  year: number;
  /** 選択中の月（月間集計のラベル表示に使用） */
  month: number;
  /** 選択中の年のカテゴリ別合計（useExpenses から受け取る） */
  categoryTotals: Record<ExpenseCategory, number>;
  /** 選択中の月にフィルタ済みの支出データ（月間集計に使用） */
  monthExpenses: Expense[];
}

const MODE_LABELS: { id: SummaryMode; label: string }[] = [
  { id: 'month', label: '月間' },
  { id: 'year',  label: '年間' },
];

/** monthExpenses から カテゴリ別合計を算出する */
const calcMonthCategoryTotals = (
  expenses: Expense[]
): Record<ExpenseCategory, number> => {
  const totals: Record<ExpenseCategory, number> = {
    'グッズ': 0,
    'チケット': 0,
    '遠征費・交通費': 0,
    '貯金': 0,
    'その他': 0,
  };
  for (const expense of expenses) {
    totals[expense.category] += expense.amount;
  }
  return totals;
};

export const CategorySummary = memo(({
  year,
  month,
  categoryTotals,
  monthExpenses,
}: CategorySummaryProps) => {
  const { currentColor } = useOshiTheme();
  const [isOpen, setIsOpen]     = useState(false);
  const [mode, setMode]         = useState<SummaryMode>('month');

  // 表示中のモードに応じて集計データを切り替える
  const displayTotals = mode === 'year'
    ? categoryTotals
    : calcMonthCategoryTotals(monthExpenses);

  // ヘッダーのラベル（例:「2026年6月」「2026年」）
  const periodLabel = mode === 'year'
    ? `${year}年`
    : `${year}年${month}月`;

  return (
    <div className="mx-4 mt-3">

      {/* トグルボタン */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full py-2.5 rounded-2xl text-xs font-bold border transition-all active:scale-95"
        style={{
          color: currentColor.text,
          borderColor: currentColor.primary + '40',
          backgroundColor: currentColor.secondary,
        }}
      >
        {isOpen ? 'カテゴリ別集計を閉じる' : 'カテゴリ別集計を見る'}
      </button>

      {/* 集計内容（開いている時だけ表示） */}
      {isOpen && (
        <div className="mt-2 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">

          {/* タイトル */}
          <p className="text-xs font-bold text-gray-500 mb-3">
            カテゴリ別集計
          </p>

          {/* 月間・年間 切り替えボタン */}
          <div className="flex gap-2 mb-4">
            {MODE_LABELS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className="px-4 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95"
                style={
                  mode === id
                    ? {
                        backgroundColor: currentColor.primary,
                        borderColor: currentColor.primary,
                        color: '#ffffff',
                      }
                    : {
                        backgroundColor: currentColor.secondary,
                        borderColor: currentColor.primary + '40',
                        color: currentColor.text,
                      }
                }
              >
                {label}
              </button>
            ))}
          </div>

          {/* 集計期間のラベル */}
          <p className="text-xs text-gray-400 mb-3">
            {periodLabel}
          </p>

          {/* カテゴリ別一覧 */}
          <div className="space-y-2.5">
            {CATEGORY_ORDER.map((category) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{category}</span>
                <span className="text-sm font-bold" style={{ color: currentColor.text }}>
                  ¥{displayTotals[category].toLocaleString('ja-JP')}
                </span>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
});

CategorySummary.displayName = 'CategorySummary';