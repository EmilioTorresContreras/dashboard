import { ThemeProvider } from "@/components/theme/theme-provider"
import type { Metadata } from "next";
import "../../globals.css";
import { ProviderSignInUp } from "./provider-auth-content";

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
          <ProviderSignInUp>
            {children}
          </ProviderSignInUp>
        </ThemeProvider>
      </body>
    </html>
  );
}