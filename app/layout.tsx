import { Metadata } from 'next';

import BaseHead from '@/components/base-head';
import Footer from '@/components/footer';
import Header from '@/components/header';
import TailwindIndicator from '@/components/tailwind-indicator';
import { ThemeProvider } from '@/components/theme-provider';

import { fontSans } from '@/libs/fonts';
import { cn } from '@/utils/styles';
import { METADATA } from '@/constants/metadata';
import { SERVER_CONFIG } from '@/config/server';

import '@/styles/globals.css';

// single in layout is enough for all pages
export const dynamic = 'force-dynamic';

const { title, description, ogImage } = METADATA;
const { siteUrl } = SERVER_CONFIG;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s - ${title}`,
  },
  description,
  icons: {
    icon: '/favicons/favicon.ico',
    shortcut: '/favicons/favicon-96x96.png',
    apple: '/favicons/apple-touch-icon.png',
  },
  openGraph: {
    title,
    description,
    url: './',
    siteName: title,
    images: [ogImage],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title,
    card: 'summary_large_image',
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <BaseHead />
      <body
        className={cn(
          'relative min-h-screen min-w-80 flex flex-col bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="flex-1 my-container py-8 md:py-10">{children}</main>
          <Footer />

          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
