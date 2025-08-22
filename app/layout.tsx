import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MindTrack AI - AI-Powered Mental Health Journal',
  description: 'Log your daily thoughts, receive AI-generated mood analysis, track emotion trends, and get personalized coping strategies with MindTrack AI.',
  keywords: 'mental health, AI journal, mood tracking, wellness, coping strategies',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}