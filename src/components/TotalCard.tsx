'use client';

import { memo } from 'react';
import { useOshiTheme } from '@/context/ThemeContext';

interface TotalCardProps {
  total: number;
  expenseCount: number;
  year: number;
  month: number;
}

export const TotalCard = memo(({ total, expenseCount, year, month }: TotalCardProps) => {
  const { currentColor } = useOshiTheme();

  const formatted = total.toLocaleString('ja-JP');

  return (
    <div
      className="mx-4 mt-4 rounded-3xl p-6 text-white shadow-sm"
      style={{ backgroundColor: currentColor.primary }}
    >
      <p className="text-xs font-medium opacity-80 mb-1">
        {year}年{month}月の合計
      </p>

      <div className="flex items-end gap-1 mb-4">
        <span className="text-4xl font-bold tracking-tight">
          ¥{formatted}
        </span>
      </div>

      <div
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
      >
        <span>✨</span>
        <span>{expenseCount} 件の記録</span>
      </div>
    </div>
  );
});

TotalCard.displayName = 'TotalCard';
