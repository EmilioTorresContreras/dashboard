import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SidebarStore {
    expandedSections: Record<string, boolean>
    toggleSection: (key: string) => void
    setSectionOpen: (key: string, value: boolean) => void
}

export const useSidebarStore = create(
    persist<SidebarStore>(
        (set) => ({
            expandedSections: {},
            toggleSection: (key) =>
                set((state) => ({
                    expandedSections: {
                        ...state.expandedSections,
                        [key]: !state.expandedSections[key],
                    },
                })),
            setSectionOpen: (key: string, isOpen: boolean) =>
                set((state) => ({
                    expandedSections: {
                        ...state.expandedSections,
                        [key]: isOpen,
                    },
                })),

        }),
        {
            name: "sidebar-store", // clave para localStorage
        }
    )
)
