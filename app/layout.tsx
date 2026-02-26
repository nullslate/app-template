import type { Metadata } from "next";
import { Inter, Geist, JetBrains_Mono } from "next/font/google";
import { generateThemeScript } from "@thesandybridge/themes";
import { ThemeProvider } from "@/components/theme-provider";
import { FontProvider } from "@/components/font-provider";
import { Favicon } from "@/components/favicon";
import { QueryProvider } from "@/components/query-provider";
import { SessionProvider } from "@/components/session-provider";
import { CommandPaletteProvider } from "@/components/command-palette";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/toaster";
import { Footer } from "@/components/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: {
    default: "{{project_name}}",
    template: "%s | {{project_name}}",
  },
  description: "A nullslate project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="darkreader-lock" />
        <script dangerouslySetInnerHTML={{ __html: generateThemeScript() }} />
      </head>
      <body className={`${inter.variable} ${geistSans.variable} ${jetbrainsMono.variable} flex min-h-dvh flex-col antialiased`}>
        <SessionProvider>
          <QueryProvider>
            <ThemeProvider>
              <FontProvider>
                <Favicon />
                <CommandPaletteProvider>
                  <Navbar />
                  <Toaster />
                  <main className="flex flex-1 flex-col">
                    {children}
                  </main>
                  <Footer />
                </CommandPaletteProvider>
              </FontProvider>
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
