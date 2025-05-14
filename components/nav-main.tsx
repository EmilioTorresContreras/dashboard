"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useSidebarStore } from "@/app/stores/sidebarStore"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()
  const { expandedSections, toggleSection, setSectionOpen } = useSidebarStore()

  // useEffect(() => {
  //   items.forEach(item => {
  //     const hasMatch = item.items?.some(subItem => pathname.startsWith(subItem.url))
  //     console.log(hasMatch)
  //     console.log(pathname)
  //     console.log(item.url)
  //     if (hasMatch && !expandedSections[item.title]) {
  //       setSectionOpen(item.title, true)
  //     } 
  //   })
  // }, [pathname, items, expandedSections, setSectionOpen])
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
        const isOpen = expandedSections[item.title] ?? item.isActive ?? false
        const pathname = usePathname()
          const isRouteActive = (route: string) => pathname.startsWith(route)
        return (
          <Collapsible key={item.title} asChild open={isRouteActive(item.url) || isOpen}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction  onClick={() => toggleSection(item.title)} className="data-[state=open]:rotate-90">
                      <ChevronRight/>
                      
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        )})}
      </SidebarMenu>
    </SidebarGroup>
  )
}


