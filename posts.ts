import { slugify } from "./util";
import { SupabaseClient } from "@supabase/supabase-js";

export interface DatabasePost {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  author: string;
  content: string;
  draft: boolean;
  created_at: string;
  updated_at: string;
  date: string;
}

export interface BlogPostFrontmatter {
  title: string;
  date: string;
  description: string;
  author: string;
  draft?: boolean;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogPostFrontmatter;
  source?: "database" | "file";
}

export function convertDatabasePostToBlogPost(dbPost: DatabasePost): BlogPost {
  return {
    slug: dbPost.slug,
    frontmatter: {
      title: dbPost.title,
      date: dbPost.date,
      description: dbPost.description || "",
      author: dbPost.author,
      draft: dbPost.draft,
    },
    source: "database",
  };
}

export async function getDatabasePosts(supabase: SupabaseClient): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching database posts:", error);
      return [];
    }

    return (data || []).map(convertDatabasePostToBlogPost);
  } catch (error) {
    console.error("Error fetching database posts:", error);
    return [];
  }
}

export async function getDatabasePostBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<DatabasePost | null> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching database post by slug:", error);
    return null;
  }
}

export async function createDatabasePost(
  supabase: SupabaseClient,
  post: {
    title: string;
    description?: string;
    author: string;
    content: string;
    draft?: boolean;
    date?: string;
    slug?: string;
  }): Promise<DatabasePost | null> {
  try {
    const slug = post.slug || slugify(post.title);
    const date = post.date || new Date().toISOString();

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        slug,
        title: post.title,
        description: post.description,
        author: post.author,
        content: post.content,
        draft: post.draft || false,
        date,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating database post:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error creating database post:", error);
    return null;
  }
}
