import { defineConfig, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import { nitro } from "nitro/vite"
import path from "node:path"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)

function hasDependency(name: string): boolean {
  try {
    require.resolve(name)
    return true
  } catch {
    return false
  }
}

async function mdxPlugin(): Promise<Plugin | null> {
  if (!hasDependency("@mdx-js/rollup")) return null
  const mdx = (await import("@mdx-js/rollup")).default
  const remarkFrontmatter = (await import("remark-frontmatter")).default
  const remarkMdxFrontmatter = (await import("remark-mdx-frontmatter")).default
  return mdx({
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    exclude: /content\/docs\//,
  }) as Plugin
}

export default defineConfig(async () => {
  const mdx = await mdxPlugin()

  return {
    plugins: [
      nitro({
        services: {
          ssr: {
            entry: "./src/entry-server.tsx",
          },
        },
      }),
      tanstackRouter({ target: "react", autoCodeSplitting: true }),
      ...(mdx ? [mdx] : []),
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    ssr: {
      noExternal: ["@thesandybridge/ui", "@thesandybridge/themes"],
    },
    environments: {
      client: {
        build: {
          rollupOptions: {
            input: "./src/entry-client.tsx",
          },
        },
      },
    },
  }
})
