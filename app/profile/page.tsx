"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useGameStore } from "@/stores/game-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { User, Trophy, Target, Calendar, RotateCcw, AlertTriangle } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { player, updatePlayer, resetGame, getUnlockedAchievements, getCompletedQuests, getProgressToNextLevel } =
    useGameStore()

  const [playerName, setPlayerName] = useState(player.name)
  const [isEditing, setIsEditing] = useState(false)

  const unlockedAchievements = getUnlockedAchievements()
  const completedQuests = getCompletedQuests()
  const progressToNextLevel = getProgressToNextLevel()

  const handleSaveName = () => {
    updatePlayer({ name: playerName })
    setIsEditing(false)
  }

  const handleResetGame = () => {
    console.log("[v0] Resetting game data...")
    resetGame()
    console.log("[v0] Game reset complete, redirecting to dashboard...")
    // Force a page refresh to ensure all components re-render with fresh data
    window.location.href = "/"
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/20 rounded-lg">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Player Profile</h1>
          <p className="text-muted-foreground">Manage your EcoQuest account and progress</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Player Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Player Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="player-name">Player Name</Label>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    id="player-name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your name"
                  />
                  <Button onClick={handleSaveName} size="sm">
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setPlayerName(player.name)
                      setIsEditing(false)
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="font-medium">{player.name}</span>
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Level</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {player.level}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Total XP</Label>
                <p className="text-lg font-semibold">{player.totalXP.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Progress to Next Level</Label>
              <Progress value={progressToNextLevel * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{Math.round(progressToNextLevel * 100)}% complete</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <Label className="text-sm text-muted-foreground">Current Streak</Label>
                <p className="text-lg font-semibold">{player.currentStreak} days</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Best Streak</Label>
                <p className="text-lg font-semibold">{player.longestStreak} days</p>
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Member Since</Label>
              <p className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(player.joinedAt)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">{completedQuests.length}</p>
                <p className="text-sm text-muted-foreground">Challenges Completed</p>
              </div>
              <div className="text-center p-4 bg-secondary/10 rounded-lg">
                <Trophy className="h-6 w-6 mx-auto mb-2 text-secondary" />
                <p className="text-2xl font-bold">{unlockedAchievements.length}</p>
                <p className="text-sm text-muted-foreground">Achievements Unlocked</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Quizzes Completed</Label>
                <p className="text-lg font-semibold">{player.stats.quizzesCompleted}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Games Played</Label>
                <p className="text-lg font-semibold">{player.stats.miniGamesPlayed}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm text-muted-foreground">Last Active</Label>
              <p>{formatDate(player.lastActiveAt)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone Card */}
        <Card className="md:col-span-2 border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions that will permanently affect your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset All Progress
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Reset All Progress?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>This action cannot be undone. This will permanently:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Reset your level back to 1</li>
                      <li>Clear all {player.totalXP.toLocaleString()} XP points</li>
                      <li>Remove all {completedQuests.length} completed challenges</li>
                      <li>Lock all {unlockedAchievements.length} achievements</li>
                      <li>Clear quiz history and game scores</li>
                      <li>Reset your {player.currentStreak}-day streak</li>
                    </ul>
                    <p className="font-semibold text-destructive">Are you absolutely sure you want to start over?</p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetGame} className="bg-destructive hover:bg-destructive/90">
                    Yes, Reset Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-sm text-muted-foreground mt-2">
              This will reset all your progress and return you to the beginning of your EcoQuest journey.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
