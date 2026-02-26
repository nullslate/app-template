import { createFileRoute, Link, notFound } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { getDocBySlug } from "@/lib/docs"
import { MDXContent } from "@/components/mdx-content"
import { docsMDXComponents } from "@/lib/mdx-components"

export const Route = createFileRoute("/docs/$slug")({
  component: DocPage,
  loader: async ({ params }) => {
    const doc = await getDocBySlug({ data: params.slug })
    if (!doc) throw notFound()
    return { doc }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.doc.title },
      { name: "description", content: loaderData?.doc.description },
    ],
  }),
})

function DocPage() {
  const { doc } = Route.useLoaderData()

  return (
    <>
      <Link
        to="/docs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 lg:hidden"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to docs
      </Link>

      <div className="space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">{doc.title}</h1>
          {doc.description && (
            <p className="text-muted-foreground">{doc.description}</p>
          )}
        </div>
        <MDXContent source={doc.content} components={docsMDXComponents} />
      </div>
    </>
  )
}
