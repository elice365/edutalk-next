import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { hashPwd, genEmailToken } from '@/utils/password';
import { sendPasswordResetEmail } from '@/utils/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, token, newPassword } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Request password reset
    if (!token && !newPassword) {
      const contractor = await prisma.contractor.findUnique({
        where: { email },
        select: { uid: true, email: true }
      });

      if (!contractor) {
        // Don't reveal if email exists
        return NextResponse.json({
          success: true,
          message: 'If the email exists, a reset link has been sent.'
        });
      }

      const resetToken = genEmailToken();
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.contractor.update({
        where: { email },
        data: {
          emailToken: resetToken,
          emailExpires: resetExpires
        }
      });

      // Send password reset email
      const emailSent = await sendPasswordResetEmail(email, resetToken);
      
      if (!emailSent) {
        console.error('Failed to send reset email to:', email);
      }

      return NextResponse.json({
        success: true,
        message: 'Password reset email sent.',
        emailSent,
        // Remove in production - only for testing
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      });
    }

    // Reset password with token
    if (token && newPassword) {
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
          { error: 'Invalid or expired token' },
          { status: 400 }
        );
      }

      const { hash, salt } = await hashPwd(newPassword);

      await prisma.contractor.update({
        where: { email },
        data: {
          password: hash,
          passwordSalt: salt,
          emailToken: null,
          emailExpires: null
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Password reset successful.'
      });
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}