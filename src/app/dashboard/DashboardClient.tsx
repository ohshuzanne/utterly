'use client';

import { useState, useEffect } from "react";
import { Sidebar } from "@/app/components/layout/Sidebar";
import { Header } from "@/app/components/layout/Header";
import { WorkflowCard } from "@/app/components/dashboard/WorkflowCard";
import { TestingTraffic } from "@/app/components/dashboard/TestingTraffic";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
  const [trafficData, setTrafficData] = useState<number[]>([]);

  // Generate random data after component mounts
  useEffect(() => {
    const data = Array.from({ length: 30 }, () => 
      Math.floor(Math.random() * 30)
    );
    setTrafficData(data);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      
      <div className="ml-[60px]">
        <Header userName={firstName} />
        
        <main className="p-6">
          <div className="mb-8">
            <h2 className="text-gray-700 font-medium mb-4 text-2xl">Recent workflows and models uploaded</h2>
            <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
              {recentWorkflows.map((workflow, index) => (
                <div key={index} className="min-w-[400px] w-[400px] min-h-[200px] h-[200px] flex-shrink-0">
                  <WorkflowCard
                    title={workflow.title}
                    date={workflow.date}
                    accuracy={workflow.accuracy}
                    consistency={workflow.consistency}
                    onAnalyze={workflow.accuracy ? undefined : () => {}}
                  />
                </div>
              ))}
              <div className="min-w-[280px] w-[280px] flex-shrink-0">
                <div className="bg-gray-100 rounded-lg p-6 h-full flex flex-col items-center justify-center border border-dashed border-gray-300 hover:bg-gray-200 transition-colors cursor-pointer">
                  <Plus className="w-10 h-10 text-gray-500 mb-2" />
                  <p className="text-gray-700 font-medium">Start a new test</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 bg-white rounded-lg p-6 border">
            {/* Only render chart when data is available */}
            {trafficData.length > 0 && (
              <div>
                <h3 className="text-gray-700 mb-4">Testing Traffic</h3>
                <div className="text-3xl font-bold mb-4">612</div>
                <TestingTraffic data={trafficData} />
              </div>
            )}
          </div>

          <div className="bg-gray-900 text-white rounded-lg p-6 flex items-center justify-between overflow-hidden relative">
            <div className="z-10">
              <h2 className="text-xl font-bold mb-2">Find out how to best maximize Utterly</h2>
              <p className="text-gray-300">Learn more about our features and best practices</p>
            </div>
            <div className="absolute top-0 right-0 w-1/3 h-full">
              <div className="absolute right-0 top-0 grid grid-cols-5 grid-rows-5 gap-2 opacity-30">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className="w-4 h-4 rounded-full bg-white"></div>
                ))}
              </div>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-500 z-10">
              Read More
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
} 