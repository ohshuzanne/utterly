import { NextResponse } from 'next/server';
import { generateUtterances } from '@/lib/gemini';

export async function GET(req: Request) {
  try {
    const result = await generateUtterances("What does Hilti as a company do?", 10);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error testing Gemini:', error);
    return NextResponse.json(
      { error: 'Failed to test Gemini API', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const result = await generateUtterances(question, 5);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error testing Gemini:', error);
    return NextResponse.json(
      { error: 'Failed to test Gemini API' },
      { status: 500 }
    );
  }
} 