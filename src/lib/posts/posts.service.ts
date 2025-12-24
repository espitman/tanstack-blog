import { db } from '@/db'
import { posts } from '@/db/schema'
import { eq, desc, ne } from 'drizzle-orm'
import type { Post, NewPost } from './posts.types'

/**
 * Fetch all posts
 */
export async function getAllPosts(): Promise<Post[]> {
  return await db.select().from(posts).orderBy(desc(posts.createdAt))
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1)
  return result[0] || null
}

/**
 * Create a new post
 */
export async function createPost(data: NewPost): Promise<Post> {
  const [newPost] = await db.insert(posts).values(data).returning()
  return newPost
}

/**
 * Update an existing post
 */
export async function updatePost(
  slug: string,
  data: { title: string; content: string; imageUrl?: string; newSlug?: string }
): Promise<Post> {
  const { newSlug, ...updateData } = data
  const updateSlug = newSlug || slug

  const [updatedPost] = await db
    .update(posts)
    .set({ ...updateData, slug: updateSlug })
    .where(eq(posts.slug, slug))
    .returning()

  return updatedPost
}

/**
 * Fetch latest posts excluding current post
 */
export async function getLatestPosts(excludeSlug: string, limit: number = 5): Promise<Post[]> {
  return await db
    .select()
    .from(posts)
    .where(ne(posts.slug, excludeSlug))
    .orderBy(desc(posts.createdAt))
    .limit(limit)
}

