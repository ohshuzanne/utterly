'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, BarChart2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/app/components/layout/Header';
import { Sidebar } from '@/app/components/layout/Sidebar';
import { useToast } from '@/components/ui/use-toast';

interface Report {
  id: string;
  name: string;
  overallScore: number;
  createdAt: string;
  workflow: {
    name: string;
    project: {
      name: string;
    };
  };
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports');
        if (!response.ok) {
          throw new Error('Failed to fetch reports');
        }
        const data = await response.json();
        setReports(data.reports);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load reports. Please try again.',
          variant: 'destructive',
        });
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

    fetchReports();
    fetchUserData();
  }, [toast]);

  const handleViewReport = (reportId: string, workflowId: string) => {
    router.push(`/dashboard/workflow/${workflowId}/results?reportId=${reportId}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircle className="w-4 h-4" />;
    if (score >= 0.6) return <Clock className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      
      <div className="ml-[60px]">
        <Header userName={firstName} />
        
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Analytics Reports</h1>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : reports.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No reports yet</h3>
                <p className="text-gray-500 mb-6">Run a workflow to generate your first report</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                  <div 
                    key={report.id} 
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleViewReport(report.id, report.workflow.id)}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{report.name}</h3>
                        <p className="text-sm text-gray-500">{report.workflow.project.name}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Workflow</span>
                        <span className="text-sm font-medium">{report.workflow.name}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Overall Score</span>
                        <div className="flex items-center gap-2">
                          {getScoreIcon(report.overallScore)}
                          <span className={`font-medium ${getScoreColor(report.overallScore)}`}>
                            {Math.round(report.overallScore * 100)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Generated</span>
                        <span className="text-sm">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 