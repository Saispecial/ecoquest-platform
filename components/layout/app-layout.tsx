"use client"

import type React from "react"

import { useEffect } from "react"
import { useGameStore } from "@/stores/game-store"
import { Navigation, MobileNavigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Leaf, Zap } from "lucide-react"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { player, initializeGame, getCurrentLevel, getProgressToNextLevel } = useGameStore()

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  const currentLevel = getCurrentLevel()
  const progressToNextLevel = getProgressToNextLevel()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-pink-50">
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-80 flex-col border-r bg-card/50 backdrop-blur-sm">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-primary">EcoQuest</h1>
                <p className="text-sm text-muted-foreground">Sustainable Learning</p>
              </div>
            </div>

            {/* Player Quick Stats */}
            <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{player.name}</div>
                  <div className="text-sm text-muted-foreground">Level {currentLevel}</div>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  {player.totalXP} XP
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Next Level</span>
                  <span>{Math.round(progressToNextLevel * 100)}%</span>
                </div>
                <Progress value={progressToNextLevel * 100} className="h-2" />
              </div>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4">
            <Navigation />
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-center text-xs text-muted-foreground">
              <p>Streak: {player.currentStreak} days</p>
              <p className="mt-1">Keep learning for a better planet!</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Mobile Header */}
          <header className="md:hidden flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <h1 className="font-bold text-lg text-primary">EcoQuest</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{player.totalXP} XP</Badge>
              <MobileNavigation />
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
