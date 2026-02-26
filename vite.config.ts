import { defineConfig, type Plugin } from "vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import tsconfigPaths from "vite-tsconfig-paths"
import { nitro } from "nitro/vite"
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
      nitro({ scanDirs: ["."] }),
      tsconfigPaths({ projects: ["./tsconfig.json"] }),
      tailwindcss(),
      ...(mdx ? [mdx] : []),
      tanstackStart(),
      viteReact(),
    ],
    ssr: {
      noExternal: ["@thesandybridge/ui", "@thesandybridge/themes"],
    },
  }
})
