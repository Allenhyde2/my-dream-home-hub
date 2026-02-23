import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../index.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '부동산 정보 - 한국 부동산 플랫폼',
  description: '한국 부동산 정보, 시세 분석, 전문가 상담을 제공하는 종합 플랫폼입니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
