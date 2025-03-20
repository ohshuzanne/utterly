'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Workflow, BarChart2, MessageSquare, Settings } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: Workflow, label: 'Workflow', href: '/dashboard/workflow' },
  { icon: MessageSquare, label: 'Chat Tests', href: '/dashboard/tests' },
  { icon: BarChart2, label: 'Analytics', href: '/dashboard/analytics' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 h-full w-[60px] bg-gray-900 flex flex-col items-center py-4">
      {/* Logo */}
      <TooltipProvider delayDuration={100} skipDelayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/dashboard" className="mb-8">
              <div className="bg-white text-gray-900 w-10 h-10 rounded flex items-center justify-center text-lg font-bold transition-transform duration-200 hover:scale-105 shadow-sm">
                U.
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-gray-800 border-l-2 border-[#c0ff99]">
            <p>Dashboard</p>
          </TooltipContent>
        </Tooltip>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col items-center gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      isActive 
                        ? 'text-[#c0ff99] bg-gray-800' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon size={24} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className={isActive ? 'bg-gray-800 border-l-2 border-[#c0ff99]' : 'bg-gray-800'}>
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/settings"
                className={`p-2 rounded-md transition-all duration-200 ${
                  pathname === '/dashboard/settings'
                    ? 'text-[#c0ff99] bg-gray-800'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Settings size={24} />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className={pathname === '/dashboard/settings' ? 'bg-gray-800 border-l-2 border-[#c0ff99]' : 'bg-gray-800'}>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
} 