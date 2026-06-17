'use client';

import { memo } from 'react';
import { useOshiTheme } from '@/context/ThemeContext';

export type TabType = 'form' | 'list';

interface TabNavProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

const TABS: { id: TabType; label: string; icon: string }[] = [
  { id: 'form', label: '記録する', icon: '✏️' },
  { id: 'list', label: '一覧',     icon: '📋' },
];

export const TabNav = memo(({ activeTab, onChange }: TabNavProps) => {
  const { currentColor } = useOshiTheme();

  return (
    <nav className="mx-4 mt-4 bg-gray-100 rounded-2xl p-1 flex gap-1">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95"
            style={
              isActive
                ? {
                    backgroundColor: currentColor.primary,
                    color: '#ffffff',
                    boxShadow: `0 2px 8px ${currentColor.primary}50`,
                  }
                : { color: '#6b7280' }
            }
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
});

TabNav.displayName = 'TabNav';
