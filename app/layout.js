import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Cycle Sync - Track Your Menstrual Cycle',
  description: 'A women\'s health app for tracking menstrual cycles and receiving personalized recommendations',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}