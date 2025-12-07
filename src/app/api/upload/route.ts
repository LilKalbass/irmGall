import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { promises as fs } from 'fs';
import path from 'path';
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
 * Upload directory path
 */
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

/**
 * Ensure upload directory exists
 */
async function ensureUploadDir(): Promise<void> {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

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
 * Handle file upload
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
    
    // Ensure upload directory exists
    await ensureUploadDir();
    
    // Generate unique filename
    const extension = getExtension(file.type);
    const filename = `${uuidv4()}${extension}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    
    // Read file content
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Write file
    await fs.writeFile(filepath, buffer);
    
    // Return the URL (relative to public directory)
    const url = `/uploads/${filename}`;
    
    return NextResponse.json({
      success: true,
      data: { url, filename },
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
 * Delete an uploaded file
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
    
    // Get filename from query params
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    
    if (!filename) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Filename is required' },
        { status: 400 }
      );
    }
    
    // Validate filename (security: prevent path traversal)
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Invalid filename' },
        { status: 400 }
      );
    }
    
    const filepath = path.join(UPLOAD_DIR, filename);
    
    // Check if file exists
    try {
      await fs.access(filepath);
    } catch {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }
    
    // Delete file
    await fs.unlink(filepath);
    
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

