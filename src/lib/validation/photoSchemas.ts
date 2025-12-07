import { z } from 'zod';

/**
 * Schema for creating a new photo
 */
export const createPhotoSchema = z.object({
  imageUrl: z.string().min(1, 'Image URL is required'),
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  description: z.string()
    .max(500, 'Description must be 500 characters or less')
    .optional(),
  dateTaken: z.string().optional(),
  tags: z.array(z.string().max(30)).max(10).optional().default([]),
  isFavorite: z.boolean().optional().default(false),
  frameColor: z.enum(['white', 'cream', 'pink', 'lavender', 'mint', 'peach'])
    .optional()
    .default('white'),
});

/**
 * Schema for updating an existing photo
 */
export const updatePhotoSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less')
    .optional(),
  description: z.string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .nullable(),
  dateTaken: z.string().optional().nullable(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  isFavorite: z.boolean().optional(),
  frameColor: z.enum(['white', 'cream', 'pink', 'lavender', 'mint', 'peach'])
    .optional(),
  position: z.number().int().min(0).optional(),
});

/**
 * Schema for query parameters when fetching photos
 */
export const photoQuerySchema = z.object({
  search: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
  favoritesOnly: z.enum(['true', 'false']).optional(),
  sort: z.enum([
    'dateAdded-desc',
    'dateAdded-asc',
    'dateTaken-desc',
    'dateTaken-asc',
    'title-asc',
    'title-desc',
    'favorites-first',
  ]).optional().default('dateAdded-desc'),
  page: z.string().regex(/^\d+$/).optional().default('1'),
  limit: z.string().regex(/^\d+$/).optional().default('50'),
});

/**
 * Type exports
 */
export type CreatePhotoInput = z.infer<typeof createPhotoSchema>;
export type UpdatePhotoInput = z.infer<typeof updatePhotoSchema>;
export type PhotoQueryParams = z.infer<typeof photoQuerySchema>;

