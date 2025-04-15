import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { type, content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = '';
    if (type === 'question') {
      prompt = `Please enhance the following question to make it clearer and more specific. 
      Keep the same meaning but improve its quality and clarity. 
      Return only the enhanced question without any additional text.
      
      Question: ${content}`;
    } else if (type === 'answer') {
      prompt = `Please enhance the following answer to make it more comprehensive and accurate. 
      Keep the same meaning but improve its quality and clarity. 
      Return only the enhanced answer without any additional text.
      
      Answer: ${content}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const enhancedContent = response.text();

    return NextResponse.json({ enhancedContent });
  } catch (error) {
    console.error('Error enhancing content:', error);
    return NextResponse.json(
      { error: 'Failed to enhance content' },
      { status: 500 }
    );
  }
} 