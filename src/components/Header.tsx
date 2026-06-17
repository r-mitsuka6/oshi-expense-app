'use client';

import { memo } from 'react';
import { useOshiTheme } from '@/context/ThemeContext';

interface HeaderProps {
  onOpenColorPicker: () => void;
}

export const Header = memo(({ onOpenColorPicker }: HeaderProps) => {
  const { currentColor } = useOshiTheme();

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between px-5 py-4">

        <div className="flex items-center gap-2">
          <span className="text-xl"></span>
          <h1 className="text-lg font-bold tracking-tight text-gray-800">
            推し活メモ
          </h1>
        </div>

        <button
          onClick={onOpenColorPicker}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl border text-xs font-medium text-gray-600 transition-all active:scale-95"
          style={{ borderColor: currentColor.primary + '60' }}
          aria-label="メンバーカラーを変更"
        >
          <span
            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: currentColor.primary }}
          />
          <span>メンカラ</span>
        </button>

      </div>
    </header>
  );
});

Header.displayName = 'Header';
