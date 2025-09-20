"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useGameStore } from "@/stores/game-store"
import type { Quest } from "@/lib/types"
import { Target, Clock, Award, CheckCircle, Play, Pause, Recycle, Droplets, Zap, Car, Leaf } from "lucide-react"

interface ChallengeCardProps {
  quest: Quest
}

const typeIcons = {
  waste: Recycle,
  water: Droplets,
  energy: Zap,
  transport: Car,
  biodiversity: Leaf,
}

const typeColors = {
  waste: "text-green-600 bg-green-100",
  water: "text-blue-600 bg-blue-100",
  energy: "text-yellow-600 bg-yellow-100",
  transport: "text-purple-600 bg-purple-100",
  biodiversity: "text-emerald-600 bg-emerald-100",
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
}

export function ChallengeCard({ quest }: ChallengeCardProps) {
  const { updateQuest, completeQuest } = useGameStore()
  const [isExpanded, setIsExpanded] = useState(false)

  const TypeIcon = typeIcons[quest.type]

  const handleStartChallenge = () => {
    updateQuest(quest.id, { status: "in-progress" })
  }

  const handleCompleteChallenge = () => {
    completeQuest(quest.id)
  }

  const handlePauseChallenge = () => {
    updateQuest(quest.id, { status: "available" })
  }

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-lg ${
        quest.status === "completed"
          ? "border-green-200 bg-green-50/50"
          : quest.status === "in-progress"
            ? "border-primary/40 bg-primary/5"
            : "hover:border-primary/30"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className={`p-2 rounded-lg ${typeColors[quest.type]}`}>
              <TypeIcon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight">{quest.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={difficultyColors[quest.difficulty]}>
                  {quest.difficulty}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {quest.xpReward} XP
                </Badge>
                {quest.isAIGenerated && (
                  <Badge variant="outline" className="text-xs">
                    AI Generated
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {quest.status === "completed" && <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className={`text-sm text-muted-foreground ${isExpanded ? "" : "line-clamp-2"}`}>{quest.description}</p>
          {quest.description.length > 100 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 mt-1 text-xs"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Target className="h-4 w-4" />
          <span>{quest.realm}</span>
        </div>

        {quest.status === "in-progress" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium">Challenge in progress</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {quest.status === "available" && (
            <Button onClick={handleStartChallenge} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              Start Challenge
            </Button>
          )}

          {quest.status === "in-progress" && (
            <>
              <Button onClick={handleCompleteChallenge} className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete
              </Button>
              <Button variant="outline" onClick={handlePauseChallenge}>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            </>
          )}

          {quest.status === "completed" && (
            <Button disabled className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </Button>
          )}
        </div>

        {quest.completedAt && (
          <p className="text-xs text-muted-foreground text-center">
            Completed on {quest.completedAt.toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
