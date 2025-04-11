'use client';

import { useState } from 'react';
import { Cloud, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Header } from '@/app/components/layout/Header';

interface ChatbotUploadProps {
  firstName: string;
}

export function ChatbotUpload({ firstName }: ChatbotUploadProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    apiKey: '',
    apiEndpoint: '',
    modelName: '',
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    stopSequences: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          apiKey: formData.apiKey,
          apiEndpoint: formData.apiEndpoint,
          modelName: formData.modelName,
          temperature: formData.temperature,
          maxTokens: formData.maxTokens,
          topP: formData.topP,
          frequencyPenalty: formData.frequencyPenalty,
          presencePenalty: formData.presencePenalty,
          stopSequences: formData.stopSequences,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create chatbot');
      }

      toast({
        title: "Success!",
        description: "Your chatbot has been added to your account.",
      });

      // Redirect to workflow page
      router.push('/dashboard/workflow');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create chatbot",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header userName={firstName} />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md relative">
          {/* Help tooltip */}
          <div className="absolute right-0 top-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="inline-flex items-center rounded-full bg-[#ecfce5] px-2 py-1 text-xs">
                  <Sparkles className="mr-1 h-3 w-3" />
                  What is this for?
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enter your chatbot&apos;s API configuration so you can test it with different workflows and generate comprehensive reports.</p>
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Chatbot Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your chatbot's name"
                    className="w-full rounded-lg border-gray-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                    API Key
                  </label>
                  <Input
                    id="apiKey"
                    name="apiKey"
                    type="password"
                    value={formData.apiKey}
                    onChange={handleChange}
                    placeholder="Enter your API key"
                    className="w-full rounded-lg border-gray-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="apiEndpoint" className="block text-sm font-medium text-gray-700">
                    API Endpoint
                  </label>
                  <Input
                    id="apiEndpoint"
                    name="apiEndpoint"
                    type="text"
                    value={formData.apiEndpoint}
                    onChange={handleChange}
                    placeholder="https://api.example.com/v1/chat"
                    className="w-full rounded-lg border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="modelName" className="block text-sm font-medium text-gray-700">
                    Model Name
                  </label>
                  <Input
                    id="modelName"
                    name="modelName"
                    type="text"
                    value={formData.modelName}
                    onChange={handleChange}
                    placeholder="e.g., gpt-4, claude-2, etc."
                    className="w-full rounded-lg border-gray-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
                      Temperature
                    </label>
                    <Input
                      id="temperature"
                      name="temperature"
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={formData.temperature}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-700">
                      Max Tokens
                    </label>
                    <Input
                      id="maxTokens"
                      name="maxTokens"
                      type="number"
                      min="1"
                      value={formData.maxTokens}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="topP" className="block text-sm font-medium text-gray-700">
                      Top P
                    </label>
                    <Input
                      id="topP"
                      name="topP"
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.topP}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="frequencyPenalty" className="block text-sm font-medium text-gray-700">
                      Frequency Penalty
                    </label>
                    <Input
                      id="frequencyPenalty"
                      name="frequencyPenalty"
                      type="number"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={formData.frequencyPenalty}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="presencePenalty" className="block text-sm font-medium text-gray-700">
                      Presence Penalty
                    </label>
                    <Input
                      id="presencePenalty"
                      name="presencePenalty"
                      type="number"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={formData.presencePenalty}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="stopSequences" className="block text-sm font-medium text-gray-700">
                      Stop Sequences
                    </label>
                    <Input
                      id="stopSequences"
                      name="stopSequences"
                      type="text"
                      value={formData.stopSequences}
                      onChange={handleChange}
                      placeholder="e.g., \n, ###"
                      className="w-full rounded-lg border-gray-200"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#8b5cf6] text-white py-2 px-4 rounded-lg hover:bg-[#7c3aed] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 