'use client';

import { Info, Settings } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  userName?: string;
}

export function Header({ userName = 'Suzanne' }: HeaderProps) {
  return (
    <header className="flex justify-between items-center p-6 border-b">
      <div>
        <h1 className="text-2xl font-bold">Hello, {userName}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/about"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <Info size={20} />
          <span>About</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </div>
    </header>
  );
} 