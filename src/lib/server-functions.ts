import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { posts } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

// Fetch all posts
export const getAllPosts = createServerFn({
  method: 'GET',
}).handler(async () => {
  const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt))
  return allPosts
})

// Fetch a single post by slug
export const getPostBySlug = createServerFn({
  method: 'GET',
})
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const post = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1)
    return post[0] || null
  })

// Create a new post
export const createPost = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { title: string; slug: string; content: string; imageUrl?: string }) => data)
  .handler(async ({ data }) => {
    const [newPost] = await db.insert(posts).values(data).returning()
    return newPost
  })

// Update an existing post
export const updatePost = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { slug: string; title: string; content: string; imageUrl?: string; newSlug?: string }) => data)
  .handler(async ({ data }) => {
    const { slug, newSlug, ...updateData } = data
    const updateSlug = newSlug || slug
    
    const [updatedPost] = await db
      .update(posts)
      .set({ ...updateData, slug: updateSlug })
      .where(eq(posts.slug, slug))
      .returning()
    
    return updatedPost
  })

