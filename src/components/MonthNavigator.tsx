'use client';

import { memo, useMemo } from 'react';
import { useOshiTheme } from '@/context/ThemeContext';

interface MonthNavigatorProps {
  year: number;
  month: number;
  isCurrentMonth: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onSelectYear: (year: number) => void;
  onSelectMonth: (month: number) => void;
}

/** 年プルダウンの選択肢を生成する範囲（現在年の前後） */
const YEAR_RANGE_BEFORE = 5;
const YEAR_RANGE_AFTER = 2;

export const MonthNavigator = memo(({
  year,
  month,
  isCurrentMonth,
  onPrev,
  onNext,
  onToday,
  onSelectYear,
  onSelectMonth,
}: MonthNavigatorProps) => {
  const { currentColor } = useOshiTheme();

  // 年の選択肢：現在の実年を基準に前後の範囲を生成する。
  // 表示中の year が範囲外（古いデータ閲覧時など）でも必ず選択肢に含める。
  const yearOptions = useMemo(() => {
    const nowYear = new Date().getFullYear();
    const start = Math.min(nowYear - YEAR_RANGE_BEFORE, year);
    const end = Math.max(nowYear + YEAR_RANGE_AFTER, year);
    const options: number[] = [];
    for (let y = start; y <= end; y++) {
      options.push(y);
    }
    return options;
  }, [year]);

  const monthOptions = useMemo(
    () => Array.from({ length: 12 }, (_, i) => i + 1),
    []
  );

  return (
    <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-2 py-3 flex flex-col gap-2">

      <div className="flex items-center justify-between">

        {/* 前月へ */}
        <button
          onClick={onPrev}
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all active:scale-90"
          style={{ color: currentColor.text, backgroundColor: currentColor.secondary }}
          aria-label="前の月へ"
        >
          ‹
        </button>

        {/* 年・月プルダウン */}
        <div className="flex items-center gap-1.5">
          <select
            value={year}
            onChange={(e) => onSelectYear(Number(e.target.value))}
            className="text-sm font-bold bg-transparent border border-gray-200 rounded-xl px-2 py-1.5 focus:outline-none"
            style={{ color: currentColor.text }}
            aria-label="年を選択"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}年
              </option>
            ))}
          </select>

          <select
            value={month}
            onChange={(e) => onSelectMonth(Number(e.target.value))}
            className="text-sm font-bold bg-transparent border border-gray-200 rounded-xl px-2 py-1.5 focus:outline-none"
            style={{ color: currentColor.text }}
            aria-label="月を選択"
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m}月
              </option>
            ))}
          </select>
        </div>

        {/* 翌月へ */}
        <button
          onClick={onNext}
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all active:scale-90"
          style={{ color: currentColor.text, backgroundColor: currentColor.secondary }}
          aria-label="次の月へ"
        >
          ›
        </button>

      </div>

      {/* 今日へ戻る（現在月を表示中は非表示） */}
      {!isCurrentMonth && (
        <button
          onClick={onToday}
          className="text-xs font-medium underline-offset-2 hover:underline self-center"
          style={{ color: currentColor.text }}
        >
          今日へ戻る
        </button>
      )}

    </div>
  );
});

MonthNavigator.displayName = 'MonthNavigator';