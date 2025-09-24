import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Medicine Management System',
    description: 'AI-powered pharmacy management and billing system',
    keywords: 'pharmacy, medicine, management, billing, healthcare',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <Providers>
                    {children}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            className: 'toast',
                            success: {
                                className: 'toast-success',
                            },
                            error: {
                                className: 'toast-error',
                            },
                        }}
                    />
                </Providers>
            </body>
        </html>
    )
}