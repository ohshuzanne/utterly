import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      password,
      position,
      company,
      accountPurpose,
      experienceLevel,
    } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user with any type to bypass TypeScript limitations
    await prisma.$executeRawUnsafe(`
      INSERT INTO "User" (
        id, email, password, "firstName", "lastName", position, company, "accountPurpose", "experienceLevel", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()
      )
    `, 
    `cuid_${Date.now()}`, 
    email, 
    hashedPassword, 
    firstName || null, 
    lastName || null, 
    position || null, 
    company || null, 
    accountPurpose || null, 
    experienceLevel || null);

    // Get the newly created user (without password)
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        position: true,
        company: true,
        accountPurpose: true,
        experienceLevel: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new Error("Failed to create user");
    }

    return NextResponse.json(
      { user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    );
  }
} 