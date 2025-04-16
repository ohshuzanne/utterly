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
import { Plus, FolderOpen, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
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

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header userName={currentUser.name} />
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">{team.name}</h1>
            {team.description && (
              <p className="text-gray-600">{team.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Members Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                {isAdmin && (
                  <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
                    <DialogTrigger asChild>
                      <Button size="sm">
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
                        <Button onClick={handleAddMember} className="w-full">
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
                    <Button size="sm">
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
                      <Button onClick={handleAddProject} className="w-full">
                        Add Project
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {team.projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{project.name}</p>
                        {project.description && (
                          <p className="text-sm text-gray-500">{project.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/dashboard/workflow/${project.id}`)}
                      >
                        <FolderOpen className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
} 