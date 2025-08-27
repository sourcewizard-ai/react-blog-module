import { getAllPosts } from "./mdx";
import { formatDate } from "./util";
import { BlogConfig } from "./config";

export interface BlogMetadata {
  title: string;
  description: string;
}

export async function getMetadata(config: BlogConfig): Promise<BlogMetadata> {
  return {
    title: config.title,
    description: config.description,
  }
}

export async function BlogPostsPage({ config }: { config: BlogConfig }) {
  const posts = await getAllPosts(config);
  const publishedPosts = process.env.NODE_ENV === 'development' ? posts : posts.filter(post => !post.frontmatter.draft);

  return (
    <main className="py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 mx-auto text-center">Blog</h1>
      <div className="grid gap-6">
        {publishedPosts.map((post) => {
          const author = config.authors[post.frontmatter.author];
          return (
            <article
              key={post.slug}
              className="p-6 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
            >
              <a href={`${config.basePath}/${post.slug}`}>
                <h2 className="text-2xl font-semibold mb-2">
                  {post.frontmatter.title}
                </h2>
                <p className="text-gray-400 mb-4">
                  {post.frontmatter.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {author && (
                    <div className="flex items-center gap-2">
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-[20px] h-[20px] rounded-full object-cover"
                      />
                      <span>{author.name}</span>
                    </div>
                  )}
                  <span>{formatDate(post.frontmatter.date)}</span>
                </div>
              </a>
            </article>
          );
        })}
      </div>
    </main>
  );
}
