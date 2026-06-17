'use client';

import { useRef, memo } from 'react';
import { useOshiTheme } from '@/context/ThemeContext';
import { MemberColor } from '@/types';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColorPickerModal = memo(({ isOpen, onClose }: ColorPickerModalProps) => {
  const { currentColor, setThemeColor, applyCustomColor, presetColors } = useOshiTheme();
  const colorInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePresetSelect = (color: MemberColor) => {
    setThemeColor(color);
    onClose();
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyCustomColor(e.target.value);
  };

  const handleCustomConfirm = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        <h2 className="text-base font-bold text-gray-800 mb-1">
          メンカラを選んでね 🎨
        </h2>
        <p className="text-xs text-gray-400 mb-5">
          推しのイメージカラーに合わせてカスタマイズできます
        </p>

        <div className="grid grid-cols-5 gap-3 mb-6">
          {presetColors.map((color) => {
            const isSelected = currentColor.id === color.id;
            return (
              <button
                key={color.id}
                onClick={() => handlePresetSelect(color)}
                className="flex flex-col items-center gap-1.5 active:scale-95 transition-all"
                aria-label={color.name}
              >
                <div
                  className="w-12 h-12 rounded-2xl shadow-sm transition-all"
                  style={{
                    backgroundColor: color.primary,
                    outline: isSelected ? `3px solid ${color.primary}` : 'none',
                    outlineOffset: '2px',
                  }}
                >
                  {isSelected && (
                    <div className="w-full h-full flex items-center justify-center text-white text-lg">
                      ✓
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500 text-center leading-tight">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">カスタムカラー</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl shadow-sm flex-shrink-0 cursor-pointer border-2 border-gray-100 overflow-hidden"
            onClick={() => colorInputRef.current?.click()}
            aria-label="カスタムカラーを選択"
          >
            <div
              className="w-full h-full"
              style={{ backgroundColor: currentColor.primary }}
            />
            <input
              ref={colorInputRef}
              type="color"
              defaultValue={currentColor.primary}
              onChange={handleCustomChange}
              className="sr-only"
              aria-hidden="true"
            />
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">自分だけのカラー</p>
            <p className="text-xs text-gray-400 mt-0.5">
              カラーサークルをタップして選択
            </p>
            <p className="text-xs font-mono text-gray-500 mt-1">
              {currentColor.primary}
            </p>
          </div>

          <button
            onClick={handleCustomConfirm}
            className="px-4 py-2.5 rounded-2xl text-sm font-bold text-white active:scale-95 transition-all"
            style={{ backgroundColor: currentColor.primary }}
          >
            決定
          </button>

        </div>
      </div>
    </div>
  );
});

ColorPickerModal.displayName = 'ColorPickerModal';
