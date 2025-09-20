"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { StreakData } from "@/lib/analytics"
import { Flame, Trophy } from "lucide-react"

interface StreakTrackerProps {
  streakData: StreakData
}

export function StreakTracker({ streakData }: StreakTrackerProps) {
  const recentHistory = streakData.streakHistory.slice(-21) // Last 3 weeks

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-red-500"
    if (streak >= 14) return "text-orange-500"
    if (streak >= 7) return "text-yellow-500"
    if (streak >= 3) return "text-green-500"
    return "text-muted-foreground"
  }

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "Incredible dedication! 🔥"
    if (streak >= 14) return "You're on fire! 🚀"
    if (streak >= 7) return "Great consistency! ⭐"
    if (streak >= 3) return "Building momentum! 💪"
    if (streak >= 1) return "Keep it up! 👍"
    return "Start your streak today! 🌱"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5" />
          Activity Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Streak */}
        <div className="text-center space-y-2">
          <div className={`text-4xl font-bold ${getStreakColor(streakData.currentStreak)}`}>
            {streakData.currentStreak}
          </div>
          <div className="text-muted-foreground">Current Streak (days)</div>
          <div className="text-sm text-primary">{getStreakMessage(streakData.currentStreak)}</div>
        </div>

        {/* Streak History Visualization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Last 3 Weeks</span>
            <Badge variant="outline" className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              Best: {streakData.longestStreak} days
            </Badge>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {recentHistory.map((day, index) => {
              const date = new Date(day.date)
              const isToday = date.toDateString() === new Date().toDateString()

              return (
                <div key={day.date} className="text-center">
                  <div
                    className={`w-8 h-8 rounded-sm flex items-center justify-center text-xs font-medium border-2 ${
                      day.active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-muted"
                    } ${isToday ? "ring-2 ring-secondary ring-offset-1" : ""}`}
                    title={`${date.toLocaleDateString()} - ${day.active ? "Active" : "Inactive"}`}
                  >
                    {date.getDate()}
                  </div>
                  {index < 7 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted rounded-sm"></div>
              <span>Inactive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-sm"></div>
              <span>Active</span>
            </div>
          </div>
        </div>

        {/* Streak Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-xl font-bold text-secondary">{streakData.longestStreak}</div>
            <div className="text-sm text-muted-foreground">Longest Streak</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-accent">{recentHistory.filter((d) => d.active).length}</div>
            <div className="text-sm text-muted-foreground">Active Days (3w)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
