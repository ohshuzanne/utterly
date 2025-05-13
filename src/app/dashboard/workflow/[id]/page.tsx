import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import WorkflowBuilder from '../WorkflowBuilder';

interface WorkflowPageProps {
  params: {
    id: string;
  };
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect('/login');
  }

  const project = await prisma.project.findUnique({
    where: { 
      id: params.id,
      userId: user.id 
    },
    include: {
      workflows: true
    }
  });

  if (!project) {
    redirect('/dashboard/workflow');
  }

  const firstName = user.firstName || 'User';

  return <WorkflowBuilder firstName={firstName} projectId={project.id} projectName={project.name} />;
} 