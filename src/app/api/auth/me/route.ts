import { NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const user = await authenticate(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('[GET_USER_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 