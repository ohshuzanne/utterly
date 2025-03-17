'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TempLoginPage() {
  const router = useRouter();

  const handleDashboardAccess = () => {
    // Force a direct navigation to dashboard
    window.location.href = '/dashboard';
    // Alternative approach if the above doesn't work:
    // router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Temporary Access</h1>
        <Button 
          onClick={handleDashboardAccess}
          className="w-full bg-purple-600 hover:bg-purple-500"
        >
          Access Dashboard
        </Button>
      </div>
    </div>
  );
} 