'use client';

import { Button } from "@/components/ui/button";

interface WorkflowCardProps {
  title: string;
  date: string;
  accuracy?: number;
  consistency?: number;
  onAnalyze?: () => void;
  variant?: 'result' | 'new';
}

export function WorkflowCard({ 
  title, 
  date, 
  accuracy, 
  consistency, 
  onAnalyze,
  variant = 'result' 
}: WorkflowCardProps) {
  if (variant === 'new') {
    return (
      <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] cursor-pointer hover:bg-gray-200 transition-colors">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl text-gray-600">+</span>
        </div>
        <p className="text-gray-600 font-medium">Start a new test</p>
      </div>
    );
  }

  return (
    <div className="bg-[#c0ff99] rounded-lg p-6">
      <div className="mb-4">
        <p className="text-sm text-gray-600">{date}</p>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>

      {accuracy && consistency && (
        <div className="space-y-2 mb-4">
          <div className="bg-emerald-500/20 text-emerald-700 py-1 px-3 rounded-full text-sm inline-block">
            {accuracy}% accuracy
          </div>
          <div className="bg-emerald-500/20 text-emerald-700 py-1 px-3 rounded-full text-sm inline-block">
            {consistency}% consistency
          </div>
        </div>
      )}

      {onAnalyze && (
        <Button 
          onClick={onAnalyze}
          variant="secondary" 
          className="w-full bg-gray-800 text-white hover:bg-gray-700"
        >
          Analyze Results
        </Button>
      )}
    </div>
  );
} 