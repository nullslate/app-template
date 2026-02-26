import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect, useRef } from "react"
import { Check, Copy } from "lucide-react"
import { codeToHtml, createCssVariablesTheme } from "shiki"

const theme = createCssVariablesTheme({
  name: "css-variables",
  variablePrefix: "--shiki-",
  variableDefaults: {},
  fontStyle: true,
})
import { ICONS, getFaviconFileCode, getLogoFileCode, type IconPreset } from "@/lib/icons"
import { IconPreview } from "@/components/icon-preview"
import { Button } from "@/components/ui/button"

function useHighlightedCode(code: string, lang: string) {
  const [html, setHtml] = useState("")
  const pending = useRef(0)

  useEffect(() => {
    const id = ++pending.current
    codeToHtml(code, { lang, theme }).then((result) => {
      if (id === pending.current) setHtml(result)
    })
  }, [code, lang])

  return html
}

function CodePanel({ icon }: { icon: IconPreset }) {
  const [tab, setTab] = useState<"favicon" | "logo">("favicon")
  const [copied, setCopied] = useState(false)

  const code = tab === "favicon" ? getFaviconFileCode(icon) : getLogoFileCode(icon)
  const html = useHighlightedCode(code, "tsx")

  function handleCopy() {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border-border bg-card overflow-hidden rounded-lg border">
      <div className="border-border flex items-center justify-between border-b px-4 py-2">
        <div className="flex gap-1">
          <button
            onClick={() => setTab("favicon")}
            className={`rounded-md px-3 py-1 text-sm transition-colors ${
              tab === "favicon"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            favicon.tsx
          </button>
          <button
            onClick={() => setTab("logo")}
            className={`rounded-md px-3 py-1 text-sm transition-colors ${
              tab === "logo"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            logo.tsx
          </button>
        </div>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={handleCopy}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      {html ? (
        <div
          className="overflow-auto p-4 text-sm leading-relaxed [&_pre]:!bg-transparent"
          // Shiki generates safe HTML from code strings - no user input
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-auto p-4 text-sm leading-relaxed">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}

export const Route = createFileRoute("/icons/")({
  component: IconsPage,
})

function IconsPage() {
  const [selected, setSelected] = useState<IconPreset>(ICONS[0])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-semibold">Icons</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Pick an icon for your favicon and logo. Code updates live below.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {ICONS.map((icon) => (
          <button
            key={icon.id}
            onClick={() => setSelected(icon)}
            className={`bg-card flex flex-col items-center gap-3 rounded-lg border p-4 transition-colors ${
              selected.id === icon.id
                ? "border-ring ring-ring/30 ring-2"
                : "border-border hover:border-ring/50"
            }`}
          >
            <IconPreview draw={icon.draw} size={64} />
            <span className="text-muted-foreground text-xs">{icon.name}</span>
          </button>
        ))}
      </div>

      <CodePanel icon={selected} />
    </div>
  )
}
