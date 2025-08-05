import { NextResponse } from 'next/server';
import { verifyReq } from '@/utils/jwt';

export function withAuth(handler) {
  return async (req) => {
    const user = await verifyReq(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const authReq = req;
    authReq.user = user;
    
    return handler(authReq);
  };
}

export function withOptAuth(handler) {
  return async (req) => {
    const user = await verifyReq(req);
    
    const authReq = req;
    authReq.user = user || undefined;
    
    return handler(authReq);
  };
}

export function withAdmin(handler) {
  return async (req) => {
    const user = await verifyReq(req);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.type !== 'teacher') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const authReq = req;
    authReq.user = user;
    
    return handler(authReq);
  };
}