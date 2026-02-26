import { createFileRoute } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Palette, Shield, FileText } from "lucide-react"

const features = [
  {
    icon: Palette,
    title: "Themes",
    description: "Multiple color themes with light/dark mode. Live preview on hover, persisted across sessions.",
  },
  {
    icon: Shield,
    title: "Auth",
    description: "Auth.js with GitHub OAuth, JWT sessions, and role-based access — ready out of the box.",
  },
  {
    icon: FileText,
    title: "Docs",
    description: "MDX documentation system with syntax highlighting, auto-generated navigation, and search.",
  },
]

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-16 md:py-24">
      <div className="flex max-w-2xl flex-col items-center text-center">
        <Logo size={48} className="text-primary mb-6" />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {"{{project_name}}"}
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A modern Vite + React starter template
        </p>
        <p className="text-muted-foreground mt-4 max-w-lg text-sm leading-relaxed">
          Themes, authentication, documentation, and a command palette — everything
          you need to start building, with nothing you don&apos;t.
        </p>

        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link to="/docs">Get Started</Link>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://github.com/nullslate"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-16 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="text-primary mb-2 h-5 w-5" />
              <CardTitle className="text-base">{feature.title}</CardTitle>
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
