import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // We don't want to reveal if the user exists or not for security
    if (!user) {
      // Just return success even if the user doesn't exist to prevent email enumeration
      return NextResponse.json(
        { success: true },
        { status: 200 }
      );
    }

    // Generate a reset token and expiry
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    // Store the token in the VerificationToken table
    await prisma.verificationToken.create({
      data: {
        identifier: user.id,
        token,
        expires,
      },
    });

    // Generate the reset link
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@utterly.io',
      to: email,
      subject: 'Password Reset for Utterly',
      html: `
        <h1>Reset Your Password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="padding: 10px 15px; background-color: #7e22ce; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    );
  }
} 