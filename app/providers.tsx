"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { ClerkProvider } from '@clerk/nextjs';
import { SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { ProviderAuthContent } from "./provider-auth-content";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <ClerkProvider>
          <ConvexProvider client={convex}>
            <SiteHeader />
            <ProviderAuthContent>
              {children}
            </ProviderAuthContent>
          </ConvexProvider>
        </ClerkProvider>
      </SidebarProvider>
    </div>
  );
}
