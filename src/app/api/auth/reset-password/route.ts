import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Find the token in the database
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date(verificationToken.expires) < new Date()) {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await hash(password, 12);

    // Update the user's password
    await prisma.user.update({
      where: { id: verificationToken.identifier },
      data: { password: hashedPassword },
    });

    // Instead of deleting the token, mark it as used by updating the expiry to a past date
    try {
      await prisma.verificationToken.update({
        where: { token },
        data: { 
          expires: new Date(Date.now() - 86400000) // Set to 1 day in the past
        },
      });
    } catch (tokenError) {
      console.error('Could not update token, but password was reset:', tokenError);
      // Continue with success response even if token update fails
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Error resetting password' },
      { status: 500 }
    );
  }
} 