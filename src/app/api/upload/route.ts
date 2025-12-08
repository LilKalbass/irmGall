import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '@/lib/auth';
import type { ApiResponse } from '@/types/photo';

/**
 * Check if we have Vercel Blob token
 */
const HAS_BLOB_TOKEN = !!process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Local upload directory
 */
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

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
 * Ensure local upload directory exists
 */
async function ensureLocalUploadDir(): Promise<void> {
  try {
    await fs.access(LOCAL_UPLOAD_DIR);
  } catch {
    await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Upload to local filesystem
 */
async function uploadLocal(file: File, filename: string): Promise<string> {
  await ensureLocalUploadDir();
  
  const filepath = path.join(LOCAL_UPLOAD_DIR, filename);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  await fs.writeFile(filepath, buffer);
  
  return `/uploads/${filename}`;
}

/**
 * Upload to Vercel Blob
 */
async function uploadBlob(file: File, filename: string): Promise<string> {
  const { put } = await import('@vercel/blob');
  
  const blob = await put(filename, file, {
    access: 'public',
    addRandomSuffix: false,
  });
  
  return blob.url;
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
    
    // Generate unique filename
    const extension = getExtension(file.type);
    const filename = `${uuidv4()}${extension}`;
    
    // Upload based on environment
    const url = HAS_BLOB_TOKEN 
      ? await uploadBlob(file, filename)
      : await uploadLocal(file, filename);
    
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
    
    const { searchParams } = new URL(request.url);
    
    if (HAS_BLOB_TOKEN) {
      // Delete from Vercel Blob
      const url = searchParams.get('url');
      if (!url) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'URL is required' },
          { status: 400 }
        );
      }
      
      const { del } = await import('@vercel/blob');
      await del(url);
    } else {
      // Delete from local filesystem
      const filename = searchParams.get('filename');
      if (!filename) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Filename is required' },
          { status: 400 }
        );
      }
      
      // Security: prevent path traversal
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: 'Invalid filename' },
          { status: 400 }
        );
      }
      
      const filepath = path.join(LOCAL_UPLOAD_DIR, filename);
      await fs.unlink(filepath);
    }
    
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
