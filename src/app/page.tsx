// src/app/page.tsx
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { Header } from '@/components/Header';
import { TotalCard } from '@/components/TotalCard';
import { YearTotalCard } from '@/components/YearTotalCard';
import { CategorySummary } from '@/components/CategorySummary';
import { MonthNavigator } from '@/components/MonthNavigator';
import { TabNav, TabType } from '@/components/TabNav';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { ColorPickerModal } from '@/components/ColorPickerModal';
import { Expense } from '@/types';
import { TIMINGS } from '@/config/constants';

export default function Page() {
  const [activeTab, setActiveTab]           = useState<TabType>('form');
  const [isColorPickerOpen, setColorPicker] = useState(false);

  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  const {
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
  } = useExpenses();

  const handleOpenColorPicker  = useCallback(() => setColorPicker(true),  []);
  const handleCloseColorPicker = useCallback(() => setColorPicker(false), []);
  const handleTabChange        = useCallback((tab: TabType) => setActiveTab(tab), []);

  const handleAdd = useCallback((draft: Omit<Expense, 'id' | 'createdAt'>) => {
    addExpense(draft);
    redirectTimerRef.current = setTimeout(
      () => setActiveTab('list'),
      TIMINGS.AFTER_SUBMIT_REDIRECT_MS
    );
  }, [addExpense]);

  return (
    <>
      <Header onOpenColorPicker={handleOpenColorPicker} />

      <MonthNavigator
        year={selectedYear}
        month={selectedMonth}
        isCurrentMonth={isCurrentMonth}
        onPrev={goToPreviousMonth}
        onNext={goToNextMonth}
        onToday={goToToday}
        onSelectYear={goToYear}
        onSelectMonth={goToMonth}
      />

      <TotalCard
        total={monthTotal}
        expenseCount={monthExpenses.length}
        year={selectedYear}
        month={selectedMonth}
      />

      <YearTotalCard
        year={selectedYear}
        total={yearTotal}
      />

      <CategorySummary
        year={selectedYear}
        month={selectedMonth}
        categoryTotals={yearCategoryTotals}
        monthExpenses={monthExpenses}
      />

      <TabNav activeTab={activeTab} onChange={handleTabChange} />

      {activeTab === 'form' ? (
        <ExpenseForm
          onAdd={handleAdd}
          checkDuplicate={checkDuplicate}
          defaultDate={defaultDateForForm}
        />
      ) : (
        <ExpenseList
          expenses={monthExpenses}
          onDelete={deleteExpense}
          isLoaded={isLoaded}
        />
      )}

      <ColorPickerModal
        isOpen={isColorPickerOpen}
        onClose={handleCloseColorPicker}
      />
    </>
  );
}