import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { verifyReq } from '@/utils/jwt';
import { prisma } from '@/utils/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { payload, privateKey, useCurrentUserKey } = body;

    let actualPrivateKey = privateKey;

    // 현재 로그인된 사용자의 Private Key 사용
    if (useCurrentUserKey) {
      const user = await verifyReq(request);
      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const contractor = await prisma.contractor.findUnique({
        where: { identy: user.identy },
        select: { privateKey: true }
      });

      if (!contractor?.privateKey) {
        return NextResponse.json(
          { error: 'Private key not found for current user' },
          { status: 400 }
        );
      }

      actualPrivateKey = contractor.privateKey;
    }

    if (!payload || !actualPrivateKey) {
      return NextResponse.json(
        { error: 'Payload and private key are required' },
        { status: 400 }
      );
    }

    // Ensure payload has required fields
    if (!payload.identy || !payload.type || !payload.sub || !payload.name) {
      return NextResponse.json(
        { error: 'Invalid payload. Required fields: identy, type, sub, name' },
        { status: 400 }
      );
    }

    // Add iat if not present
    if (!payload.iat) {
      payload.iat = Math.floor(Date.now() / 1000);
    }

    // Add exp if not present (default 24 hours)
    if (!payload.exp) {
      payload.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
    }

    try {
      const token = jwt.sign(payload, actualPrivateKey, { algorithm: 'RS256' });
      
      return NextResponse.json({
        token,
        payload,
      });
    } catch (signError) {
      console.error('Token signing error:', signError);
      return NextResponse.json(
        { error: 'Failed to sign token. Please check your private key format.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}