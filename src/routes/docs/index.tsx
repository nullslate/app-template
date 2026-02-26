import { createFileRoute, Link } from "@tanstack/react-router"
import { getAllDocs } from "@/lib/docs"

export const Route = createFileRoute("/docs/")({
  component: DocsPage,
  loader: () => ({
    docs: getAllDocs(),
  }),
})

function DocsPage() {
  const { docs } = Route.useLoaderData()

  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Documentation</h1>
      <p className="text-muted-foreground mb-8">
        Everything you need to get started with the project.
      </p>

      {docs.length === 0 ? (
        <p className="text-muted-foreground">
          No documentation found. Add MDX files to{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">content/docs/</code>.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {docs.map((doc) => (
            <Link
              key={doc.slug}
              to="/docs/$slug"
              params={{ slug: doc.slug }}
              className="block rounded-lg border border-border p-4 hover:bg-accent transition-colors"
            >
              <h2 className="font-semibold mb-1">{doc.title}</h2>
              {doc.description && (
                <p className="text-sm text-muted-foreground">{doc.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
