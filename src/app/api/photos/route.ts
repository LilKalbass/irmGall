import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAllPhotos, createPhoto, getAllTags } from '@/lib/photoStorage';
import { createPhotoSchema, photoQuerySchema } from '@/lib/validation/photoSchemas';
import type { PhotoFilters, PhotoSortOption, ApiResponse } from '@/types/photo';

/**
 * GET /api/photos
 * 
 * Fetch all photos with optional filtering and sorting
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryResult = photoQuerySchema.safeParse(Object.fromEntries(searchParams));
    
    if (!queryResult.success) {
      return NextResponse.json<ApiResponse<null>>(
        { 
          success: false, 
          error: 'Invalid query parameters',
          message: queryResult.error.message,
        },
        { status: 400 }
      );
    }
    
    const query = queryResult.data;
    
    // Build filters
    const filters: PhotoFilters = {};
    
    if (query.search) {
      filters.search = query.search;
    }
    
    if (query.tags) {
      filters.tags = query.tags.split(',').map((t) => t.trim());
    }
    
    if (query.favoritesOnly === 'true') {
      filters.favoritesOnly = true;
    }
    
    // Fetch photos
    const photos = await getAllPhotos(filters, query.sort as PhotoSortOption);
    
    // Get all tags for filter suggestions
    const allTags = await getAllTags();
    
    // Pagination
    const page = parseInt(query.page, 10);
    const limit = parseInt(query.limit, 10);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPhotos = photos.slice(startIndex, endIndex);
    
    return NextResponse.json({
      success: true,
      data: {
        photos: paginatedPhotos,
        total: photos.length,
        page,
        limit,
        totalPages: Math.ceil(photos.length / limit),
        allTags,
      },
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/photos
 * 
 * Create a new photo
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
    
    // Parse request body
    const body = await request.json();
    const validationResult = createPhotoSchema.safeParse(body);
    
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
    
    // Create photo
    const photo = await createPhoto(validationResult.data);
    
    return NextResponse.json({
      success: true,
      data: photo,
      message: 'Photo created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating photo:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to create photo' },
      { status: 500 }
    );
  }
}

