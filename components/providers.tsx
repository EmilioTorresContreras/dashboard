'use client';

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider } from '@clerk/nextjs';
import { neobrutalism } from "@clerk/themes";
import { esMX } from "@clerk/localizations";

export default function Providers({ children }: { children: React.ReactNode }) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  return (

    <ClerkProvider
      localization={esMX}
      appearance={{
        baseTheme: neobrutalism,
        layout: {
          socialButtonsPlacement: 'bottom',
          logoPlacement: 'inside',
        },
      }}>
      <ConvexProvider client={convex}>
        {children}
      </ConvexProvider>
    </ClerkProvider>
  );
}