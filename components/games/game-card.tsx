"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { MiniGame } from "@/lib/mini-games"
import { Clock, Award, Play, Star } from "lucide-react"

interface GameCardProps {
  game: MiniGame
  onPlayGame: (gameId: string) => void
  bestScore?: number
}

const difficultyColors = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
}

const categoryColors = {
  waste: "text-green-600 bg-green-100",
  water: "text-blue-600 bg-blue-100",
  energy: "text-yellow-600 bg-yellow-100",
  transport: "text-purple-600 bg-purple-100",
  biodiversity: "text-emerald-600 bg-emerald-100",
}

export function GameCard({ game, onPlayGame, bestScore }: GameCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-primary/20 hover:border-primary/40">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className={`p-3 rounded-lg text-2xl ${categoryColors[game.category]}`}>{game.icon}</div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight">{game.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{game.description}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={difficultyColors[game.difficulty]}>
            {game.difficulty}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {game.estimatedTime}m
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            {game.xpReward} XP
          </Badge>
        </div>

        {bestScore && (
          <div className="flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-muted-foreground">Best Score:</span>
            <span className="font-semibold">{bestScore}</span>
          </div>
        )}

        <div className="space-y-2">
          <div className="text-sm font-medium">How to Play:</div>
          <ul className="text-xs text-muted-foreground space-y-1">
            {game.instructions.slice(0, 3).map((instruction, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button onClick={() => onPlayGame(game.id)} className="w-full">
          <Play className="h-4 w-4 mr-2" />
          Play Game
        </Button>
      </CardContent>
    </Card>
  )
}
