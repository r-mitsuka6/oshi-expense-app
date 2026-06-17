'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MemberColor } from '@/types';
import { DEFAULT_COLOR, LOCAL_STORAGE_KEYS, PRESET_COLORS } from '@/config/colors';
import { safeStorage } from '@/config/storage';

/**
 * #RRGGBB 形式の hex を rgba() 文字列に変換する。
 * input type="color" は常に #RRGGBB を返すため、7文字以外は早期リターン。
 */
const hexToRgba = (hex: string, alpha: number): string => {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface ThemeContextValue {
  currentColor: MemberColor;
  setThemeColor: (color: MemberColor) => void;
  applyCustomColor: (hex: string) => void;
  presetColors: MemberColor[];
}

const ThemeContext = createContext<ThemeContextValue>({
  currentColor: DEFAULT_COLOR,
  setThemeColor: () => {},
  applyCustomColor: () => {},
  presetColors: PRESET_COLORS,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentColor, setCurrentColor] = useState<MemberColor>(DEFAULT_COLOR);

  // CSS変数をDOMに注入するヘルパー
  const applyToDom = useCallback((color: MemberColor) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', color.primary);
    root.style.setProperty('--color-secondary', color.secondary);
    root.style.setProperty('--color-oshi-text', color.text);
  }, []);

  // 初回マウント時に localStorage から復元
  useEffect(() => {
    const saved = safeStorage.get(LOCAL_STORAGE_KEYS.THEME);
    try {
      if (saved) {
        const parsed: MemberColor = JSON.parse(saved);
        setCurrentColor(parsed);
        applyToDom(parsed);
      } else {
        applyToDom(DEFAULT_COLOR);
      }
    } catch {
      applyToDom(DEFAULT_COLOR);
    }
  }, [applyToDom]);

  const setThemeColor = useCallback((color: MemberColor) => {
    setCurrentColor(color);
    applyToDom(color);
    safeStorage.set(LOCAL_STORAGE_KEYS.THEME, JSON.stringify(color));
  }, [applyToDom]);

  const applyCustomColor = useCallback((hex: string) => {
    const custom: MemberColor = {
      id: 'custom',
      name: 'マイ推しカラー',
      primary: hex,
      secondary: hexToRgba(hex, 0.1),
      text: hex,
    };
    setThemeColor(custom);
  }, [setThemeColor]);

  return (
    <ThemeContext.Provider
      value={{ currentColor, setThemeColor, applyCustomColor, presetColors: PRESET_COLORS }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useOshiTheme = () => useContext(ThemeContext);
