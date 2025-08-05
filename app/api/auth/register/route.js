import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { hashPwd, genEmailToken } from '@/utils/password';
import { genKeyPair } from '@/utils/jwt';
import { sendVerificationEmail } from '@/utils/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, identy, origin } = body;

    if (!email || !password || !identy) {
      return NextResponse.json(
        { error: 'Email, password, and identity are required' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.contractor.findFirst({
      where: {
        OR: [
          { email },
          { identy }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email or identity already exists' },
        { status: 409 }
      );
    }

    const { hash, salt } = await hashPwd(password);
    const { publicKey, privateKey } = await genKeyPair();
    const emailToken = genEmailToken();
    const emailExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const contractor = await prisma.contractor.create({
      data: {
        email,
        password: hash,
        passwordSalt: salt,
        identy,
        publicKey,
        privateKey,
        emailToken,
        emailExpires,
        certified: process.env.NODE_ENV === 'development' ? true : false,
        origin: origin || 'web',
        periodTime: new Date(),
        expirationTime: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      },
      select: {
        uid: true,
        identy: true,
        email: true,
        emailToken: true
      }
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(email, emailToken);
    
    if (!emailSent) {
      console.error('Failed to send verification email to:', email);
      // Continue with registration even if email fails
      // You may want to handle this differently in production
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please check your email for verification.',
      contractor: {
        uid: contractor.uid,
        identy: contractor.identy,
        email: contractor.email
      },
      emailSent,
      // Remove in production - only for testing
      verificationToken: process.env.NODE_ENV === 'development' ? contractor.emailToken : undefined
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}