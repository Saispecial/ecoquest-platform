"use client"

import { useEffect } from "react"
import { useGameStore } from "@/stores/game-store"
import { WelcomeFlow } from "@/components/onboarding/welcome-flow"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Zap, Target, BookOpen, Gamepad2, TrendingUp, Calendar, Award, Leaf, DollarSign, TreePine, Lightbulb, Star } from "lucide-react"
import { generatePersonalizedTips, getNextRecommendedAction } from "@/lib/personalization"
import Link from "next/link"

export default function Dashboard() {
  const {
    player,
    updateStreak,
    getUnlockedAchievements,
    getAvailableQuests,
    getPersonalizedQuests,
    getCompletedQuests,
    getCurrentLevel,
    getProgressToNextLevel,
    updateImpactMetrics,
  } = useGameStore()

  useEffect(() => {
    updateStreak()
    updateImpactMetrics()
  }, [updateStreak, updateImpactMetrics])

  // Show onboarding if not completed
  if (!player.isOnboardingComplete) {
    return <WelcomeFlow />
  }

  const unlockedAchievements = getUnlockedAchievements()
  const availableQuests = getAvailableQuests()
  const personalizedQuests = getPersonalizedQuests()
  const completedQuests = getCompletedQuests()
  const currentLevel = getCurrentLevel()
  const progressToNextLevel = getProgressToNextLevel()
  
  // Get personalized content
  const personalizedTips = generatePersonalizedTips(player)
  const nextAction = getNextRecommendedAction(player, personalizedQuests)

  // Personalized greeting based on time and user preferences
  const getPersonalizedGreeting = () => {
    const hour = new Date().getHours()
    const displayName = player.displayName || player.name
    const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
    
    if (player.currentStreak > 0) {
      return `${timeGreeting}, ${displayName}! 🔥 ${player.currentStreak} day streak!`
    }
    return `${timeGreeting}, ${displayName}!`
  }

  // Get personalized motivation message
  const getMotivationMessage = () => {
    const { motivations, primaryGoals } = player.preferences
    
    if (motivations.includes("save_money") && player.stats.moneySaved > 0) {
      return `You've saved $${player.stats.moneySaved.toFixed(2)} this month! 💰`
    }
    if (motivations.includes("help_planet") && player.stats.co2Saved > 0) {
      return `You've prevented ${player.stats.co2Saved.toFixed(1)}kg of CO₂ emissions! 🌍`
    }
    if (primaryGoals.length > 0) {
      const goalEmojis = {
        reduce_waste: "♻️",
        save_energy: "⚡",
        conserve_water: "💧",
        sustainable_transport: "🚲",
        protect_nature: "🌱"
      }
      const primaryGoal = primaryGoals[0] as keyof typeof goalEmojis
      return `Keep working towards your ${goalEmojis[primaryGoal]} ${primaryGoal.replace('_', ' ')} goals!`
    }
    return "Ready to make a positive impact today?"
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Personalized Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">{getPersonalizedGreeting()}</h1>
        <p className="text-muted-foreground">{getMotivationMessage()}</p>
      </div>

      {/* Personalized Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{currentLevel}</div>
            <div className="text-sm text-muted-foreground">Level</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-secondary">{player.stats.co2Saved.toFixed(1)}kg</div>
            <div className="text-sm text-muted-foreground">CO₂ Saved</div>
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
            <div className="text-2xl font-bold text-chart-1">${player.stats.moneySaved.toFixed(0)}</div>
            <div className="text-sm text-muted-foreground">Money Saved</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Target className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">This Week's Goal</h3>
              <p className="text-sm text-muted-foreground">
                {player.weeklyTarget.currentWeekProgress} of {player.weeklyTarget.challengesPerWeek} challenges completed
              </p>
            </div>
          </div>
          <Progress 
            value={(player.weeklyTarget.currentWeekProgress / player.weeklyTarget.challengesPerWeek) * 100} 
            className="h-3" 
          />
        </CardContent>
      </Card>

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

      {/* Personalized Recommendations */}
      <Card className="bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Next Action</p>
                <p className="text-sm text-muted-foreground">{nextAction}</p>
              </div>
            </div>
            
            {personalizedTips.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Tips for You</span>
                </div>
                {personalizedTips.map((tip, index) => (
                  <p key={index} className="text-sm text-muted-foreground pl-6">{tip}</p>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/challenges">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-primary/20 hover:border-primary/40 h-full">
            <CardContent className="p-6 text-center space-y-3">
              <Target className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">Your Challenges</h3>
              <p className="text-sm text-muted-foreground">
                {personalizedQuests.length} personalized challenges
              </p>
              <Button className="w-full">Start Challenge</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/quiz">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-secondary/20 hover:border-secondary/40 h-full">
            <CardContent className="p-6 text-center space-y-3">
              <BookOpen className="h-8 w-8 text-secondary mx-auto" />
              <h3 className="font-semibold">
                {player.preferences.preferredActivities.includes("quizzes") ? "Recommended Quiz" : "AI Quiz"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {player.preferences.interests.length > 0 
                  ? `Focus on ${player.preferences.interests[0]} topics`
                  : "Test your eco knowledge"
                }
              </p>
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
              <h3 className="font-semibold">
                {player.preferences.preferredActivities.includes("games") ? "Your Games" : "Mini Games"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {player.preferences.experienceLevel === "beginner" 
                  ? "Beginner-friendly games"
                  : "Learn through play"
                }
              </p>
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

      {/* Personal Impact & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Challenges Completed</span>
              <span className="font-semibold">{completedQuests.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Streak</span>
              <span className="font-semibold flex items-center gap-1">
                {player.currentStreak} days
                {player.currentStreak > 0 && <span className="text-orange-500">🔥</span>}
              </span>
            </div>
            <div className="flex justify-between">
              <span>This Week's Goal</span>
              <span className="font-semibold">
                {player.weeklyTarget.currentWeekProgress}/{player.weeklyTarget.challengesPerWeek}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Favorite Category</span>
              <span className="font-semibold capitalize">
                {player.preferences.interests[0] || "All"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Your Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{player.stats.co2Saved.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">kg CO₂ saved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">${player.stats.moneySaved.toFixed(0)}</div>
                <div className="text-xs text-muted-foreground">money saved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-700">{player.stats.treesEquivalent}</div>
                <div className="text-xs text-muted-foreground">trees equivalent</div>
              </div>
            </div>
            
            {player.preferences.motivations.includes("save_money") && player.stats.moneySaved > 0 && (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  💰 You're on track to save ${(player.stats.moneySaved * 12).toFixed(0)} this year!
                </p>
              </div>
            )}
            
            <Link href="/analytics">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                View Detailed Impact
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
