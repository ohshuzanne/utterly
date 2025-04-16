'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Header } from '@/app/components/layout/Header';
import { Sidebar } from '@/app/components/layout/Sidebar';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  workflows: {
    id: string;
    name: string;
  }[];
  reports: {
    id: string;
    name: string;
    overallScore: number;
  }[];
}

interface TeamMember {
  id: string;
  role: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Team {
  id: string;
  name: string;
  description: string | null;
  members: TeamMember[];
  projects: Project[];
}

interface TeamDetailsClientProps {
  team: Team;
  currentUser: User;
  userProjects: Project[];
}

export default function TeamDetailsClient({ team, currentUser, userProjects }: TeamDetailsClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const isAdmin = team.members.find(member => member.user.id === currentUser.id)?.role === 'admin';

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) return;

    try {
      const response = await fetch(`/api/teams/${team.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newMemberEmail }),
      });

      if (!response.ok) {
        throw new Error('Failed to add member');
      }

      router.refresh();
      setNewMemberEmail('');
      toast({
        title: 'Success',
        description: 'Member added successfully',
      });
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: 'Error',
        description: 'Failed to add member',
        variant: 'destructive',
      });
    }
  };

  const handleAddProject = async () => {
    if (!selectedProjectId) return;

    try {
      const response = await fetch(`/api/teams/${team.id}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId: selectedProjectId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add project');
      }

      router.refresh();
      setSelectedProjectId('');
      toast({
        title: 'Success',
        description: 'Project added successfully',
      });
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: 'Error',
        description: 'Failed to add project',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/teams/${team.id}/members/${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove member');
      }

      router.refresh();
      toast({
        title: 'Success',
        description: 'Member removed successfully',
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove member',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/teams/${team.id}/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove project');
      }

      router.refresh();
      toast({
        title: 'Success',
        description: 'Project removed successfully',
      });
    } catch (error) {
      console.error('Error removing project:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove project',
        variant: 'destructive',
      });
    }
  };

  const navigateToWorkflow = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    router.push(`/dashboard/workflow/${projectId}`);
  };

  const navigateToReport = (e: React.MouseEvent, projectId: string, reportId: string) => {
    e.stopPropagation();
    router.push(`/dashboard/workflow/${projectId}/results?reportId=${reportId}`);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="ml-[60px] flex-1">
        <Header userName={currentUser.name} />
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">{team.name}</h1>
              {team.description && (
                <p className="text-gray-600">{team.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Members Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Team Members</CardTitle>
                  {isAdmin && (
                    <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="bg-[#8b5cf6] text-white">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Team Member</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                              Email Address
                            </label>
                            <Input
                              id="email"
                              value={newMemberEmail}
                              onChange={(e) => setNewMemberEmail(e.target.value)}
                              placeholder="Enter member's email"
                            />
                          </div>
                          <Button 
                            onClick={handleAddMember} 
                            className="w-full bg-[#8b5cf6] text-white"
                          >
                            Add Member
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {team.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {member.user.firstName} {member.user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{member.user.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{member.role}</span>
                          {isAdmin && member.user.id !== currentUser.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Projects Section */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Team Projects</CardTitle>
                  <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-[#8b5cf6] text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Project to Team</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="project" className="block text-sm font-medium">
                            Select Project
                          </label>
                          <select
                            id="project"
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="">Select a project</option>
                            {userProjects.map((project) => (
                              <option key={project.id} value={project.id}>
                                {project.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <Button 
                          onClick={handleAddProject} 
                          className="w-full bg-[#8b5cf6] text-white"
                        >
                          Add Project
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {team.projects.map((project) => (
                      <Card key={project.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">{project.name}</h3>
                            <p className="text-gray-600">{project.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleRemoveProject(e, project.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Workflows</h4>
                          {project.workflows.length > 0 ? (
                            <ul className="space-y-2">
                              {project.workflows.map((workflow) => (
                                <li 
                                  key={workflow.id} 
                                  className="flex items-center cursor-pointer hover:text-[#8b5cf6]"
                                  onClick={(e) => navigateToWorkflow(e, project.id)}
                                >
                                  <span className="text-gray-600">{workflow.name}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">No workflows found</p>
                          )}
                        </div>

                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Reports</h4>
                          {project.reports.length > 0 ? (
                            <ul className="space-y-2">
                              {project.reports.map((report) => (
                                <li 
                                  key={report.id} 
                                  className="flex items-center justify-between cursor-pointer hover:text-[#8b5cf6]"
                                  onClick={(e) => navigateToReport(e, project.id, report.id)}
                                >
                                  <span className="text-gray-600">{report.name}</span>
                                  <span className="text-sm text-gray-500">
                                    Score: {report.overallScore}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">No reports found</p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 