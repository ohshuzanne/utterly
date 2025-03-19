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
  return (
    <div className={`rounded-lg p-6 h-full ${variant === 'new' ? 'bg-white border border-dashed border-gray-300' : 'bg-[#c0ff99]'}`}>
      {variant === 'new' ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl text-gray-600">+</span>
          </div>
          <p className="text-gray-700 font-medium">Start a new test</p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-xs text-gray-600 mb-1">{date}</p>
            <h3 className="font-medium text-md leading-tight">{title}</h3>
          </div>

          {accuracy && consistency && (
            <div className="space-y-2 mb-4">
              <div className="relative w-full h-6 bg-white/50 rounded-full overflow-hidden text-white">
                <div 
                  className="absolute left-0 top-0 h-full bg-teal-600 text-white" 
                  style={{ width: `${accuracy}%` }}
                />
                <div className="absolute left-2 bottom-2 text-xs tex-white whitespace-nowrap">
                  {accuracy}% accuracy
                </div>
              </div>
              <div className="relative w-full h-6 bg-white/50 rounded-full overflow-hidden text-white">
                <div 
                  className="absolute left-0 top-0 h-full bg-teal-600" 
                  style={{ width: `${consistency}%` }}
                />
                <div className="absolute left-2 bottom-2 text-xs whitespace-nowrap">
                  {consistency}% consistency
                </div>
              </div>
            </div>
          )}

          {onAnalyze && (
            <Button 
              onClick={onAnalyze}
              variant="secondary" 
              className="w-full bg-gray-800 text-white hover:bg-gray-700 rounded-3xl py-1 text-xs"
            >
              Analyze Results
            </Button>
          )}
        </>
      )}
    </div>
  );
} 