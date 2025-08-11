'use client';

import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { CycleProvider } from '../contexts/CycleContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <CycleProvider>
            {children}
          </CycleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}