import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardClient } from './DashboardClient';

export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user;

  // fetch user details from the database
  const userDetails = user ? await prisma.user.findUnique({
    where: { id: user.id },
    select: { firstName: true }
  }) : null;

  const firstName = userDetails?.firstName || 'User';

  return <DashboardClient firstName={firstName} />;
} 