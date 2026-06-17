import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: '推し活メモ',
  description: '推し活・オタ活専用 支出管理アプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <ThemeProvider>
          <div className="max-w-md mx-auto min-h-dvh">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
