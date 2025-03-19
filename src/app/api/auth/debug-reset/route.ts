import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get('email');
    const action = url.searchParams.get('action') || 'create';

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'create') {
      // Generate a token
      const token = randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 3600000); // 1 hour from now

      // Try to create a token
      try {
        const newToken = await prisma.verificationToken.create({
          data: {
            identifier: user.id,
            token,
            expires,
          },
        });

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const resetUrl = `${baseUrl}/reset-password?token=${token}`;

        return NextResponse.json({
          success: true, 
          user, 
          token: newToken,
          resetUrl
        });
      } catch (error) {
        return NextResponse.json({ 
          error: 'Could not create token', 
          details: error instanceof Error ? error.message : String(error) 
        }, { status: 500 });
      }
    } else if (action === 'list') {
      // List all tokens for this user
      const tokens = await prisma.verificationToken.findMany({
        where: {
          identifier: user.id
        }
      });

      return NextResponse.json({ success: true, tokens });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Debug token error:', error);
    return NextResponse.json({
      error: 'Error in debug endpoint',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 