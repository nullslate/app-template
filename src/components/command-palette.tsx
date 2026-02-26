import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "@/components/theme-provider";
import { useFont, FONTS } from "@/components/font-provider";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Home, Moon, Sun, FileText, Palette, Type, Sparkles } from "lucide-react";

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue>({
  open: false,
  setOpen: () => {},
});

export function useCommandPalette() {
  return useContext(CommandPaletteContext);
}

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setMode, setTheme, themes } = useTheme();
  const { setFont } = useFont();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => navigate({ to: "/" }))}>
              <Home className="mr-2 h-4 w-4" />
              Home
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate({ to: "/docs" }))}>
              <FileText className="mr-2 h-4 w-4" />
              Docs
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate({ to: "/icons" }))}>
              <Sparkles className="mr-2 h-4 w-4" />
              Icons
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Mode">
            <CommandItem onSelect={() => runCommand(() => setMode("light"))}>
              <Sun className="mr-2 h-4 w-4" />
              Light Mode
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setMode("dark"))}>
              <Moon className="mr-2 h-4 w-4" />
              Dark Mode
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Themes">
            {themes.map((t) => (
              <CommandItem key={t.id} onSelect={() => runCommand(() => setTheme(t.id))}>
                <Palette className="mr-2 h-4 w-4" />
                {t.name}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Fonts">
            {FONTS.map((f) => (
              <CommandItem key={f.id} onSelect={() => runCommand(() => setFont(f.id))}>
                <Type className="mr-2 h-4 w-4" />
                {f.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </CommandPaletteContext.Provider>
  );
}
