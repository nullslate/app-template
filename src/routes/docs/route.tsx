import { createFileRoute, Outlet } from "@tanstack/react-router"
import { getAllDocs } from "@/lib/docs"
import { DocsSidebar } from "@/components/docs-sidebar"

export const Route = createFileRoute("/docs")({
  component: DocsLayout,
  loader: async () => {
    const allDocs = await getAllDocs()
    return {
      docs: allDocs.map((d) => ({
        slug: d.slug,
        title: d.title,
        headings: d.headings,
      })),
    }
  },
})

function DocsLayout() {
  const { docs } = Route.useLoaderData()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1">
      <DocsSidebar docs={docs} />
      <div className="min-w-0 flex-1 px-6 py-8">
        <Outlet />
      </div>
    </div>
  )
}
