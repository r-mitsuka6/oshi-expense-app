'use client';

import { useState, useEffect, useCallback } from 'react';
import { Expense, ExpenseCategory, DuplicateCheckResult } from '@/types';
import { LOCAL_STORAGE_KEYS } from '@/config/colors';
import { safeStorage } from '@/config/storage';

interface UseExpensesReturn {
  /** 全期間の支出データ */
  expenses: Expense[];
  /** 選択中の年月にフィルタリングされた支出データ */
  monthExpenses: Expense[];
  isLoaded: boolean;
  addExpense: (draft: Omit<Expense, 'id' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;
  checkDuplicate: (draft: Omit<Expense, 'id' | 'createdAt'>) => DuplicateCheckResult;
  /** 選択中の月の合計金額 */
  monthTotal: number;
  /** 選択中の年の合計金額 */
  yearTotal: number;
  /** 選択中の年のカテゴリ別合計金額 */
  yearCategoryTotals: Record<ExpenseCategory, number>;
  selectedYear: number;
  selectedMonth: number; // 1-12
  /** 選択中の年月が「今月」と一致するか */
  isCurrentMonth: boolean;
  /** 新規登録フォームのデフォルト日付（選択中の月に対応） */
  defaultDateForForm: string;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
  /** 年を直接指定して移動する（月は維持） */
  goToYear: (year: number) => void;
  /** 月を直接指定して移動する（年は維持） */
  goToMonth: (month: number) => void;
}

/** 年月を1つの値として扱うための内部型 */
interface YearMonth {
  year: number;
  month: number; // 1-12
}

/** 現在の年月を取得するヘルパー */
const getCurrentYearMonth = (): YearMonth => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
};

/**
 * year/month を跨ぎ処理込みで1ヶ月分シフトする純粋関数。
 * setState の updater 内で「単一の state」だけを更新するために、
 * year と month の計算をここで1回で完結させる。
 * （月移動バグの再発防止のため、この設計を維持する）
 */
const shiftYearMonth = (ym: YearMonth, delta: 1 | -1): YearMonth => {
  const zeroBasedMonth = ym.month - 1 + delta;
  const year = ym.year + Math.floor(zeroBasedMonth / 12);
  const month = ((zeroBasedMonth % 12) + 12) % 12 + 1;
  return { year, month };
};

/** カテゴリ別集計の表示順を固定するための配列 */
const CATEGORY_ORDER: ExpenseCategory[] = [
  'グッズ',
  'チケット',
  '遠征費・交通費',
  '貯金',
  'その他',
];

/** カテゴリ別合計の初期値（全カテゴリを0円で初期化） */
const createEmptyCategoryTotals = (): Record<ExpenseCategory, number> => {
  const initial: Record<ExpenseCategory, number> = {
    'グッズ': 0,
    'チケット': 0,
    '遠征費・交通費': 0,
    '貯金': 0,
    'その他': 0,
  };
  return initial;
};

export const useExpenses = (): UseExpensesReturn => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 年と月を1つの state にまとめる。
  // 理由：別々の state にして updater 内で互いを更新する構造にすると、
  // React 18 Strict Mode の二重実行で年がずれるバグが発生するため、
  // 単一の setState 呼び出しに統一している（修正済みのため維持）。
  const [yearMonth, setYearMonth] = useState<YearMonth>(getCurrentYearMonth());
  const { year: selectedYear, month: selectedMonth } = yearMonth;

  // 初回マウント時に localStorage から復元
  useEffect(() => {
    const saved = safeStorage.get(LOCAL_STORAGE_KEYS.EXPENSES);
    try {
      const parsed: Expense[] = saved ? JSON.parse(saved) : [];
      setExpenses(parsed);
    } catch {
      setExpenses([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // expenses が変化するたびに保存
  useEffect(() => {
    if (!isLoaded) return;
    safeStorage.set(LOCAL_STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses, isLoaded]);

  // 重複チェックロジック（全期間データに対して判定）
  const checkDuplicate = useCallback((
    draft: Omit<Expense, 'id' | 'createdAt'>
  ): DuplicateCheckResult => {
    if (draft.receiptNumber) {
      const hit = expenses.find(
        (e) => e.receiptNumber && e.receiptNumber === draft.receiptNumber
      );
      if (hit) {
        return { type: 'receiptNumber', existingTitle: hit.title, receiptNumber: draft.receiptNumber };
      }
    }

    const hashHit = expenses.some(
      (e) =>
        e.date === draft.date &&
        e.amount === draft.amount &&
        e.category === draft.category &&
        e.title === draft.title
    );
    if (hashHit) {
      return { type: 'hash', amount: draft.amount, category: draft.category, date: draft.date };
    }

    return { type: 'none' };
  }, [expenses]);

  const addExpense = useCallback((draft: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // 前月へ移動。setState は1回だけ、かつ updater は純粋関数（副作用なし）。
  const goToPreviousMonth = useCallback(() => {
    setYearMonth((prev) => shiftYearMonth(prev, -1));
  }, []);

  // 翌月へ移動。同様に setState は1回のみ。
  const goToNextMonth = useCallback(() => {
    setYearMonth((prev) => shiftYearMonth(prev, 1));
  }, []);

  // 今日の年月へ戻る
  const goToToday = useCallback(() => {
    setYearMonth(getCurrentYearMonth());
  }, []);

  // 年プルダウンから直接年を指定して移動する。月は維持する。
  // setState は1回のみで、updater は引数の year 以外を参照しない純粋関数。
  const goToYear = useCallback((year: number) => {
    setYearMonth((prev) => ({ year, month: prev.month }));
  }, []);

  // 月プルダウンから直接月を指定して移動する。年は維持する。
  const goToMonth = useCallback((month: number) => {
    setYearMonth((prev) => ({ year: prev.year, month }));
  }, []);

  // "YYYY-MM" 形式のプレフィックス（月フィルタ用）
  const monthPrefix = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
  // "YYYY-" 形式のプレフィックス（年フィルタ用）
  const yearPrefix = `${selectedYear}-`;

  const monthExpenses = expenses.filter((e) => e.date.startsWith(monthPrefix));

  const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // 選択中の年でフィルタした配列（年間合計・カテゴリ別集計の両方で使用）
  const yearExpenses = expenses.filter((e) => e.date.startsWith(yearPrefix));

  const yearTotal = yearExpenses.reduce((sum, e) => sum + e.amount, 0);

  // 選択中の年のカテゴリ別合計を計算する。
  // CATEGORY_ORDER の全カテゴリを0円で初期化した上で積算するため、
  // 支出が1件もないカテゴリも ¥0 として確実に存在する。
  const yearCategoryTotals = yearExpenses.reduce<Record<ExpenseCategory, number>>(
    (acc, expense) => {
      acc[expense.category] += expense.amount;
      return acc;
    },
    createEmptyCategoryTotals()
  );

  const { year: nowYear, month: nowMonth } = getCurrentYearMonth();
  const isCurrentMonth = selectedYear === nowYear && selectedMonth === nowMonth;

  // 新規登録時のデフォルト日付：
  // 現在の月を表示中なら「今日」、それ以外なら選択中の月の1日
  const defaultDateForForm = isCurrentMonth
    ? new Date().toISOString().split('T')[0]
    : `${monthPrefix}-01`;

  return {
    expenses,
    monthExpenses,
    isLoaded,
    addExpense,
    deleteExpense,
    checkDuplicate,
    monthTotal,
    yearTotal,
    yearCategoryTotals,
    selectedYear,
    selectedMonth,
    isCurrentMonth,
    defaultDateForForm,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    goToYear,
    goToMonth,
  };
};

export { CATEGORY_ORDER };