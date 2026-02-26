import { useState, useEffect } from "react"
import { evaluate } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypeShiki from "@shikijs/rehype"
import type { MDXComponents } from "mdx/types"

interface MDXContentProps {
  source: string
  components?: MDXComponents
}

export function MDXContent({ source, components = {} }: MDXContentProps) {
  const [Content, setContent] = useState<React.ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    evaluate(source, {
      ...runtime,
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypeShiki, { theme: "github-dark" }],
      ],
      development: false,
    }).then(
      (mod) => {
        if (!cancelled) setContent(() => mod.default)
      },
      (err) => {
        if (!cancelled) setError(String(err))
      }
    )

    return () => { cancelled = true }
  }, [source])

  if (error) return <p className="text-destructive text-sm">{error}</p>
  if (!Content) return null

  return <Content components={components} />
}
