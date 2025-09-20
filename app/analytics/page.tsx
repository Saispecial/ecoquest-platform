"use client"

import { useGameStore } from "@/stores/game-store"
import { ActivityChart } from "@/components/analytics/activity-chart"
import { CategoryBreakdown } from "@/components/analytics/category-breakdown"
import { ProgressInsights } from "@/components/analytics/progress-insights"
import { StreakTracker } from "@/components/analytics/streak-tracker"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  generateActivityData,
  generateCategoryStats,
  generateStreakData,
  generateProgressInsights,
  getWeeklyComparison,
} from "@/lib/analytics"
import { BarChart3, Download } from "lucide-react"

export default function AnalyticsPage() {
  const { player, quests, quizSessions, miniGameScores, achievements } = useGameStore()

  // Generate analytics data
  const activityData30Days = generateActivityData(quests, quizSessions, miniGameScores, 30)
  const activityData7Days = generateActivityData(quests, quizSessions, miniGameScores, 7)
  const categoryStats = generateCategoryStats(quests, quizSessions)
  const streakData = generateStreakData(player, activityData30Days)
  const progressInsights = generateProgressInsights(
    player,
    quests,
    quizSessions,
    miniGameScores,
    achievements,
    activityData30Days,
  )
  const weeklyComparison = getWeeklyComparison(activityData30Days)

  const totalActivities =
    quests.filter((q) => q.status === "completed").length + quizSessions.length + miniGameScores.length

  const handleExportData = () => {
    const exportData = {
      player,
      activityData: activityData30Days,
      categoryStats,
      progressInsights,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ecoquest-analytics-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Analytics & Progress
          </h1>
          <p className="text-muted-foreground mt-2">Track your environmental learning journey</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary">{totalActivities} Total Activities</Badge>
          <Badge variant="outline">{player.totalXP} Total XP</Badge>
          <Button onClick={handleExportData} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActivityChart data={activityData7Days} title="7-Day Activity" type="line" />
            <StreakTracker streakData={streakData} />
          </div>
          <CategoryBreakdown data={categoryStats} />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <ActivityChart data={activityData30Days} title="30-Day Activity Overview" type="bar" />
            <ActivityChart data={activityData7Days} title="7-Day Activity Trend" type="line" />
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryBreakdown data={categoryStats} />
            <StreakTracker streakData={streakData} />
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <ProgressInsights insights={progressInsights} weeklyComparison={weeklyComparison} />
        </TabsContent>
      </Tabs>

      {/* Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{player.level}</div>
          <div className="text-sm text-muted-foreground">Current Level</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-secondary">{player.currentStreak}</div>
          <div className="text-sm text-muted-foreground">Day Streak</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">{achievements.filter((a) => a.unlocked).length}</div>
          <div className="text-sm text-muted-foreground">Badges Earned</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-chart-1">
            {Math.round(player.totalXP / Math.max(1, totalActivities))}
          </div>
          <div className="text-sm text-muted-foreground">Avg XP/Activity</div>
        </div>
      </div>
    </div>
  )
}
