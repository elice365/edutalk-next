import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from './prisma';

export async function genKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  return { publicKey, privateKey };
}

export async function sign(payload, privateKey) {
  const tokenPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  };

  return jwt.sign(tokenPayload, privateKey, { algorithm: 'RS256' });
}

export async function verify(token, identy) {
  try {
    const contractor = await prisma.contractor.findUnique({
      where: { identy },
      select: { publicKey: true }
    });

    if (!contractor?.publicKey) {
      return null;
    }

    const decoded = jwt.verify(token, contractor.publicKey, { 
      algorithms: ['RS256']
    });

    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function extractToken(authHeader) {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}

export async function verifyReq(request) {
  const authHeader = request.headers.get('Authorization');
  const token = extractToken(authHeader || undefined);
  
  if (!token) {
    return null;
  }

  try {
    const decodedForIdenty = jwt.decode(token);
    if (!decodedForIdenty?.identy) {
      return null;
    }

    return await verify(token, decodedForIdenty.identy);
  } catch (error) {
    console.error('Token extraction/verification failed:', error);
    return null;
  }
}