'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { Expense, ExpenseCategory } from '@/types';
import { useOshiTheme } from '@/context/ThemeContext';
import { TIMINGS } from '@/config/constants';

const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  'グッズ':           '🧸',
  'チケット':         '🎫',
  '遠征費・交通費':   '🚄',
  '貯金': 　　　　　　'💰',
  'その他':           '📦',
};

interface ExpenseCardProps {
  expense: Expense;
  onDelete: (id: string) => void;
}

export const ExpenseCard = memo(({ expense, onDelete }: ExpenseCardProps) => {
  const { currentColor } = useOshiTheme();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete(expense.id);
    } else {
      setConfirmDelete(true);
      timerRef.current = setTimeout(
        () => setConfirmDelete(false),
        TIMINGS.DELETE_CONFIRM_RESET_MS
      );
    }
  };

  const formattedAmount = expense.amount.toLocaleString('ja-JP');
  const formattedDate = new Date(expense.date + 'T00:00:00')
    .toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3.5 flex items-center gap-3 shadow-sm">

      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: currentColor.secondary }}
      >
        {CATEGORY_ICONS[expense.category]}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {expense.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400">{formattedDate}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: currentColor.secondary,
              color: currentColor.text,
            }}
          >
            {expense.category}
          </span>
        </div>
        {expense.memo && (
          <p className="text-xs text-gray-400 mt-1 truncate">
            「{expense.memo}」
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-sm font-bold" style={{ color: currentColor.text }}>
          ¥{formattedAmount}
        </span>

        <button
          onClick={handleDeleteClick}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={
            confirmDelete
              ? { backgroundColor: '#FEE2E2', color: '#EF4444' }
              : { backgroundColor: '#F3F4F6', color: '#9CA3AF' }
          }
          aria-label={confirmDelete ? '本当に削除する' : '削除'}
        >
          {confirmDelete ? '✕' : '–'}
        </button>
      </div>

    </div>
  );
});

ExpenseCard.displayName = 'ExpenseCard';
