import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  getDatabasePosts,
  getDatabasePostBySlug,
  type BlogPost,
} from "./posts";
import { BlogConfig } from "./config";


export async function getAllPosts(config: BlogConfig): Promise<BlogPost[]> {
  // Get file-based posts
  const fileNames = fs.readdirSync(config.contentPath);
  const filePosts = fileNames
    .filter(
      (fileName) =>
        !fs.lstatSync(path.join(config.contentPath, fileName)).isSymbolicLink()
    )
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(config.contentPath, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data: frontmatter } = matter(fileContents);

      return {
        slug,
        frontmatter: {
          title: frontmatter.title || "",
          date: frontmatter.date || "",
          description: frontmatter.description || "",
          author: frontmatter.author || "",
          draft: frontmatter.draft,
        },
        source: "file" as const,
      };
    });

  // Get database posts
  const databasePosts = await getDatabasePosts(config.supabase);

  // Merge posts, prioritizing database posts over file posts with same slug
  const postMap = new Map<string, BlogPost>();

  // Add file posts first
  filePosts.forEach((post: any) => {
    postMap.set(post.slug, post);
  });

  // Add database posts (will overwrite file posts with same slug)
  databasePosts.forEach((post: any) => {
    postMap.set(post.slug, post);
  });

  // Convert back to array and sort by date
  const allPosts = Array.from(postMap.values());
  return allPosts.sort((a, b) => {
    return (
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
    );
  });
}

export async function getPostBySlug(slug: string, config: BlogConfig) {
  // First check database for the post
  const databasePost = await getDatabasePostBySlug(config.supabase, slug);
  if (databasePost) {
    return {
      frontmatter: {
        title: databasePost.title,
        date: databasePost.date,
        description: databasePost.description || "",
        author: databasePost.author,
        draft: databasePost.draft,
      },
      content: databasePost.content,
      source: "database" as const,
    };
  }

  // Fall back to file-based post
  try {
    const fullPath = path.join(config.contentPath, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data: frontmatter, content } = matter(fileContents);

    return {
      frontmatter: {
        title: frontmatter.title || "",
        date: frontmatter.date || "",
        description: frontmatter.description || "",
        author: frontmatter.author || "",
        draft: frontmatter.draft,
      },
      content,
      source: "file" as const,
    };
  } catch (error) {
    throw new Error(`Post not found: ${slug}`);
  }
}
