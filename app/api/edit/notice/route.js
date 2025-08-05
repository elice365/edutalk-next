import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { withAdmin } from '@/middleware/auth';

async function handler(req) {
  if (!req.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { type, id, title, context, displayOrder, expirationTime } = body;
    const { identy, sub: instructorId } = req.user;

    switch (type) {
      case 'create': {
        if (!title || !context) {
          return NextResponse.json(
            { error: 'Title and context are required' },
            { status: 400 }
          );
        }

        const now = new Date();
        const notice = await prisma.notice.create({
          data: {
            title,
            context,
            identy,
            instructor: instructorId,
            displayOrder: displayOrder || 0,
            expirationTime: expirationTime ? new Date(expirationTime) : null,
            delete: false,
            createTime: now,
            updateTime: now
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Notice created successfully',
          notice
        });
      }

      case 'update': {
        if (!id) {
          return NextResponse.json(
            { error: 'Notice ID is required' },
            { status: 400 }
          );
        }

        const existingNotice = await prisma.notice.findUnique({
          where: { uid: id }
        });

        if (!existingNotice || existingNotice.identy !== identy) {
          return NextResponse.json(
            { error: 'Notice not found' },
            { status: 404 }
          );
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (context !== undefined) updateData.context = context;
        if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
        if (expirationTime !== undefined) {
          updateData.expirationTime = expirationTime ? new Date(expirationTime) : null;
        }

        const notice = await prisma.notice.update({
          where: { uid: id },
          data: updateData
        });

        return NextResponse.json({
          success: true,
          message: 'Notice updated successfully',
          notice
        });
      }

      case 'delete': {
        if (!id) {
          return NextResponse.json(
            { error: 'Notice ID is required' },
            { status: 400 }
          );
        }

        const existingNotice = await prisma.notice.findUnique({
          where: { uid: id }
        });

        if (!existingNotice || existingNotice.identy !== identy) {
          return NextResponse.json(
            { error: 'Notice not found' },
            { status: 404 }
          );
        }

        // Soft delete
        const notice = await prisma.notice.update({
          where: { uid: id },
          data: { delete: true }
        });

        return NextResponse.json({
          success: true,
          message: 'Notice deleted successfully',
          notice
        });
      }

      case 'list': {
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
          ]
        });

        return NextResponse.json({
          success: true,
          notices
        });
      }

      case 'restore': {
        if (!id) {
          return NextResponse.json(
            { error: 'Notice ID is required' },
            { status: 400 }
          );
        }

        const existingNotice = await prisma.notice.findUnique({
          where: { uid: id }
        });

        if (!existingNotice || existingNotice.identy !== identy) {
          return NextResponse.json(
            { error: 'Notice not found' },
            { status: 404 }
          );
        }

        const notice = await prisma.notice.update({
          where: { uid: id },
          data: { delete: false }
        });

        return NextResponse.json({
          success: true,
          message: 'Notice restored successfully',
          notice
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid operation type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Edit notice API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withAdmin(handler);