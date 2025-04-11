import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      name, 
      apiKey, 
      apiEndpoint, 
      modelName, 
      temperature, 
      maxTokens, 
      topP, 
      frequencyPenalty, 
      presencePenalty, 
      stopSequences 
    } = await req.json();

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
        apiEndpoint: apiEndpoint || 'https://api.openai.com/v1/chat/completions',
        modelName,
        temperature: temperature ? parseFloat(temperature) : 0.7,
        maxTokens: maxTokens ? parseInt(maxTokens) : 1000,
        topP: topP ? parseFloat(topP) : 1.0,
        frequencyPenalty: frequencyPenalty ? parseFloat(frequencyPenalty) : 0.0,
        presencePenalty: presencePenalty ? parseFloat(presencePenalty) : 0.0,
        stopSequences,
        userId: session.user.id
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