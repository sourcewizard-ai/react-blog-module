import { SupabaseClient } from "@supabase/supabase-js";

export interface BlogAuthorInfo {
  name: string;
  avatar: string;
  bio: string;
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  }
}

export interface BlogConfig {
  authors: Record<string, BlogAuthorInfo>;
  title: string;
  description: string;
  supabase: SupabaseClient,
  basePath: string;
  contentPath: string;
}

export function createBlogConfig(
  title: string, description: string, authors: BlogAuthorInfo[],
  supabase: SupabaseClient,
  basePath: string = "/blog", contentPath: string = "content/blog",): BlogConfig {
  return {
    title,
    description,
    authors: authors.reduce((acc, author) => {
      acc[author.name] = author;
      return acc;
    }, {} as Record<string, BlogAuthorInfo>),
    supabase,
    basePath,
    contentPath,
  }
}
