'use client';

import { memo } from 'react';
import { Expense } from '@/types';
import { ExpenseCard } from './ExpenseCard';
import { useOshiTheme } from '@/context/ThemeContext';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  isLoaded: boolean;
}

export const ExpenseList = memo(({ expenses, onDelete, isLoaded }: ExpenseListProps) => {
  const { currentColor } = useOshiTheme();

  if (!isLoaded) {
    return (
      <div className="mx-4 mt-4 flex justify-center py-12 text-sm text-gray-400">
        読み込み中...
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="mx-4 mt-4 bg-white rounded-3xl border border-gray-100 py-12 flex flex-col items-center gap-3">
        <span className="text-4xl"></span>
        <p className="text-sm text-gray-400 font-medium">この月の記録はまだありません</p>
        <p className="text-xs text-gray-300">「記録する」タブから追加してみましょう</p>
      </div>
    );
  }

  const grouped = expenses.reduce<Record<string, Expense[]>>((acc, expense) => {
    const key = expense.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(expense);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="mx-4 mt-4 space-y-4 pb-8">
      {sortedDates.map((date) => {
        const dateExpenses = grouped[date];
        const dateTotal = dateExpenses.reduce((sum, e) => sum + e.amount, 0);
        const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        return (
          <div key={date}>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-medium text-gray-400">
                {formattedDate}
              </span>
              <span className="text-xs font-bold" style={{ color: currentColor.text }}>
                ¥{dateTotal.toLocaleString('ja-JP')}
              </span>
            </div>

            <div className="space-y-2">
              {dateExpenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
});

ExpenseList.displayName = 'ExpenseList';
