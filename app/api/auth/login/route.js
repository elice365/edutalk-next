import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyPwd } from '@/utils/password';
import { sign } from '@/utils/jwt';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const contractor = await prisma.contractor.findUnique({
      where: { email },
      select: {
        uid: true,
        identy: true,
        email: true,
        password: true,
        privateKey: true,
        certified: true,
        expirationTime: true
      }
    });

    if (!contractor) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await verifyPwd(password, contractor.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!contractor.certified) {
      return NextResponse.json(
        { error: 'Email not verified' },
        { status: 403 }
      );
    }

    if (contractor.expirationTime && new Date() > contractor.expirationTime) {
      return NextResponse.json(
        { error: 'Contract expired' },
        { status: 403 }
      );
    }

    if (!contractor.privateKey) {
      return NextResponse.json(
        { error: 'Authentication keys not configured' },
        { status: 500 }
      );
    }

    const token = await sign(
      {
        identy: contractor.identy,
        type: 'teacher', // Default to teacher for login
        sub: contractor.uid,
        email: contractor.email,
        name: contractor.email.split('@')[0]
      },
      contractor.privateKey
    );

    return NextResponse.json({
      success: true,
      token,
      contractor: {
        uid: contractor.uid,
        identy: contractor.identy,
        email: contractor.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}