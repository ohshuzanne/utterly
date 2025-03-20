import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch chatbots for the current user
    const chatbots = await prisma.chatbot.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ chatbots });
  } catch (error) {
    console.error('Error fetching chatbots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chatbots' },
      { status: 500 }
    );
  }
} 