import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import TeamDetailsClient from './TeamDetailsClient';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  name: string;
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

export default async function TeamPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
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
    return null;
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
        include: {
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
      posts: {
        include: {
          author: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          comments: {
            include: {
              author: {
                include: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!team) {
    return null;
  }

  const userProjects = await prisma.project.findMany({
    where: {
      userId: user.id,
      NOT: {
        teamId: {
          not: null,
        },
      },
    },
    include: {
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
  });

  const currentUser: User = {
    ...user,
    name: `${user.firstName} ${user.lastName}`.trim(),
  };

  return (
    <TeamDetailsClient
      team={team}
      currentUser={currentUser}
      userProjects={userProjects}
    />
  );
} 