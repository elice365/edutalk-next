import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { withAuth } from '@/middleware/auth';

/**
 * GET /api/profile/avatar
 * Get user's current avatar URL
 */
async function getHandler(req) {
  if (!req.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { sub: userId } = req.user;

    const contractor = await prisma.contractor.findUnique({
      where: { uid: userId },
      select: { avatar: true, name: true, email: true }
    });

    if (!contractor) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      avatar: contractor.avatar,
      name: contractor.name,
      email: contractor.email
    });
  } catch (error) {
    console.error('Failed to get avatar:', error);
    return NextResponse.json(
      { error: 'Failed to get avatar' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/profile/avatar
 * Upload or update user's avatar
 *
 * Accepts either:
 * 1. multipart/form-data with 'avatar' file
 * 2. JSON with 'avatarUrl' string (for external URLs)
 */
async function postHandler(req) {
  if (!req.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { sub: userId } = req.user;
    const contentType = req.headers.get('content-type') || '';
    let avatarUrl;

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await req.formData();
      const avatarFile = formData.get('avatar');

      if (!avatarFile || !(avatarFile instanceof File)) {
        return NextResponse.json(
          { error: 'Avatar file is required' },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(avatarFile.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
          { status: 400 }
        );
      }

      // Validate file size (max 2MB)
      const MAX_SIZE = 2 * 1024 * 1024;
      if (avatarFile.size > MAX_SIZE) {
        return NextResponse.json(
          { error: 'File too large. Maximum size is 2MB.' },
          { status: 400 }
        );
      }

      // Convert to Base64 for storage
      // TODO: In production, upload to cloud storage (S3, Cloudinary) and store URL instead
      const arrayBuffer = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      avatarUrl = `data:${avatarFile.type};base64,${base64}`;
    } else {
      // Handle URL input (JSON)
      const body = await req.json();
      avatarUrl = body.avatarUrl;

      if (!avatarUrl || typeof avatarUrl !== 'string') {
        return NextResponse.json(
          { error: 'avatarUrl is required' },
          { status: 400 }
        );
      }

      // Validate URL format
      if (!avatarUrl.startsWith('http://') &&
          !avatarUrl.startsWith('https://') &&
          !avatarUrl.startsWith('data:image/')) {
        return NextResponse.json(
          { error: 'Invalid avatar URL format' },
          { status: 400 }
        );
      }
    }

    // Update avatar in database
    const updatedContractor = await prisma.contractor.update({
      where: { uid: userId },
      data: { avatar: avatarUrl },
      select: { avatar: true, name: true, email: true }
    });

    return NextResponse.json({
      success: true,
      message: 'Avatar updated successfully',
      avatar: updatedContractor.avatar,
      name: updatedContractor.name,
      email: updatedContractor.email
    });
  } catch (error) {
    console.error('Failed to update avatar:', error);
    return NextResponse.json(
      { error: 'Failed to update avatar' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/profile/avatar
 * Remove user's avatar
 */
async function deleteHandler(req) {
  if (!req.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { sub: userId } = req.user;

    await prisma.contractor.update({
      where: { uid: userId },
      data: { avatar: null }
    });

    return NextResponse.json({
      success: true,
      message: 'Avatar removed successfully'
    });
  } catch (error) {
    console.error('Failed to delete avatar:', error);
    return NextResponse.json(
      { error: 'Failed to delete avatar' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getHandler);
export const POST = withAuth(postHandler);
export const DELETE = withAuth(deleteHandler);
