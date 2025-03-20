import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, apiKey } = await req.json();

    if (!name || !apiKey) {
      return NextResponse.json(
        { error: 'Name and API key are required' },
        { status: 400 }
      );
    }

    // Create new chatbot
    const chatbot = await prisma.chatbot.create({
      data: {
        name,
        apiKey,
        apiEndpoint: 'https://api.openai.com/v1/chat/completions', // Default endpoint, can be made configurable later
        userId: session.user.id,
      },
    });

    return NextResponse.json({ chatbot }, { status: 201 });
  } catch (error) {
    console.error('Error creating chatbot:', error);
    return NextResponse.json(
      { error: 'Failed to create chatbot' },
      { status: 500 }
    );
  }
} 