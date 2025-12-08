import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPhotoById, updatePhoto, deletePhoto } from '@/lib/photoStorage';
import { updatePhotoSchema } from '@/lib/validation/photoSchemas';
import type { ApiResponse } from '@/types/photo';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/photos/[id]
 * 
 * Fetch a single photo by ID
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await context.params;
    const photo = await getPhotoById(id);
    
    if (!photo) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Photo not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: photo,
    });
  } catch (error) {
    console.error('Error fetching photo:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch photo' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/photos/[id]
 * 
 * Update an existing photo
 */
export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await context.params;
    
    // Check if photo exists
    const existingPhoto = await getPhotoById(id);
    if (!existingPhoto) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Photo not found' },
        { status: 404 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validationResult = updatePhotoSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Invalid photo data',
          message: validationResult.error.errors[0]?.message,
        },
        { status: 400 }
      );
    }
    
    // Transform null values to undefined for compatibility
    const updateData = {
      ...validationResult.data,
      description: validationResult.data.description ?? undefined,
      dateTaken: validationResult.data.dateTaken ?? undefined,
    };
    
    // Update photo
    const updatedPhoto = await updatePhoto(id, updateData);
    
    return NextResponse.json({
      success: true,
      data: updatedPhoto,
      message: 'Photo updated successfully',
    });
  } catch (error) {
    console.error('Error updating photo:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to update photo' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/photos/[id]
 * 
 * Delete a photo
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await context.params;
    
    // Check if photo exists
    const existingPhoto = await getPhotoById(id);
    if (!existingPhoto) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Photo not found' },
        { status: 404 }
      );
    }
    
    // Delete photo
    const deleted = await deletePhoto(id);
    
    if (!deleted) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Failed to delete photo' },
        { status: 500 }
      );
    }
    
    // TODO: Also delete the image file from /public/uploads
    // This would require tracking the original file path
    
    return NextResponse.json({
      success: true,
      message: 'Photo deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}

