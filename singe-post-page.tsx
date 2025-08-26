import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPosts } from "./mdx";
import { formatDate } from "./util";
import { AuthorCard } from "./author-card";
import { BlogConfig } from "./config";
import { mdxComponents } from "./mdx/components";
import React from "react";

export async function generateNextStaticParams(config: BlogConfig) {
  const posts = await getAllPosts(config);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface Props {
  params: Promise<{ slug: string }>;
  config: BlogConfig;
}

export async function generateBlogMetadata({ params, config }: Props): Promise<any> {
  try {
    const { slug } = await params;
    const { frontmatter } = await getPostBySlug(slug, config);

    return {
      title: `${frontmatter.title} | ${config.title}`,
      description: frontmatter.description || "No description",
      authors: [
        {
          name: frontmatter.author,
        },
      ],
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.description,
        type: "article",
        publishedTime: frontmatter.date,
        images: [
          {
            url: '/og-image.png', // Use a default OG image
            width: 512,
            height: 512,
            alt: frontmatter.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        images: ['/og-image.png'], // Use the same default image
      }
    };
  } catch (error) {
    return {
      title: `Post Not Found | ${config.title}`,
      description: 'The requested blog post could not be found.',
    };
  }
}

export default async function SingleBlogPost({
  config,
  params,
}: {
  params: Promise<{ slug: string }>;
  config: BlogConfig;
}) {
  try {
    const { slug } = await params;
    const { frontmatter, content } = await getPostBySlug(slug, config);

    if (!frontmatter || !content) {
      throw new Error('Post not found');
    }

    const author = config.authors[frontmatter.author];

    return (
      <article className="flex-1 max-w-screen-md mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{frontmatter.title}</h1>
          <div className="flex items-center gap-4 text-gray-400">
            {author && (
              <div className="flex items-center gap-2">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-[24px] h-[24px] rounded-full object-cover"
                />
                <span>{author.name}</span>
              </div>
            )}
            <span>{formatDate(frontmatter.date)}</span>
          </div>
        </header>
        <div className="prose prose-invert max-w-none">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
        <AuthorCard config={config} authorId={frontmatter.author} />
      </article>
    );
  } catch (error) {
    return (
      <div className="flex-1 max-w-screen-md mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p>Sorry, we couldn't find the blog post you're looking for.</p>
      </div>
    );
  }
}
