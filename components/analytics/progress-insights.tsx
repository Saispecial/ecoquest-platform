"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ProgressInsights } from "@/lib/analytics"
import { Lightbulb, TrendingUp, Award, ArrowRight, Target } from "lucide-react"
import Link from "next/link"

interface ProgressInsightsProps {
  insights: ProgressInsights
  weeklyComparison: {
    thisWeek: number
    lastWeek: number
    change: number
  }
}

export function ProgressInsightsComponent({ insights, weeklyComparison }: ProgressInsightsProps) {
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (change < 0) return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
    return <TrendingUp className="h-4 w-4 text-muted-foreground" />
  }

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-muted-foreground"
  }

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case "challenges":
        return "🎯"
      case "quizzes":
        return "🧠"
      case "games":
        return "🎮"
      default:
        return "📊"
    }
  }

  return (
    <div className="space-y-6">
      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{weeklyComparison.thisWeek}</div>
              <div className="text-sm text-muted-foreground">This Week XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{weeklyComparison.lastWeek}</div>
              <div className="text-sm text-muted-foreground">Last Week XP</div>
            </div>
            <div className="text-center md:col-span-1 col-span-2">
              <div
                className={`text-2xl font-bold flex items-center justify-center gap-1 ${getTrendColor(weeklyComparison.change)}`}
              >
                {getTrendIcon(weeklyComparison.change)}
                {weeklyComparison.change > 0 ? "+" : ""}
                {weeklyComparison.change}%
              </div>
              <div className="text-sm text-muted-foreground">Change</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Your Learning Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{insights.totalActivities}</div>
              <div className="text-sm text-muted-foreground">Total Activities</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">{insights.averageXPPerDay}</div>
              <div className="text-sm text-muted-foreground">Avg XP/Day</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{insights.achievements.total}</div>
              <div className="text-sm text-muted-foreground">Badges Earned</div>
            </div>
            <div>
              <div className="text-2xl">{getActivityIcon(insights.favoriteActivity)}</div>
              <div className="text-sm text-muted-foreground">Favorite Activity</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline">Most Active: {insights.mostActiveCategory}</Badge>
            <Badge variant="secondary">Prefers: {insights.favoriteActivity}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {insights.achievements.recent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.achievements.recent.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                  </div>
                  <Badge variant="secondary">+{achievement.xpReward} XP</Badge>
                </div>
              ))}
            </div>
            <Link href="/achievements">
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Achievements
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Improvement Suggestions */}
      {insights.improvementAreas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Suggestions for Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.improvementAreas.map((area, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20"
                >
                  <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm">{area}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Link href="/challenges">
                <Button size="sm">Try Challenges</Button>
              </Link>
              <Link href="/quiz">
                <Button size="sm" variant="secondary">
                  Take Quiz
                </Button>
              </Link>
              <Link href="/games">
                <Button size="sm" variant="outline">
                  Play Games
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export { ProgressInsightsComponent as ProgressInsights }
