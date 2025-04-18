import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from '@/providers/SessionProvider';
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Utterly - Chatbot Testing Made Simple",
  description: "Test your chatbots with ease using Utterly",
  icons: {
    icon: '/15.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
