import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import TeamsClient from './TeamsClient';

export default async function TeamsPage() {
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

  return <TeamsClient user={{
    id: user.id,
    name: `${user.firstName}`.trim(),
    email: user.email,
  }} />;
} 