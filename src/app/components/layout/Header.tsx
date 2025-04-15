'use client';

import { Info, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  userName?: string;
}

export function Header({ userName = 'User' }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <header className="flex justify-between items-center p-6 border-b">
      <div>
        <h1 className="text-2xl font-bold">Hello, {userName}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/knowledge"
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
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2 ml-4"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
} 