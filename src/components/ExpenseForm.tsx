'use client';

import { useState, useEffect, memo } from 'react';
import { useOshiTheme } from '@/context/ThemeContext';
import { Expense, ExpenseCategory, DuplicateCheckResult } from '@/types';
import { TIMINGS } from '@/config/constants';

const CATEGORIES: ExpenseCategory[] = [
  'グッズ',
  'チケット',
  '遠征費・交通費',
  '貯金',
  'その他',
];

const MEMO_MAX_LENGTH = 100;

interface ExpenseFormProps {
  onAdd: (draft: Omit<Expense, 'id' | 'createdAt'>) => void;
  checkDuplicate: (draft: Omit<Expense, 'id' | 'createdAt'>) => DuplicateCheckResult;
  /** フォームの初期日付（選択中の月に対応） */
  defaultDate: string;
}

export const ExpenseForm = memo(({ onAdd, checkDuplicate, defaultDate }: ExpenseFormProps) => {
  const { currentColor } = useOshiTheme();

  const [date, setDate]                   = useState(defaultDate);
  const [title, setTitle]                 = useState('');
  const [amount, setAmount]               = useState('');
  const [category, setCategory]           = useState<ExpenseCategory>('グッズ');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [memo, setMemo]                   = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warning, setWarning]           = useState<string | null>(null);
  const [forceSubmit, setForceSubmit]   = useState(false);
  const [showSuccess, setShowSuccess]   = useState(false);

  // 月切り替え時、フォームの日付を選択中の月の初期値に同期する
  useEffect(() => {
    setDate(defaultDate);
  }, [defaultDate]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setReceiptNumber('');
    setMemo('');
    setDate(defaultDate);
    setCategory('グッズ');
    setWarning(null);
    setForceSubmit(false);
  };

  // onFocus/onBlur を共通化。input / textarea 両対応。
  const focusProps = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.target.style.borderColor = currentColor.primary;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.target.style.borderColor = '#e5e7eb';
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || isSubmitting) return;

    setIsSubmitting(true);

    const draft: Omit<Expense, 'id' | 'createdAt'> = {
      date,
      title: title.trim(),
      amount: Number(amount),
      category,
      receiptNumber: receiptNumber.trim() || undefined,
      memo: memo.trim() || undefined,
    };

    if (!forceSubmit) {
      const result = checkDuplicate(draft);

      if (result.type === 'receiptNumber') {
        setWarning(
          `⚠️ 領収書/注文番号「${result.receiptNumber}」は既に「${result.existingTitle}」として登録されています。それでも登録しますか？`
        );
        setForceSubmit(true);
        setIsSubmitting(false);
        return;
      }

      if (result.type === 'hash') {
        setWarning(
          `⚠️ ${result.date} に同じ内容・金額・カテゴリの記録が既にあります。二重登録ではありませんか？`
        );
        setForceSubmit(true);
        setIsSubmitting(false);
        return;
      }
    }

    onAdd(draft);
    resetForm();

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), TIMINGS.SUCCESS_FEEDBACK_MS);
    setIsSubmitting(false);
  };

  const handleFieldChange = (fn: () => void) => {
    fn();
    setWarning(null);
    setForceSubmit(false);
  };

  return (
    <div className="mx-4 mt-4 bg-white rounded-3xl shadow-sm border border-gray-100 p-5">

      <h2 className="text-sm font-bold mb-4" style={{ color: currentColor.text }}>
        ✨ 新しい支出を記録する
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            カテゴリ
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleFieldChange(() => setCategory(cat))}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95"
                style={
                  category === cat
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
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            内容
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleFieldChange(() => setTitle(e.target.value))}
            placeholder="例：アクリルスタンド Vol.3"
            required
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:bg-white transition-colors"
            {...focusProps}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              金額（円）
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleFieldChange(() => setAmount(e.target.value))}
              placeholder="1500"
              min="1"
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:bg-white transition-colors"
              {...focusProps}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              日付
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => handleFieldChange(() => setDate(e.target.value))}
              required
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:bg-white transition-colors"
              {...focusProps}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            領収書 / 注文番号
            <span className="ml-1 text-gray-400 font-normal">（任意・重複防止用）</span>
          </label>
          <input
            type="text"
            value={receiptNumber}
            onChange={(e) => handleFieldChange(() => setReceiptNumber(e.target.value))}
            placeholder="例：REC-102938"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:bg-white transition-colors"
            {...focusProps}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            メモ
            <span className="ml-1 text-gray-400 font-normal">（任意）</span>
          </label>
          <textarea
            value={memo}
            onChange={(e) => handleFieldChange(() => setMemo(e.target.value.slice(0, MEMO_MAX_LENGTH)))}
            placeholder="例：アリーナ記念Tシャツ"
            maxLength={MEMO_MAX_LENGTH}
            rows={2}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:bg-white transition-colors resize-none"
            {...focusProps}
          />
          <p className="text-right text-xs text-gray-400 mt-1">
            {memo.length} / {MEMO_MAX_LENGTH}
          </p>
        </div>

        {warning && (
          <div className="px-4 py-3 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-700 font-medium leading-relaxed">
            {warning}
            <p className="mt-1 text-orange-500">
              もう一度ボタンを押すと強制登録できます。
            </p>
          </div>
        )}

        {showSuccess && (
          <div
            className="px-4 py-3 rounded-2xl text-xs font-medium text-white text-center"
            style={{ backgroundColor: currentColor.primary }}
          >
            🎉 記録しました！
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-2xl text-sm font-bold text-white shadow-sm transition-all active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: currentColor.primary }}
        >
          {isSubmitting
            ? '確認中...'
            : forceSubmit
            ? '⚠️ 重複を承知で登録する'
            : '💖 記録する'}
        </button>

      </form>
    </div>
  );
});

ExpenseForm.displayName = 'ExpenseForm';
