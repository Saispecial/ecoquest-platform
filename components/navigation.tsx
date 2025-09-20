"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useGameStore } from "@/stores/game-store"
import { Home, Target, BookOpen, Gamepad2, BarChart3, Trophy, Menu, Leaf, User } from "lucide-react"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    description: "Overview and stats",
  },
  {
    title: "Challenges",
    href: "/challenges",
    icon: Target,
    description: "Eco quests and activities",
  },
  {
    title: "Quiz",
    href: "/quiz",
    icon: BookOpen,
    description: "Test your knowledge",
  },
  {
    title: "Games",
    href: "/games",
    icon: Gamepad2,
    description: "Fun learning games",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    description: "Track your progress",
  },
  {
    title: "Achievements",
    href: "/achievements",
    icon: Trophy,
    description: "Badges and rewards",
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    description: "Settings and account",
  },
]

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const pathname = usePathname()
  const { player, getUnlockedAchievements, getAvailableQuests } = useGameStore()
  const unlockedAchievements = getUnlockedAchievements()
  const availableQuests = getAvailableQuests()

  return (
    <nav className={cn("space-y-2", className)}>
      {navigationItems.map((item) => {
        const isActive = pathname === item.href
        const Icon = item.icon

        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-12",
                isActive && "bg-primary/20 text-primary border-primary/30 hover:bg-primary/25",
              )}
            >
              <Icon className="h-5 w-5" />
              <div className="flex-1 text-left">
                <div className="font-medium">{item.title}</div>
                <div className={cn("text-xs", isActive ? "text-primary/80" : "text-foreground/70")}>
                  {item.description}
                </div>
              </div>
              {item.href === "/challenges" && availableQuests.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {availableQuests.length}
                </Badge>
              )}
              {item.href === "/achievements" && unlockedAchievements.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {unlockedAchievements.length}
                </Badge>
              )}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}

export function MobileNavigation() {
  const [open, setOpen] = useState(false)
  const { player } = useGameStore()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">EcoQuest</h2>
                <p className="text-sm text-muted-foreground">Level {player.level} Explorer</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4">
            <Navigation />
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <Link href="/profile">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <User className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{player.name}</div>
                  <div className="text-xs text-muted-foreground">{player.totalXP} XP</div>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
