"use client"

import { useGameStore } from "@/stores/game-store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Lock } from "lucide-react"

export default function AchievementsPage() {
  const { achievements, player, getCompletedQuests } = useGameStore()
  const completedQuests = getCompletedQuests()

  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const lockedAchievements = achievements.filter((a) => !a.unlocked)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8" />
          Achievements
        </h1>
        <p className="text-muted-foreground mt-2">
          {unlockedAchievements.length} of {achievements.length} badges earned
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary">{unlockedAchievements.length}</div>
            <div className="text-muted-foreground">Badges Earned</div>
            <Progress
              value={(unlockedAchievements.length / achievements.length) * 100}
              className="h-3 max-w-md mx-auto"
            />
          </div>
        </CardContent>
      </Card>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Earned Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div>
                    <h3 className="font-semibold text-primary">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Badge variant="secondary">+{achievement.xpReward} XP</Badge>
                  {achievement.unlockedAt && (
                    <p className="text-xs text-muted-foreground">
                      Earned {achievement.unlockedAt.toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Available Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="border-muted opacity-75">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="relative">
                    <div className="text-4xl opacity-50">{achievement.icon}</div>
                    <Lock className="h-4 w-4 absolute -top-1 -right-1 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-muted-foreground">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Badge variant="outline">+{achievement.xpReward} XP</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
