"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

/**
 * Tubelight navbar — a floating pill of nav items with an animated "lamp"
 * glow that slides onto the active tab. Adapted to the Traq Collective theme:
 * shadcn tokens (primary/background/muted/foreground) are mapped to the site's
 * purple scale (traq-purple / bg-base / traq-tint / ink). The active tab is
 * derived from the current route, and the responsive icon/label swap is handled
 * with Tailwind `md:` utilities (no JS breakpoint state needed).
 */
export function NavBar({ items, className }: NavBarProps) {
  const pathname = usePathname()
  const routeActive = items.find(
    (item) => item.url !== "#" && pathname?.startsWith(item.url),
  )?.name
  const [activeTab, setActiveTab] = useState(routeActive ?? items[0].name)

  // Keep the active tab in sync when navigation changes the route.
  useEffect(() => {
    if (routeActive) setActiveTab(routeActive)
  }, [routeActive])

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
        className,
      )}
    >
      <div className="flex items-center gap-3 border border-border-subtle bg-white/80 py-1 px-1 rounded-full shadow-card backdrop-blur-lg">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                "text-ink/80 hover:text-traq-purple",
                isActive && "bg-traq-tint text-traq-purple",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-traq-purple/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-traq-purple rounded-t-full">
                    <div className="absolute w-12 h-6 bg-traq-purple/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-traq-purple/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-traq-purple/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
