'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/app/components/layout/Sidebar";
import { Header } from "@/app/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, FileText, BarChart2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Report {
  id: string;
  name: string;
  overallScore: number;
  createdAt: string;
  workflow: {
    id: string;
    name: string;
    project: {
      name: string;
    };
  };
}

interface DashboardClientProps {
  firstName: string;
}

export function DashboardClient({ firstName }: DashboardClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsResponse, reportsResponse] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/reports')
        ]);

        if (!projectsResponse.ok || !reportsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const projectsData = await projectsResponse.json();
        const reportsData = await reportsResponse.json();

        setProjects(projectsData.projects);
        setReports(reportsData.reports);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleCreateProject = () => {
    router.push('/dashboard/workflow');
  };

  const handleOpenProject = (projectId: string) => {
    router.push(`/dashboard/workflow/${projectId}`);
  };

  const handleViewReport = (reportId: string, workflowId: string) => {
    router.push(`/dashboard/workflow/${workflowId}/results?reportId=${reportId}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      
      <div className="ml-[60px]">
        <Header userName={firstName} />
        
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Projects Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#D7FFBE] rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-gray-700 font-medium text-2xl">Your Projects</h2>
                </div>
                <Button onClick={handleCreateProject} className="bg-white hover:bg-gray-200 text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
              ) : projects.length === 0 ? (
                <div className="bg-[#D7FFBE] rounded-lg p-8 text-center border border-gray-600">
                  <FolderOpen className="w-12 h-12 text-black mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-black mb-2">No projects yet</h3>
                  <p className="text-green-700 mb-4">Create your first project to get started</p>
                  <Button onClick={handleCreateProject} className="bg-white hover:bg-green-50 text-green-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow bg-[#D7FFBE] border-green-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <FolderOpen className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-black">{project.name}</h3>
                          <p className="text-sm text-black">
                            Last updated: {new Date(project.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {project.description && (
                        <p className="text-black text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      <Button 
                        className="w-full bg-white hover:bg-green-50 text-black" 
                        onClick={() => handleOpenProject(project.id)}
                      >
                        Open Project
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Reports Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#EADDFF] rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-gray-700 font-medium text-2xl">Recent Reports</h2>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
              ) : reports.length === 0 ? (
                <div className="bg-white rounded-lg p-8 text-center border border-purple-100">
                  <FileText className="w-12 h-12 text-black mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-black mb-2">No reports yet</h3>
                  <p className="text-black">Run a workflow to generate your first report</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reports.map((report) => (
                    <Card 
                      key={report.id} 
                      className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white border-purple-100"
                      onClick={() => handleViewReport(report.id, report.workflow.id)}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-black">{report.name}</h3>
                          <p className="text-sm text-black">
                            {report.workflow.project.name}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-black">Workflow</span>
                          <span className="text-sm font-medium text-black">{report.workflow.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-black">Score</span>
                          <span className={`text-sm font-medium ${getScoreColor(report.overallScore)}`}>
                            {Math.round(report.overallScore * 100)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm black">Generated</span>
                          <span className="text-sm text-black">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Analytics Section */}
            <div className="bg-gray-900 text-white rounded-lg p-6 flex items-center justify-between overflow-hidden relative">
              <div className="z-10">
                <h2 className="text-xl font-bold mb-2">Learn what you can do with Utterly.ai</h2>
                <p className="text-gray-300">Get the latest insights into Utterly's updates.</p>
              </div>
              <div className="absolute top-0 right-0 w-1/3 h-full">
                <div className="absolute right-0 top-0 grid grid-cols-5 grid-rows-5 gap-2 opacity-30">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className="w-4 h-4 rounded-full bg-white"></div>
                  ))}
                </div>
              </div>
              <Button 
                className="bg-white hover:bg-gray-100 text-purple-900 z-10"
                onClick={() => router.push('/dashboard/analytics')}
              >
                
                Learn more
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 