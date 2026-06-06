export type CmsBlogPost = {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedOn: string;
  author: string;
  url?: string;
  image: string;
  content: string[];
};

export const BLOG_REFERENCE_IMAGE = '/blogs/reference-blog.jpeg';

export const normalizeBlogSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const getBlogHrefFromPost = (title: string, rawUrl?: string) => {
  if (rawUrl && /^https?:\/\//i.test(rawUrl)) {
    return rawUrl;
  }

  if (rawUrl && rawUrl.startsWith('/blogs/')) {
    return rawUrl;
  }

  return `/blogs/${normalizeBlogSlug(title)}`;
};

export const getBlogImageFromPost = (post: Partial<CmsBlogPost>) => {
  if (post.image && /^https?:\/\//i.test(post.image)) {
    return post.image;
  }

  if (post.image && post.image.startsWith('/')) {
    return post.image;
  }

  return BLOG_REFERENCE_IMAGE;
};
