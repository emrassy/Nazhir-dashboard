import './globals.css'
import { Poppins } from 'next/font/google'
import ClientWrapper from '@/components/ClientWrapper'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
})

export const metadata = {
  title: 'Nazhir Dashboard',
  description: 'Pemantauan Hafalan dan Absensi Santri',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className="font-poppins" suppressHydrationWarning>
        <Providers>
          <ClientWrapper>
            <Navbar />
            {children}
          </ClientWrapper>
        </Providers>
      </body>
    </html>
  )
}
