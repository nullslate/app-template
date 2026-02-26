"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon, FileText, Home, Search, Github, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemePicker } from "@/components/theme-picker";
import { useCommandPalette } from "@/components/command-palette";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

function NavLinks({ onClick }: { onClick?: () => void }) {
  return (
    <>
      <Link
        href="/"
        onClick={onClick}
        className="hover:text-foreground flex items-center gap-3 transition-colors"
      >
        <Home className="h-4 w-4" />
        Home
      </Link>
      <Link
        href="/docs"
        onClick={onClick}
        className="hover:text-foreground flex items-center gap-3 transition-colors"
      >
        <FileText className="h-4 w-4" />
        Docs
      </Link>
      <Link
        href="/icons"
        onClick={onClick}
        className="hover:text-foreground flex items-center gap-3 transition-colors"
      >
        <Sparkles className="h-4 w-4" />
        Icons
      </Link>
    </>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setOpen: setCommandPaletteOpen } = useCommandPalette();

  return (
    <nav className="border-border/50 border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="text-primary flex items-center gap-2 text-sm font-medium">
          <Logo size={20} />
          {"{{project_name}}"}
        </Link>

        {/* Desktop navigation */}
        <div className="text-muted-foreground hidden items-center gap-4 text-sm md:flex">
          <NavLinks />
        </div>

        {/* Desktop right side */}
        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground h-8 gap-2 px-2 text-xs"
            onClick={() => setCommandPaletteOpen(true)}
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Search</span>
            <kbd className="bg-muted text-muted-foreground pointer-events-none hidden h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium lg:inline-flex">
              <span className="text-xs">&#8984;</span>K
            </kbd>
          </Button>
          <a
            href="https://github.com/nullslate"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <ThemePicker />
        </div>

        {/* Mobile right side */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemePicker />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col gap-6 overflow-auto px-4 pt-2">
                <nav className="text-muted-foreground flex flex-col gap-4 text-base">
                  <NavLinks onClick={() => setMobileMenuOpen(false)} />
                </nav>

                <div className="bg-border h-px" />

                <div className="mt-auto flex items-center gap-4 pb-4 pt-4">
                  <a
                    href="https://github.com/nullslate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
