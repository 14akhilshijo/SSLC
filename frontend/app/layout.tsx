import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Kerala SSLC Result 2026 | Official Result Portal',
  description: 'Check Kerala SSLC Result 2026 online. Get individual results, school-wise results, mark sheets, grade cards and more. Fast, official and secure.',
  keywords: 'Kerala SSLC Result 2026, SSLC Result, Kerala Board Result, 10th Result Kerala, Pareeksha Bhavan',
  authors: [{ name: 'Kerala Pareeksha Bhavan' }],
  openGraph: {
    title: 'Kerala SSLC Result 2026',
    description: 'Official Kerala SSLC Result Portal 2026 — Fast, Secure, Reliable',
    url: 'https://sslc.akhilshijoinnov.site',
    siteName: 'Kerala SSLC Result Portal',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kerala SSLC Result 2026',
    description: 'Check your Kerala SSLC Result 2026 instantly',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1d4ed8' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e3a8a',
                color: '#fff',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
              },
              success: { iconTheme: { primary: '#34d399', secondary: '#fff' } },
              error: { iconTheme: { primary: '#f87171', secondary: '#fff' } },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
