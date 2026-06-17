'use client';

import { useState, memo } from 'react';
import { useOshiTheme } from '@/context/ThemeContext';
import { ExpenseCategory } from '@/types';
import { CATEGORY_ORDER } from '@/hooks/useExpenses';

interface CategorySummaryProps {
  year: number;
  categoryTotals: Record<ExpenseCategory, number>;
}

export const CategorySummary = memo(({ year, categoryTotals }: CategorySummaryProps) => {
  const { currentColor } = useOshiTheme();
  const [isOpen, setIsOpen] = useState(false);

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
          <p className="text-xs font-bold text-gray-500 mb-3">
            カテゴリ別集計（{year}年）
          </p>

          <div className="space-y-2.5">
            {CATEGORY_ORDER.map((category) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{category}</span>
                <span className="text-sm font-bold" style={{ color: currentColor.text }}>
                  ¥{categoryTotals[category].toLocaleString('ja-JP')}
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