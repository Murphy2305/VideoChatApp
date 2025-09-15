"use client"

import * as React from "react"
import { useCallback, useEffect, useState } from "react"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year
const MOBILE_BREAKPOINT = 768

// ---------------------------------------------------------------------
// HOOK: useIsMobile
// ---------------------------------------------------------------------
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    mql.addEventListener("change", onChange)

    // initialize
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    return () => {
      mql.removeEventListener("change", onChange)
    }
  }, [])

  return isMobile
}

// ---------------------------------------------------------------------
// CONTEXT + PROVIDER
// ---------------------------------------------------------------------
type SidebarContextType = {
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile)

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => {
      const next = !prev
      if (typeof document !== "undefined") {
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${next}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      }
      return next
    })
  }, [])

  // Close sidebar by pressing ESC
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

// ---------------------------------------------------------------------
// HOOK TO CONSUME CONTEXT
// ---------------------------------------------------------------------
export function useSidebar() {
  const ctx = React.useContext(SidebarContext)
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return ctx
}
