import { Metadata } from 'next';

import PlausibleProvider from 'next-plausible';

import Footer from '@/components/footer';
import Header from '@/components/header';
import TailwindIndicator from '@/components/tailwind-indicator';
import { ThemeProvider } from '@/components/theme-provider';

import { fontSans } from '@/libs/fonts';
import { cn } from '@/utils/styles';
import { METADATA } from '@/constants/metadata';

import '@/styles/globals.css';

import { SERVER_CONFIG } from '@/config/server';

// single in layout is enough for all pages
export const dynamic = 'force-dynamic';

const { title, description } = METADATA;

const { plausibleDomain, plausibleServerUrl } = SERVER_CONFIG;

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s - ${title}`,
  },
  description,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-96x96.png',
    apple: '/apple-touch-icon.png',
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
      <head>
        <PlausibleProvider
          // this site url
          domain={plausibleDomain}
          selfHosted
          // server url, without /js/script.js, both here and in next.config.mjs
          customDomain={plausibleServerUrl}
          // true for debugging
          // trackLocalhost={true}
        />
      </head>

      <body
        className={cn(
          'relative min-h-screen flex flex-col bg-background font-sans antialiased',
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
