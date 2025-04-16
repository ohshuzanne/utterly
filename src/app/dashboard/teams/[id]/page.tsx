import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import TeamDetailsClient from './TeamDetailsClient';

interface TeamPageProps {
  params: {
    id: string;
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  const team = await prisma.team.findUnique({
    where: { id: params.id },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
      projects: {
        select: {
          id: true,
          name: true,
          description: true,
          workflows: {
            select: {
              id: true,
              name: true,
            },
          },
          reports: {
            select: {
              id: true,
              name: true,
              overallScore: true,
            },
          },
        },
      },
    },
  });

  if (!team) {
    redirect('/dashboard/teams');
  }

  // Check if user is a member of the team
  const isMember = team.members.some(member => member.userId === user.id);
  if (!isMember) {
    redirect('/dashboard/teams');
  }

  // Get user's projects that aren't already in the team
  const userProjects = await prisma.project.findMany({
    where: {
      userId: user.id,
      teamId: null,
    },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  return (
    <TeamDetailsClient
      team={team}
      currentUser={{
        id: user.id,
        name: `${user.firstName}`.trim(),
        email: user.email,
      }}
      userProjects={userProjects}
    />
  );
} 