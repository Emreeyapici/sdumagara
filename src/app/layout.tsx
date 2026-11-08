import type { Metadata } from 'next';
import { DM_Sans, Cinzel } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeadlampOverlay from '@/components/HeadlampOverlay';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SDÜMAK | Süleyman Demirel Üniversitesi Mağara Araştırma ve Koruma Topluluğu',
  description: 'SDÜMAK topluluk web sitesi: Forum, haberler, etkinlik takvimi, mağara atlası, ekipman zimmet takibi ve canlı güvenlik protokolü.',
  keywords: ['SDÜMAK', 'Süleyman Demirel Üniversitesi', 'Mağaracılık', 'Isparta', 'Speleoloji', 'SRT', 'Dikey Mağara'],
  icons: {
    icon: '/images/sdumak-logo.png',
    shortcut: '/images/sdumak-logo.png',
    apple: '/images/sdumak-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`dark ${dmSans.variable} ${cinzel.variable}`}>
      <body className="min-h-screen bg-[#0d0f12] text-[#d6d3cd] flex flex-col font-sans selection:bg-[#b86d3b] selection:text-white">
        <AppProvider>
          <HeadlampOverlay />
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
