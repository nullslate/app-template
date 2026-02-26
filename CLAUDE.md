# App Template — Claude Code Instructions

## Stack
- **Framework:** Vite + TanStack Router, TypeScript
- **SSR:** Nitro v3 renderer
- **Styling:** Tailwind CSS v4, shadcn/ui (New York style)
- **Packages:** `@thesandybridge/themes` (theme CSS + runtime), `@thesandybridge/ui` (shared components)
- **Auth:** `@auth/core` via Nitro API routes
- **State:** TanStack React Query for server state

## Build Commands
- `vite dev` — development server
- `vite build` — production build
- `vite preview` — preview production build

## Theme System
- `data-theme` attribute selects color theme, `data-mode` selects light/dark
- Inline FOUC prevention script in `__root.tsx` reads from localStorage/cookies
- Theme CSS imported via `@import "@thesandybridge/themes/css"` in globals.css
- `@custom-variant dark` maps to `[data-mode="dark"]`
- Theme/mode persisted in localStorage + cookies

## CSS
- `src/globals.css` uses `@theme inline` to map theme variables to Tailwind colors
- `@import "@thesandybridge/ui/source"` for shared UI component styles
- Font imports via `@fontsource-variable/inter`, `@fontsource/geist-sans`, `@fontsource-variable/jetbrains-mono`
- No CSS modules — all styling via Tailwind utilities

## Routing
- TanStack Router with file-based routing in `src/routes/`
- `__root.tsx` — root layout (renders full `<html>` document for SSR)
- `index.tsx` — index route for a directory
- `$param.tsx` — dynamic route parameter
- `route.tsx` — layout route (wraps child routes with `<Outlet />`)
- No `'use client'` directives needed (everything is client-side in Vite)
- Path alias: `@/` maps to `src/`

## Optional Features (template.json)
- **Auth:** @auth/core via Nitro API routes (`src/lib/auth.ts`, `api/auth/`)
- **DB:** PostgreSQL via `pg` (`src/lib/db.ts`) — default false (Rust API handles DB)
- **Docs:** MDX in `content/docs/`, compiled via `@mdx-js/rollup`, rendered with `@thesandybridge/ui/mdx`

## Components
- **Command palette:** `src/components/command-palette.tsx` — Cmd+K, navigation + theme + font switching
- **Theme picker:** `src/components/theme-picker.tsx` — dropdown with live preview on hover
- **Font provider:** `src/components/font-provider.tsx` — font selection context with localStorage persistence
- **Session provider:** `src/components/session-provider.tsx` — custom React context for Auth.js sessions
- **Logo:** `src/components/logo.tsx` — inline SVG, uses `currentColor`
- **Favicon:** `src/components/favicon.tsx` — client wrapper drawing logo on 32x32 canvas

## Key File Paths
```
src/routes/__root.tsx   — root layout with providers (full HTML document)
src/routes/index.tsx    — home page
src/routes/docs/        — documentation routes
src/routes/icons/       — icon picker route
src/globals.css         — theme variable mapping + base styles
src/components/         — all components
src/components/ui/      — shadcn/ui primitives
src/lib/                — utilities (auth, docs, icons, utils)
src/entry-client.tsx    — client hydration entry
src/entry-server.tsx    — SSR entry for Nitro renderer
api/                    — Nitro API routes (health, auth)
content/docs/           — MDX documentation files
vite.config.ts          — Vite + plugins config
template.json           — template variables and feature flags
```

## Code Style
- Prefer editing existing files over creating new ones
- Avoid over-engineering — implement what's needed, not more
- No unnecessary comments or docstrings on obvious code

## Git
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `build:`, `perf:`
- Lowercase messages, concise but descriptive
- No Co-Authored-By lines
