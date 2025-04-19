'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/app/components/layout/Header';
import { Sidebar } from '@/app/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import { Info, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface Report {
  overallScore: number;
  metrics: {
    accuracyByQuestion: {
      question: string;
      score: number;
      utterances: {
        text: string;
        response: string;
        similarityScore: number;
        analysis: string;
      }[];
      averageSimilarity: number;
      consistencyScore: number;
    }[];
    averageResponseQuality: number;
    consistencyScore: number;
  };
  details: {
    summary: string;
    recommendations: string[];
    questionAnalysis: {
      question: string;
      accuracy: number;
      consistency: number;
      comments: string;
      strengths: string[];
      weaknesses: string[];
    }[];
    consistencyAnalysis: string;
  };
  metadata: {
    chatbotName: string;
    modelName: string;
    projectName: string;
    workflowName: string;
    timestamp: string;
  };
}

export default function ReportPage() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get('reportId');
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');

  const getBgColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  

  useEffect(() => {
    const fetchReport = async () => {
      if (!reportId) {
        setError('No report ID provided');
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/reports/${reportId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }
        const data = await response.json();
        if (!data.report) {
          throw new Error('Report not found');
        }
        setReport(data.report);
      } catch (error) {
        console.error('Error fetching report:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch report');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setFirstName(data.firstName || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchReport();
    fetchUserData();
  }, [reportId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className="ml-[60px]">
          <Header userName={firstName} />
          <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              <p className="text-gray-500">Loading report...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className="ml-[60px]">
          <Header userName={firstName} />
          <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Error Loading Report</h2>
              <p className="text-gray-500">{error || 'Report not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="ml-[60px]">
        <Header userName={firstName} />
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Test Results: {report.metadata?.workflowName || 'Unknown Workflow'}</h1>
              <div className="mt-2 text-gray-500">
                Project: {report.metadata?.projectName || 'Unknown Project'} | 
                Chatbot: {report.metadata?.chatbotName || 'Unknown Chatbot'} ({report.metadata?.modelName || 'Unknown Model'})
              </div>
            </div>

            {/* overal performance  */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Overall Performance</h2>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">
                  {Math.round(report.overallScore * 100)}%
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                      className={`h-full ${getBgColor(report.overallScore)} transition-all duration-500`}
                      style={{ width: `${report.overallScore * 100}%` }}
                    />
                  </div>

                  <div className="text-sm text-gray-500 mt-1">
                    {getScoreLabel(report.overallScore)}
                  </div>
                </div>
              </div>
            </Card>

            {/* metrics card */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Average Response Quality</div>
                  <div className="text-2xl font-bold">
                    {Math.round(report.metrics.averageResponseQuality * 100)}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {getScoreLabel(report.metrics.averageResponseQuality)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Consistency Score</div>
                  <div className="text-2xl font-bold">
                    {Math.round(report.metrics.consistencyScore * 100)}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {getScoreLabel(report.metrics.consistencyScore)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Questions Tested</div>
                  <div className="text-2xl font-bold">
                    {report.metrics.accuracyByQuestion.length}
                  </div>
                </div>
              </div>
            </Card>

            {/* question analysis */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Question Analysis</h2>
              {report.metrics.accuracyByQuestion.map((question, index) => (
                <Card key={index} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">{question.question}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        Average Similarity: {Math.round(question.averageSimilarity * 100)}%
                      </div>
                      <div className="text-sm text-gray-500">
                        Consistency: {Math.round(question.consistencyScore * 100)}%
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${getScoreColor(question.score)}`}>
                      {Math.round(question.score * 100)}%
                    </div>
                  </div>
                  
                  {/* details */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-green-600 mb-1">Strengths</h5>
                        <ul className="space-y-1">
                          {report.details.questionAnalysis[index].strengths.map((strength, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-red-600 mb-1">Areas for Improvement</h5>
                        <ul className="space-y-1">
                          {report.details.questionAnalysis[index].weaknesses.map((weakness, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* utterances */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Response Analysis</h4>
                    <div className="space-y-4">
                      {question.utterances.map((utterance, uIndex) => (
                        <div key={uIndex} className="border-l-4 pl-4 border-gray-200">
                          <div className="text-sm text-gray-500">Utterance: {utterance.text}</div>
                          <div className="mt-1">Response: {utterance.response}</div>
                          <div className="text-sm mt-1">
                            Similarity: {Math.round(utterance.similarityScore * 100)}%
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Analysis: {utterance.analysis}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* sumamries and recommaendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Summary</h2>
                <p className="text-gray-600">{report.details.summary}</p>
              </Card>
              
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
                <ul className="space-y-2">
                  {report.details.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-purple-500 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 