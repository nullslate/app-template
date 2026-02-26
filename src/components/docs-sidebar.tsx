import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Heading } from "@/lib/docs";

interface DocLink {
  slug: string;
  title: string;
  headings: Heading[];
}

export function DocsSidebar({ docs }: { docs: DocLink[] }) {
  const { pathname } = useLocation();
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);

  const activeSlug = pathname.startsWith("/docs/")
    ? pathname.slice("/docs/".length).replace(/\/$/, "")
    : null;

  const activeDoc = activeSlug
    ? docs.find((d) => d.slug === activeSlug)
    : null;

  const updateActiveHeading = useCallback(() => {
    if (!activeDoc || activeDoc.headings.length === 0) return;

    const scrollY = window.scrollY + 100;
    let current: string | null = null;

    for (const heading of activeDoc.headings) {
      const el = document.getElementById(heading.id);
      if (el && el.offsetTop <= scrollY) {
        current = heading.id;
      }
    }

    setActiveHeadingId(current);
  }, [activeDoc]);

  useEffect(() => {
    if (!activeDoc) return;

    updateActiveHeading();
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveHeading);
  }, [activeDoc, updateActiveHeading]);

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border/50 p-6 lg:block sticky top-14 self-start h-[calc(100vh-3.5rem)] overflow-y-auto">
      <nav className="space-y-1">
        <Link
          to="/docs"
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
            pathname === "/docs"
              ? "bg-muted text-foreground font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <FileText className="h-4 w-4" />
          Overview
        </Link>
        {docs.map((doc) => (
          <div key={doc.slug}>
            <Link
              to="/docs/$slug"
              params={{ slug: doc.slug }}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                activeSlug === doc.slug
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <FileText className="h-4 w-4" />
              {doc.title}
            </Link>
            {activeSlug === doc.slug && doc.headings.length > 0 && (
              <div className="ml-4 mt-1 space-y-0.5 border-l border-border/50 pl-3">
                {doc.headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={cn(
                      "block rounded-md px-2 py-1 text-xs transition-colors",
                      activeHeadingId === heading.id
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(heading.id);
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                  >
                    {heading.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
