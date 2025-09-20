"use client"

import { useEffect } from "react"
import { useGameStore } from "@/stores/game-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Zap, Target, BookOpen, Gamepad2, TrendingUp, Calendar, Award } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const {
    player,
    updateStreak,
    getUnlockedAchievements,
    getAvailableQuests,
    getCompletedQuests,
    getCurrentLevel,
    getProgressToNextLevel,
  } = useGameStore()

  useEffect(() => {
    updateStreak()
  }, [updateStreak])

  const unlockedAchievements = getUnlockedAchievements()
  const availableQuests = getAvailableQuests()
  const completedQuests = getCompletedQuests()
  const currentLevel = getCurrentLevel()
  const progressToNextLevel = getProgressToNextLevel()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Welcome back, {player.name}!</h1>
        <p className="text-muted-foreground">Ready to make a positive impact today?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{currentLevel}</div>
            <div className="text-sm text-muted-foreground">Level</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-secondary">{player.totalXP}</div>
            <div className="text-sm text-muted-foreground">Total XP</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent">{player.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-chart-1">{unlockedAchievements.length}</div>
            <div className="text-sm text-muted-foreground">Badges</div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">Level Progress</h3>
              <p className="text-sm text-muted-foreground">
                {Math.round(progressToNextLevel * 100)}% to Level {currentLevel + 1}
              </p>
            </div>
          </div>
          <Progress value={progressToNextLevel * 100} className="h-3" />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/challenges">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-primary/20 hover:border-primary/40 h-full">
            <CardContent className="p-6 text-center space-y-3">
              <Target className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">Eco Challenges</h3>
              <p className="text-sm text-muted-foreground">{availableQuests.length} challenges available</p>
              <Button className="w-full">Start Challenge</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/quiz">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-secondary/20 hover:border-secondary/40 h-full">
            <CardContent className="p-6 text-center space-y-3">
              <BookOpen className="h-8 w-8 text-secondary mx-auto" />
              <h3 className="font-semibold">AI Quiz</h3>
              <p className="text-sm text-muted-foreground">Test your eco knowledge</p>
              <Button variant="secondary" className="w-full">
                Take Quiz
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/games">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-accent/20 hover:border-accent/40 h-full">
            <CardContent className="p-6 text-center space-y-3">
              <Gamepad2 className="h-8 w-8 text-accent mx-auto" />
              <h3 className="font-semibold">Mini Games</h3>
              <p className="text-sm text-muted-foreground">Learn through play</p>
              <Button variant="outline" className="w-full bg-transparent">
                Play Games
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Achievements */}
      {unlockedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {unlockedAchievements.slice(-6).map((achievement) => (
                <Badge key={achievement.id} variant="secondary" className="flex items-center gap-1 p-2">
                  <span className="text-lg">{achievement.icon}</span>
                  <span className="text-sm">{achievement.title}</span>
                </Badge>
              ))}
            </div>
            {unlockedAchievements.length > 6 && (
              <Link href="/achievements">
                <Button variant="ghost" size="sm" className="mt-3">
                  View All Achievements
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Challenges Completed</span>
              <span className="font-semibold">{completedQuests.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Quizzes Taken</span>
              <span className="font-semibold">{player.stats.quizzesCompleted}</span>
            </div>
            <div className="flex justify-between">
              <span>Games Played</span>
              <span className="font-semibold">{player.stats.miniGamesPlayed}</span>
            </div>
            <div className="flex justify-between">
              <span>Longest Streak</span>
              <span className="font-semibold">{player.longestStreak} days</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">{completedQuests.length * 2}</div>
              <div className="text-sm text-muted-foreground">Eco-actions completed</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-secondary">{Math.floor(player.totalXP / 10)}</div>
              <div className="text-sm text-muted-foreground">Sustainability points earned</div>
            </div>
            <Link href="/analytics">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                View Detailed Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
