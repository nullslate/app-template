import matter from "gray-matter"
import { createServerFn } from "@tanstack/react-start"

export interface Heading {
  id: string
  title: string
}

export interface Doc {
  slug: string
  title: string
  description?: string
  order?: number
  content: string
  headings: Heading[]
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
}

function extractHeadings(content: string): Heading[] {
  const regex = /^## (.+)$/gm
  const headings: Heading[] = []
  let match
  while ((match = regex.exec(content)) !== null) {
    const title = match[1].trim()
    headings.push({ id: slugify(title), title })
  }
  return headings
}

const mdxModules = import.meta.glob("/content/docs/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

function parseDoc(filePath: string, raw: string): Doc {
  const slug = filePath.replace("/content/docs/", "").replace(/\.mdx$/, "")
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title || slug,
    description: data.description,
    order: data.order,
    content,
    headings: extractHeadings(content),
  }
}

function getAllDocsInternal(): Doc[] {
  return Object.entries(mdxModules)
    .map(([path, raw]) => parseDoc(path, raw))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
}

function getDocBySlugInternal(slug: string): Doc | null {
  const key = `/content/docs/${slug}.mdx`
  const raw = mdxModules[key]
  if (!raw) return null
  return parseDoc(key, raw)
}

export const getAllDocs = createServerFn({ method: "GET" }).handler(
  async () => getAllDocsInternal()
)

export const getDocBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => getDocBySlugInternal(slug))

export const getDocSlugs = createServerFn({ method: "GET" }).handler(
  async () =>
    Object.keys(mdxModules).map((path) =>
      path.replace("/content/docs/", "").replace(/\.mdx$/, "")
    )
)
