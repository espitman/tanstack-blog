import { createServerFn } from '@tanstack/react-start'
import {
  getAllPostsPaginated,
  getPostsCount,
  getPostBySlug,
  createPost,
  updatePost,
  getLatestPosts,
} from './posts.service'
import type { NewPost } from './posts.types'

// Fetch all posts (for home page or internal use, default to first 6)
export const getAllPostsFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await getAllPostsPaginated(1, 6)
})

// Fetch posts with pagination
export const getAllPostsPaginatedFn = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { page: number; pageSize: number }) => data)
  .handler(async ({ data }) => {
    const [posts, totalCount] = await Promise.all([
      getAllPostsPaginated(data.page, data.pageSize),
      getPostsCount(),
    ])
    return { posts, totalCount }
  })

// Fetch a single post by slug
export const getPostBySlugFn = createServerFn({
  method: 'GET',
})
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    return await getPostBySlug(slug)
  })

// Create a new post
export const createPostFn = createServerFn({
  method: 'POST',
})
  .inputValidator((data: NewPost) => data)
  .handler(async ({ data }) => {
    return await createPost(data)
  })

// Update an existing post
export const updatePostFn = createServerFn({
  method: 'POST',
})
  .inputValidator(
    (data: {
      slug: string
      title: string
      content: string
      imageUrl?: string
      newSlug?: string
    }) => data
  )
  .handler(async ({ data }) => {
    const { slug, ...updateData } = data
    return await updatePost(slug, updateData)
  })

// Fetch latest posts excluding current post
export const getLatestPostsFn = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { excludeSlug: string; limit?: number }) => data)
  .handler(async ({ data }) => {
    return await getLatestPosts(data.excludeSlug, data.limit || 5)
  })
