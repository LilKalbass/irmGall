import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { put, del } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '@/lib/auth';
import type { ApiResponse } from '@/types/photo';

/**
 * Allowed file types for upload
 */
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

/**
 * Maximum file size (10MB)
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Get file extension from MIME type
 */
function getExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
  };
  return extensions[mimeType] || '.jpg';
}

/**
 * POST /api/upload
 * 
 * Handle file upload to Vercel Blob Storage
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json<ApiResponse<null>>(
        { 
          success: false, 
          error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' 
        },
        { status: 400 }
      );
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json<ApiResponse<null>>(
        { 
          success: false, 
          error: 'File too large. Maximum size is 10MB' 
        },
        { status: 400 }
      );
    }
    
    // Generate unique filename
    const extension = getExtension(file.type);
    const filename = `${uuidv4()}${extension}`;
    
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });
    
    return NextResponse.json({
      success: true,
      data: { url: blob.url, filename },
      message: 'File uploaded successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/upload
 * 
 * Delete an uploaded file from Vercel Blob Storage
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get URL from query params
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }
    
    // Delete from Vercel Blob
    await del(url);
    
    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
