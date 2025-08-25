import { CodeBlock } from "./code-block";
import { HTMLAttributes } from "react";
import FakeTask from "./task";

export const mdxComponents = {
  FakeTask,
  pre: (props: any) => <CodeBlock {...props.children.props} />,
  code: (props: HTMLAttributes<HTMLElement>) => (
    <code
      {...props}
      className={`${props.className || ""
        } bg-gray-800/50 px-1.5 py-0.5 rounded text-sm font-mono`}
    />
  ),
  img: ({
    src,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!src) return null;
    return (
      <img
        src={src as string}
        alt={alt || ""}
        style={{ width: "100%", height: "auto" }}
        className="max-w-[400px] aspect-auto mx-auto rounded-lg"
        {...props}
      />
    );
  },
};
