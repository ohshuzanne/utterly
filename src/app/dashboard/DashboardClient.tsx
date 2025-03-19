'use client';

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/app/components/layout/Sidebar";
import { Header } from "@/app/components/layout/Header";
import { WorkflowCard } from "@/app/components/dashboard/WorkflowCard";
import { TestingTraffic } from "@/app/components/dashboard/TestingTraffic";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Static data that won't cause hydration issues
const recentWorkflows = [
  {
    title: "APU Website Customer Support Chatbot",
    date: "15th September 2024",
    accuracy: 83,
    consistency: 95,
  },
  {
    title: "Workflow for APU Website Customer Support Chatbot",
    date: "16th September 2024",
  },
];

interface DashboardClientProps {
  firstName: string;
}

export function DashboardClient({ firstName }: DashboardClientProps) {
  const router = useRouter();
  const [trafficData, setTrafficData] = useState<number[]>([]);

  // Generate random data after component mounts
  useEffect(() => {
    const data = Array.from({ length: 30 }, () => 
      Math.floor(Math.random() * 30)
    );
    setTrafficData(data);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      
      <div className="ml-[60px]">
        <Header />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Welcome back, {firstName}!</h1>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="text-gray-600 hover:text-gray-800"
            >
              Logout
            </Button>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Recent workflows and models uploaded</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentWorkflows.map((workflow, index) => (
                <WorkflowCard
                  key={index}
                  title={workflow.title}
                  date={workflow.date}
                  accuracy={workflow.accuracy}
                  consistency={workflow.consistency}
                  onAnalyze={workflow.accuracy ? undefined : () => {}}
                />
              ))}
              <WorkflowCard
                title="New Test"
                date=""
                variant="new"
              />
            </div>
          </div>

          <div className="mb-8">
            {/* Only render chart when data is available */}
            {trafficData.length > 0 && (
              <TestingTraffic data={trafficData} />
            )}
          </div>

          <div className="bg-gray-900 text-white rounded-lg p-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Find out how to best maximize Utterly</h2>
              <p className="text-gray-300">Learn more about our features and best practices</p>
            </div>
            <Button asChild variant="secondary" className="bg-purple-600 hover:bg-purple-500">
              <Link href="/learn-more">Read More</Link>
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
} 