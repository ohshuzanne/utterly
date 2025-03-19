import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    // Set up the transporter with the configuration
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

    // Prepare the test email
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@utterly.io',
      to: process.env.EMAIL_SERVER_USER, // Send to yourself for testing
      subject: 'Test Email from Utterly',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email to verify that email sending is working correctly.</p>
        <p>Current configuration:</p>
        <ul>
          <li>EMAIL_SERVER_USER: ${process.env.EMAIL_SERVER_USER}</li>
          <li>EMAIL_FROM: ${process.env.EMAIL_FROM}</li>
          <li>NEXTAUTH_URL: ${process.env.NEXTAUTH_URL}</li>
        </ul>
      `
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      info: {
        messageId: info.messageId,
        response: info.response
      }
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        error: 'Error sending test email',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 