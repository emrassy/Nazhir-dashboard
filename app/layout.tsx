// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import ClientWrapper from '@/components/ClientWrapper';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Nazhir Dashboard',
  description: 'Pemantauan Hafalan dan Absensi Santri',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientWrapper>
            <Navbar />
          </ClientWrapper>
          {children}
        </Providers>
      </body>
    </html>
  );
}
