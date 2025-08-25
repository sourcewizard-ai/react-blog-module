import { Twitter, Github, Linkedin } from "lucide-react";
import { BlogConfig } from "./config";

interface AuthorCardProps {
  authorId: string;
  config: BlogConfig;
}

export function AuthorCard({ authorId, config }: AuthorCardProps) {
  const author = config.authors[authorId];

  if (!author) return null;

  return (
    <div className="mt-16 pt-8 border-t border-gray-800">
      <div className="flex gap-4 items-start">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-[60px] h-[60px] rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">{author.name}</h3>
          <p className="text-gray-400 mb-4">{author.bio}</p>
          <div className="flex gap-4">
            {author.social.twitter && (
              <a
                href={`https://twitter.com/${author.social.twitter}`}
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {author.social.github && (
              <a
                href={`https://github.com/${author.social.github}`}
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
            {author.social.linkedin && (
              <a
                href={`https://www.linkedin.com/in/${author.social.linkedin}`}
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
