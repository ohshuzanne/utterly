'use client';

import { useState } from 'react';
import { Cloud, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ChatbotUpload() {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API key validation and storage
    console.log('API Key submitted:', apiKey);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-2rem)]">
      <div className="w-full max-w-md p-8 relative">
        {/* Help tooltip */}
        <div className="absolute right-0 top-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="inline-flex items-center rounded-full bg-[#ecfce5] px-2 py-1 text-xs">
                <Sparkles className="mr-1 h-3 w-3" />
                What is this for?
              </TooltipTrigger>
              <TooltipContent>
                <p>Enter your chatbot API key to start testing its capabilities</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex flex-col items-center space-y-6">
          {/* Cloud Icon */}
          <div className="mb-4">
            <Cloud className="w-16 h-16 text-gray-400" />
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                Chatbot API Key
              </label>
              <Input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full rounded-lg border-gray-200"
              />
              <p className="text-sm text-gray-500">
                Please enter the API key for the chatbot you want to test.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#8b5cf6] text-white py-2 px-4 rounded-lg hover:bg-[#7c3aed] transition-colors"
            >
              Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 