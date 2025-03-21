import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Sidebar } from '@/app/components/layout/Sidebar';
import { ChatbotUpload } from './ChatbotUpload';

export default async function ChatbotPage() {
  const session = await getSession();
  const user = session?.user;

  // Fetch user details from Prisma
  const userDetails = user ? await prisma.user.findUnique({
    where: { id: user.id },
    select: { firstName: true }
  }) : null;

  const firstName = userDetails?.firstName || 'User';

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 ml-[60px]">
        <ChatbotUpload firstName={firstName} />
      </div>
    </div>
  );
} 