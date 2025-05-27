"use client"

import * as React from "react"
import {
  BookOpen,
  Building2,
  User,
  Users,
  Clock8,
  LifeBuoy,
  Send,
  Citrus,
  BookOpenCheck,
  UserCog,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Button } from "./ui/button"
import { useAuth } from "@clerk/nextjs"
import AuthButtons from "./auth-button"
import { useUserStore } from "@/app/stores/usuarioStore"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const role  = useUserStore((state) => state.role);
  const { isSignedIn} = useAuth()
  const data = {
    navMain: [
      {
        title: "Maestros",
        url: "/maestros",
        icon: Users,
        items: [
          {
            title: "Ver",
            url: "/maestros",
          },
          {
            title: "Crear",
            url: "/maestros/create",
          },
        ],
      },
      {
        title: "Estudiantes",
        url: "/estudiantes",
        icon: User,
        items: [
          {
            title: "Ver",
            url: "/estudiantes",
          },
          {
            title: "Crear",
            url: "/estudiantes/create",
          },
        ],
      },
      {
        title: "Materias",
        url: "/materias",
        icon: BookOpen,
        items: [
          {
            title: "Ver",
            url: "/materias",
          },
          {
            title: "Crear",
            url: "/materias/create",
          },
        ],
      },
      {
        title: "Horarios",
        url: "/horarios",
        icon: Clock8,
        items: [
          {
            title: "Ver",
            url: "/horarios",
          },
          {
            title: "Crear",
            url: "/horarios/create",
          },
        ],
      },
      {
        title: "Salones",
        url: "/salones",
        icon: Building2,
        items: [
          {
            title: "Ver",
            url: "/salones",
          },
          {
            title: "Crear",
            url: "/salones/create",
          },
        ],
      },
      {
        title: "Calificaciones",
        url: "/calificaciones",
        icon: BookOpenCheck,
        items: [
          {
            title: "Ver",
            url: "/calificaciones",
          },
          {
            title: "Crear",
            url: "/calificaciones/create",
          },
        ],
      },

    ],
    navAdmin: [
      {
        title: "Usuarios",
        url: "/usuarios",
        icon: UserCog,
        items: [
          {
            title: "Ver",
            url: "/usuarios",
          },
          {
            title: "Crear",
            url: "/usuarios/create",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    // projects: [
    //   {
    //     name: "Design Engineering",
    //     url: "#",
    //     icon: Frame,
    //   },
    //   {
    //     name: "Sales & Marketing",
    //     url: "#",
    //     icon: PieChart,
    //   },
    //   {
    //     name: "Travel",
    //     url: "#",
    //     icon: Map,
    //   },
    // ],
  }
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Button className="flex size-8 items-center justify-center rounded-lg cursor-pointer" >
                  <Citrus className="size-4" />
                </Button>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Escuela Limón</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} title="General" />
        { role === "admin" ? <NavMain items={data.navAdmin} title="Administración" /> : null}
        
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex h-full items-center justify-start pl-2 pb-2">
          {isSignedIn ? <NavUser/>: <AuthButtons />}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
