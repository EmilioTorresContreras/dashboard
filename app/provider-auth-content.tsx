'use client'

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { UsuarioInfo } from "@/components/usuario-info";
import { useAuth } from "@clerk/nextjs";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export function ProviderAuthContent({ children }: { children: ReactNode }) {
    const { isSignedIn } = useAuth();
    if (isSignedIn) {
        return (
            <div className="flex flex-1">
                <AppSidebar />
                <SidebarInset>

                    <div className="flex flex-1 flex-col gap-4 p-4">
                        <UsuarioInfo/>
                        {children}
                        <Toaster richColors/>
                    </div>
                </SidebarInset>
            </div>
        );
    } else {
        return ( 
        <div>
            <div className="flex flex-1 flex-col gap-4 p-4">
                {children}
                <Toaster richColors/>
            </div>
        </div>)
    }
}