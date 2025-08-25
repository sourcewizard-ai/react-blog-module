# React Blog Module

A simple, embeddable blog engine for React applications with support for both local MDX files and Supabase database as content sources.

## Features

- 🔥 **Multiple Content Sources**: Support for both local MDX files and Supabase database, more can be added in the future
- 📝 **MDX Support**: Rich content with React components in markdown
- 👤 **Author Management**: Built-in author profiles with social links
- 🎨 **Customizable**: Tailwind CSS styling with customizable components
- 🔍 **SEO Ready**: Metadata generation for blog posts
- 📱 **Responsive**: Mobile-friendly design out of the box

## Installation

### Step 1: Install the Package

```bash
npm install react-blog-module
# or
yarn add react-blog-module
# or
pnpm add react-blog-module
```

### Step 2: Install Peer Dependencies

```bash
npm install react react-dom @supabase/supabase-js gray-matter next-mdx-remote lucide-react tailwindcss class-variance-authority clsx tailwind-merge tailwindcss-animate react-syntax-highlighter
```

### Step 3: Set Up Supabase (Optional)

If you want to use Supabase as a content source, create a table in your Supabase database:

```sql
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  draft BOOLEAN DEFAULT false,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies as needed
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Example: Allow public read access to published posts
CREATE POLICY "Public can read published posts" ON blog_posts
  FOR SELECT USING (draft = false);
```

### Step 4: Configure Your Blog

Create a blog configuration:

```typescript
import { createBlogConfig, BlogAuthorInfo } from 'react-blog-module';
import { createClient } from '@supabase/supabase-js';

// Set up Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define authors
const authors: BlogAuthorInfo[] = [
  {
    name: 'John Doe',
    avatar: '/avatars/john.jpg',
    bio: 'Software engineer and technical writer',
    social: {
      twitter: 'johndoe',
      github: 'johndoe',
      linkedin: 'johndoe'
    }
  }
];

// Create blog configuration
export const blogConfig = createBlogConfig(
  'My Blog',                    // title
  'A blog about tech and code', // description
  authors,                      // authors array
  supabase,                     // Supabase client
  '/blog',                      // basePath (optional)
  'content/blog'                // contentPath (optional)
);
```

### Step 5: Create Content Directory (For File-Based Posts)

Create a content directory for your MDX files:

```
content/blog/
├── my-first-post.mdx
├── another-post.mdx
└── ...
```

Example MDX file (`content/blog/my-first-post.mdx`):

```mdx
---
title: "My First Blog Post"
date: "2024-01-15"
description: "This is my first blog post using the React Blog Module"
author: "John Doe"
draft: false
---

# Welcome to My Blog

This is the content of my first blog post. I can use **markdown** and even React components!

## Code Example

```javascript
function hello() {
  console.log('Hello, world!');
}
```

<FakeTask title="Try the blog module" completed={false}>
  Install and configure the React Blog Module in your project.
</FakeTask>
```

## Usage

### Blog Posts List Page

```typescript
import { BlogPostsPage, getMetadata } from 'react-blog-module';
import { blogConfig } from './blog-config';

export default function BlogPage() {
  return <BlogPostsPage config={blogConfig} />;
}

// For Next.js metadata
export async function generateMetadata() {
  return await getMetadata(blogConfig);
}
```

### Single Blog Post Page

```typescript
import { SingleBlogPost, generateBlogMetadata, generateNextStaticParams } from 'react-blog-module';
import { blogConfig } from '../blog-config';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function BlogPost({ params }: Props) {
  return <SingleBlogPost params={params} config={blogConfig} />;
}

// For Next.js
export async function generateMetadata({ params }: Props) {
  return await generateBlogMetadata({ params, config: blogConfig });
}

export async function generateStaticParams() {
  return await generateNextStaticParams(blogConfig);
}
```

### Managing Database Posts

```typescript
import { createDatabasePost, getDatabasePosts } from 'react-blog-module';
import { blogConfig } from './blog-config';

// Create a new post
const newPost = await createDatabasePost(blogConfig.supabase, {
  title: 'New Post from Database',
  description: 'This post is stored in Supabase',
  author: 'John Doe',
  content: '# Hello from the database!\n\nThis content is stored in Supabase.',
  draft: false
});

// Get all database posts
const posts = await getDatabasePosts(blogConfig.supabase);
```

## Content Sources Priority

The blog engine supports both file-based and database content sources:

1. **Database posts** take priority over file-based posts with the same slug
2. **File-based posts** are loaded from the `contentPath` directory
3. Posts from both sources are merged and sorted by date

## Customization

### Custom MDX Components

```typescript
import { mdxComponents } from 'react-blog-module';

// Extend default components
const customComponents = {
  ...mdxComponents,
  h1: (props: any) => <h1 className="custom-h1" {...props} />,
  CustomComponent: ({ children }: { children: React.ReactNode }) => (
    <div className="custom-wrapper">{children}</div>
  )
};

// Use in SingleBlogPost
<MDXRemote source={content} components={customComponents} />
```

### Styling

The components use Tailwind CSS classes. Make sure your project has Tailwind configured and includes the necessary classes, or override the styles as needed.

## API Reference

### Types

- `BlogConfig` - Main configuration object
- `BlogAuthorInfo` - Author information structure
- `BlogPost` - Blog post data structure
- `DatabasePost` - Database post structure

### Functions

- `createBlogConfig()` - Create blog configuration
- `getAllPosts()` - Get all posts from both sources
- `getPostBySlug()` - Get single post by slug
- `createDatabasePost()` - Create new database post
- `getDatabasePosts()` - Get all database posts
- `generateBlogMetadata()` - Generate SEO metadata

### Components

- `BlogPostsPage` - Blog posts listing page
- `SingleBlogPost` - Individual blog post page
- `AuthorCard` - Author information component
- `CodeBlock` - Syntax-highlighted code blocks

## Requirements

- React 19+
- TypeScript (recommended)
- Tailwind CSS
- Supabase (optional, for database posts)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
