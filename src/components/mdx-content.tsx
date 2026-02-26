interface MDXContentProps {
  html: string
}

// Content is server-rendered from trusted MDX files in content/docs/,
// not user input. Safe to render as HTML.
export function MDXContent({ html }: MDXContentProps) {
  return (
    <div
      className="prose prose-neutral dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
