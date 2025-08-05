import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { withOptAuth } from '@/middleware/auth';

async function handler(req) {
  try {
    const url = new URL(req.url);
    const identy = url.searchParams.get('identy');

    if (!identy) {
      return NextResponse.json(
        { error: 'Identity parameter is required' },
        { status: 400 }
      );
    }

    // Get public notices for the specified contractor
    const notices = await prisma.notice.findMany({
      where: {
        identy,
        delete: false,
        OR: [
          { expirationTime: null },
          { expirationTime: { gte: new Date() } }
        ]
      },
      orderBy: [
        { displayOrder: 'desc' },
        { createTime: 'desc' }
      ],
      select: {
        uid: true,
        title: true,
        context: true,
        createTime: true,
        updateTime: true,
        displayOrder: true
      }
    });

    return NextResponse.json({
      success: true,
      notices,
      user: req.user ? {
        identy: req.user.identy,
        type: req.user.type,
        name: req.user.name
      } : null
    });
  } catch (error) {
    console.error('Notice API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withOptAuth(handler);