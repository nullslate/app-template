import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export const FONTS = [
  { id: 'inter', name: 'Inter', variable: '--font-inter' },
  { id: 'geist-sans', name: 'Geist Sans', variable: '--font-geist-sans' },
  { id: 'jetbrains-mono', name: 'JetBrains Mono', variable: '--font-jetbrains-mono' },
] as const;

export type FontId = (typeof FONTS)[number]['id'];

const DEFAULT_FONT: FontId = 'inter';
const STORAGE_KEY = 'font';
const COOKIE_KEY = 'font';

function setCookie(key: string, value: string) {
  document.cookie = `${key}=${value};path=/;max-age=31536000;SameSite=Lax`;
}

function getCookie(key: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
  return match ? match[1] : null;
}

function isValidFont(value: string): value is FontId {
  return FONTS.some((f) => f.id === value);
}

const FontContext = createContext<{
  font: FontId;
  setFont: (f: FontId) => void;
  fonts: typeof FONTS;
}>({
  font: DEFAULT_FONT,
  setFont: () => {},
  fonts: FONTS,
});

export function FontProvider({ children }: { children: ReactNode }) {
  const [font, setFontState] = useState<FontId>(DEFAULT_FONT);

  useEffect(() => {
    const saved = getCookie(COOKIE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (saved && isValidFont(saved)) {
      setFontState(saved);
      document.documentElement.setAttribute('data-font', saved);
    } else {
      document.documentElement.setAttribute('data-font', DEFAULT_FONT);
    }
  }, []);

  const setFont = useCallback((f: FontId) => {
    setFontState(f);
    localStorage.setItem(STORAGE_KEY, f);
    setCookie(COOKIE_KEY, f);
    document.documentElement.setAttribute('data-font', f);
  }, []);

  const value = useMemo(
    () => ({ font, setFont, fonts: FONTS }),
    [font, setFont]
  );

  return (
    <FontContext.Provider value={value}>
      {children}
    </FontContext.Provider>
  );
}

export const useFont = () => useContext(FontContext);
