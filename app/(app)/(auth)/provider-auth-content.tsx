"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from "@clerk/themes";
import { esMX } from "@clerk/localizations";
import { useTheme } from "next-themes";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ProviderSignInUp({ children }: { children: ReactNode }) {
    const { theme } = useTheme();

    return (
    <div className="[--header-height:calc(--spacing(14))]">
        <ClerkProvider
          localization={esMX}
          appearance={{
            baseTheme: theme === "dark" ? [dark] : [],
            layout: {
              socialButtonsPlacement: 'bottom',
              logoPlacement: 'inside',
            },
          }}>
          <ConvexProvider client={convex}>
              {children}
          </ConvexProvider>
        </ClerkProvider>
    </div>
  );
}
