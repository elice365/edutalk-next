import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { sendWelcomeEmail } from '@/utils/email';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    const email = url.searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Token and email are required' },
        { status: 400 }
      );
    }

    const contractor = await prisma.contractor.findFirst({
      where: {
        email,
        emailToken: token,
        emailExpires: {
          gte: new Date()
        }
      }
    });

    if (!contractor) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    await prisma.contractor.update({
      where: { email },
      data: {
        certified: true,
        emailToken: null,
        emailExpires: null
      }
    });

    // Send welcome email
    const name = email.split('@')[0]; // Use email username as name
    const emailSent = await sendWelcomeEmail(email, name);
    
    if (!emailSent) {
      console.error('Failed to send welcome email to:', email);
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully. You can now login.',
      welcomeEmailSent: emailSent
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}