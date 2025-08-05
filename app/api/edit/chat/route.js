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
    const { type, id, name, studentID, studentName } = body;
    const { identy, sub: instructorID, name: instructorName } = req.user;

    switch (type) {
      case 'create': {
        if (!id || !name) {
          return NextResponse.json(
            { error: 'Student ID and name are required' },
            { status: 400 }
          );
        }

        // Check if chat already exists
        const existingChat = await prisma.chat.findFirst({
          where: {
            identy,
            instructorID,
            studentID: id
          }
        });

        if (existingChat) {
          return NextResponse.json({
            success: true,
            message: 'Chat already exists',
            chat: existingChat
          });
        }

        const now = new Date();
        const chat = await prisma.chat.create({
          data: {
            identy,
            instructorID,
            instructorName: instructorName,
            studentID: id,
            studentName: name,
            lastChat: 'Send a message to start the conversation',
            lastChatSender: null,
            createTime: now,
            updateTime: now
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Chat created successfully',
          chat
        });
      }

      case 'delete': {
        if (!id) {
          return NextResponse.json(
            { error: 'Chat ID is required' },
            { status: 400 }
          );
        }

        const chat = await prisma.chat.findUnique({
          where: { uid: id }
        });

        if (!chat || chat.identy !== identy) {
          return NextResponse.json(
            { error: 'Chat not found' },
            { status: 404 }
          );
        }

        // Only allow instructor to delete their own chats
        if (chat.instructorID !== instructorID) {
          return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
          );
        }

        await prisma.chat.delete({
          where: { uid: id }
        });

        return NextResponse.json({
          success: true,
          message: 'Chat deleted successfully'
        });
      }

      case 'bulk-create': {
        if (!studentID || !studentName) {
          return NextResponse.json(
            { error: 'Student ID and name arrays are required' },
            { status: 400 }
          );
        }

        if (!Array.isArray(studentID) || !Array.isArray(studentName)) {
          return NextResponse.json(
            { error: 'Student ID and name must be arrays' },
            { status: 400 }
          );
        }

        if (studentID.length !== studentName.length) {
          return NextResponse.json(
            { error: 'Student ID and name arrays must have the same length' },
            { status: 400 }
          );
        }

        const chatsToCreate = [];
        for (let i = 0; i < studentID.length; i++) {
          // Check if chat already exists
          const existingChat = await prisma.chat.findFirst({
            where: {
              identy,
              instructorID,
              studentID: studentID[i]
            }
          });

          if (!existingChat) {
            chatsToCreate.push({
              identy,
              instructorID,
              instructorName,
              studentID: studentID[i],
              studentName: studentName[i],
              lastChat: 'Send a message to start the conversation',
              lastChatSender: null
            });
          }
        }

        if (chatsToCreate.length > 0) {
          const chats = await prisma.chat.createMany({
            data: chatsToCreate
          });

          return NextResponse.json({
            success: true,
            message: `Created ${chats.count} chats`,
            count: chats.count
          });
        }

        return NextResponse.json({
          success: true,
          message: 'All chats already exist',
          count: 0
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid operation type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Edit chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withAdmin(handler);