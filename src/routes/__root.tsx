import {
  createRootRoute,
  Outlet,
  Link,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router"
import { ThemeProvider } from "@/components/theme-provider"
import { FontProvider } from "@/components/font-provider"
import { Favicon } from "@/components/favicon"
import { QueryProvider } from "@/components/query-provider"
import { CommandPaletteProvider } from "@/components/command-palette"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/toaster"
import { Footer } from "@/components/footer"
import { SessionProvider } from "@/components/session-provider"
import { Button } from "@/components/ui/button"
import appCss from "@/globals.css?url"

// FOUC prevention script - safe to inline: only reads from localStorage/cookies
// using hardcoded string literals, sets data-* attributes on documentElement.
// No user input is used. This is the standard pattern for theme FOUC prevention.
const foucScript = `(function(){function c(k){var m=document.cookie.match(new RegExp("(?:^|; )"+k+"=([^;]*)"));return m?m[1]:null}var t=c("theme")||localStorage.getItem("theme")||"default";var mo=c("mode")||localStorage.getItem("mode");if(!mo){mo=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var f=c("font")||localStorage.getItem("font")||"inter";document.documentElement.setAttribute("data-theme",t);document.documentElement.setAttribute("data-mode",mo);document.documentElement.setAttribute("data-font",f)})()`

export const Route = createRootRoute({
  errorComponent: ErrorComponent,
  notFoundComponent: NotFoundComponent,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "darkreader-lock" },
      { title: "{{project_name}}" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      // Safe inline script: only hardcoded string literals, no user input
      { dangerouslySetInnerHTML: { __html: foucScript } },
    ],
  }),
  shellComponent: RootShell,
  component: RootLayout,
})

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootLayout() {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider>
          <FontProvider>
            <Favicon />
            <CommandPaletteProvider>
              <Navbar />
              <Toaster />
              <main className="flex flex-1 flex-col">
                <Outlet />
              </main>
              <Footer />
            </CommandPaletteProvider>
          </FontProvider>
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  )
}

function ErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter()

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-6">
        {error.message || "An unexpected error occurred"}
      </p>
      <Button onClick={() => router.invalidate()}>Try again</Button>
    </div>
  )
}

function NotFoundComponent() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold mb-4">Not Found</h2>
      <p className="text-muted-foreground mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  )
}
