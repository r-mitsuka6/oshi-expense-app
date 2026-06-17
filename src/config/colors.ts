import { MemberColor } from '@/types';

export const PRESET_COLORS: MemberColor[] = [
  { id: 'pink',     name: 'キュートピンク',       primary: '#F472B6', secondary: '#FDF2F8', text: '#BE185D' },
  { id: 'lavender', name: 'ラベンダー',           primary: '#A78BFA', secondary: '#F5F3FF', text: '#6D28D9' },
  { id: 'sky',      name: 'スカイブルー',         primary: '#38BDF8', secondary: '#F0F9FF', text: '#0369A1' },
  { id: 'mint',     name: 'ミントグリーン',       primary: '#34D399', secondary: '#ECFDF5', text: '#065F46' },
  { id: 'peach',    name: 'ピーチオレンジ',       primary: '#FB923C', secondary: '#FFF7ED', text: '#C2410C' },
];

export const DEFAULT_COLOR: MemberColor = PRESET_COLORS[0];

export const LOCAL_STORAGE_KEYS = {
  EXPENSES: 'oshi-expenses',
  THEME: 'oshi-theme',
} as const;
