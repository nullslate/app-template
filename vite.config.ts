import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import mdx from "@mdx-js/rollup"
import remarkFrontmatter from "remark-frontmatter"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import { nitro } from "nitro/vite"
import path from "node:path"

export default defineConfig({
  plugins: [
    nitro({
      services: {
        ssr: {
          entry: "./src/entry-server.tsx",
        },
      },
    }),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      exclude: /content\/docs\//,
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
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
})
