'use client';

import { memo } from 'react';
import { useOshiTheme } from '@/context/ThemeContext';

interface YearTotalCardProps {
  year: number;
  total: number;
}

export const YearTotalCard = memo(({ year, total }: YearTotalCardProps) => {
  const { currentColor } = useOshiTheme();

  return (
    <div
      className="mx-4 mt-3 rounded-2xl border px-5 py-4 flex items-center justify-between"
      style={{ borderColor: currentColor.primary + '30', backgroundColor: currentColor.secondary }}
    >
      <p className="text-xs font-medium" style={{ color: currentColor.text }}>
        {year}年 合計
      </p>
      <p className="text-lg font-bold" style={{ color: currentColor.text }}>
        ¥{total.toLocaleString('ja-JP')}
      </p>
    </div>
  );
});

YearTotalCard.displayName = 'YearTotalCard';
