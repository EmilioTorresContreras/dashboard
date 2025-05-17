import { ThemeProvider } from "@/components/theme/theme-provider"
import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Providers } from "./providers";


export const iframeHeight = "800px"

export const description = "A sidebar with a header and a search form."

export const metadata: Metadata = {
  title: "Escuela Limón",
  description: "Sistema para gestionar una escuela",
  icons: {
    icon: "/favicon.ico",
  },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps): React.ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <Footer />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}