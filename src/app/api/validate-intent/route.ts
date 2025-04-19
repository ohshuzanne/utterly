import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { intent, chatbotId } = await request.json();

    if (!intent || !chatbotId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the chatbot configuration
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
    });

    if (!chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    // Here you would typically call your chatbot's API to validate the intent
    // For now, we'll simulate a more detailed validation response
    const isValid = intent.length > 10; // Simple validation for demo
    const message = isValid 
      ? `The chatbot understands that you want to ${intent.toLowerCase()}. It will use this understanding to better answer related questions.`
      : 'The intent is too vague. Please provide more specific details about what you want the chatbot to understand.';

    return NextResponse.json({
      isValid,
      message,
      confidence: isValid ? 0.95 : 0.45,
      suggestions: isValid ? [] : [
        'Add more specific details about the context',
        'Include examples of what you want the chatbot to understand',
        'Specify the type of information you are looking for'
      ]
    });
  } catch (error) {
    console.error('Error validating intent:', error);
    return NextResponse.json(
      { error: 'Failed to validate intent' },
      { status: 500 }
    );
  }
} 