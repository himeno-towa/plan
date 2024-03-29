import React from 'react';
import Header from '../components/Header'; // 假设Header组件位于同一目录下

import { Inter } from 'next/font/google';
import { Metadata } from 'next';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'planner',
  description: 'i just want to be happy',
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body className={inter.className}>
      <Header />
      {children}
      </body>
      </html>
  );
}
