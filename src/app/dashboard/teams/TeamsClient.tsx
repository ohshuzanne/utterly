'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Header } from '@/app/components/layout/Header';
import { Sidebar } from '@/app/components/layout/Sidebar';
import { Loader2, Plus, Users, ChevronRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  members: {
    id: string;
    role: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  }[];
  projects: {
    id: string;
    name: string;
  }[];
}

interface TeamsClientProps {
  user: User;
}

export default function TeamsClient({ user }: TeamsClientProps) {
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeam.name.trim()) {
      toast({
        title: "Error",
        description: "Team name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTeam,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create team');
      }

      const createdTeam = await response.json();
      setTeams([...teams, createdTeam]);
      setNewTeam({ name: '', description: '' });
      toast({
        title: "Success",
        description: "Team created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="ml-[60px] flex h-screen">
        <Sidebar />
        <div className="flex-1">
          <Header userName={user.name} />
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-[60px] flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header userName={user.name} />
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Teams</h1>
              <Dialog>
                <DialogTrigger asChild>
                <Button className="w-[-26px] bg-[#8b5cf6] text-white">
                        <Plus className="w-4 h-4 mr-2" />
                    Create Team
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Team</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium">
                        Team Name
                      </label>
                      <Input
                        id="name"
                        value={newTeam.name}
                        onChange={(e) =>
                          setNewTeam({ ...newTeam, name: e.target.value })
                        }
                        placeholder="Enter team name"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        value={newTeam.description}
                        onChange={(e) =>
                          setNewTeam({ ...newTeam, description: e.target.value })
                        }
                        placeholder="Enter team description"
                      />
                    </div>
                    <Button onClick={handleCreateTeam} className="w-full bg-[#8b5cf6] text-white">
                      Create Team
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {teams.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Teams Found</h2>
                <p className="text-gray-500 mb-4">You don&apos;t belong to any teams yet.</p>
                <Dialog>
                  <DialogTrigger asChild>
                  <Button className="w-[-40px] bg-[#8b5cf6] text-white" >
                        <Plus className="w-4 h-4 mr-2" />
                      Create Your First Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Team</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium">
                          Team Name
                        </label>
                        <Input
                          id="name"
                          value={newTeam.name}
                          onChange={(e) =>
                            setNewTeam({ ...newTeam, name: e.target.value })
                          }
                          placeholder="Enter team name"
                        />
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium">
                          Description
                        </label>
                        <Textarea
                          id="description"
                          value={newTeam.description}
                          onChange={(e) =>
                            setNewTeam({ ...newTeam, description: e.target.value })
                          }
                          placeholder="Enter team description"
                        />
                      </div>
                      <Button onClick={handleCreateTeam} className="w-full bg-[#8b5cf6] text-white">
                        Create Team
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team) => (
                  <Card
                    key={team.id}
                    className="p-4 hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">{team.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 mb-4">{team.description}</p>
                      
                      {/* member avatars */}
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Members</h3>
                        <div className="flex items-center">
                          <div className="flex -space-x-2">
                            {team.members.slice(0, 3).map((member, index) => {
                              const colors = ['#d3ffb8', '#ccacff', 'white'];
                              const color = colors[index % colors.length];
                              const initials = `${member.user.firstName[0]}${member.user.lastName[0]}`;
                              return (
                                <div
                                  key={member.id}
                                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium"
                                  style={{ backgroundColor: color }}
                                >
                                  {initials}
                                </div>
                              );
                            })}
                            {team.members.length > 3 && (
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium">
                                +{team.members.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">
                            {team.members.length} members
                          </span>
                        </div>
                      </div>

                      {/* project counts */}
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Projects</h3>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-sm font-medium">{team.projects.length}</span>
                          </div>
                          <span className="ml-2 text-sm text-gray-500">
                            {team.projects.length} {team.projects.length === 1 ? 'project' : 'projects'}
                          </span>
                        </div>
                      </div>

                      {/* view team button */}
                      <Button
                        onClick={() => router.push(`/dashboard/teams/${team.id}`)}
                        className="w-full bg-[#8b5cf6] text-white hover:bg-[#7c4dff]"
                      >
                        View Team
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 