'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, BarChart2, MessageSquare, Settings } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: Users, label: 'Team', href: '/dashboard/team' },
  { icon: MessageSquare, label: 'Chat Tests', href: '/dashboard/tests' },
  { icon: BarChart2, label: 'Analytics', href: '/dashboard/analytics' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 h-full w-[60px] bg-gray-900 flex flex-col items-center py-4">
      {/* Logo */}
      <Link href="/dashboard" className="mb-8">
        <div className="bg-white text-gray-900 w-8 h-8 rounded flex items-center justify-center text-lg font-bold">
          U.
        </div>
      </Link>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col items-center gap-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              title={item.label}
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="mt-auto">
        <Link
          href="/dashboard/settings"
          className={`p-2 rounded-lg transition-colors ${
            pathname === '/dashboard/settings'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
          title="Settings"
        >
          <Settings size={20} />
        </Link>
      </div>
    </div>
  );
} 