import { NextResponse } from 'next/server';
import { genKeyPair } from '@/utils/jwt';

export async function POST() {
  try {
    const { publicKey, privateKey } = await genKeyPair();
    
    return NextResponse.json({
      publicKey,
      privateKey,
    });
  } catch (error) {
    console.error('Key generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate key pair' },
      { status: 500 }
    );
  }
}