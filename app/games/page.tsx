"use client"

import { useState } from "react"
import { useGameStore } from "@/stores/game-store"
import { GameCard } from "@/components/games/game-card"
import { WasteSortingGame } from "@/components/games/waste-sorting-game"
import { WaterDropsGame } from "@/components/games/water-drops-game"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MINI_GAMES, getMiniGameById } from "@/lib/mini-games"
import type { MiniGame } from "@/lib/mini-games"
import { Gamepad2, Filter, Trophy } from "lucide-react"

export default function GamesPage() {
  const { addMiniGameScore, miniGameScores } = useGameStore()
  const [currentGame, setCurrentGame] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | MiniGame["category"]>("all")

  const filteredGames = filter === "all" ? MINI_GAMES : MINI_GAMES.filter((game) => game.category === filter)

  const getBestScore = (gameId: string) => {
    const gameScores = miniGameScores.filter((score) => score.gameId === gameId)
    return gameScores.length > 0 ? Math.max(...gameScores.map((score) => score.score)) : undefined
  }

  const handlePlayGame = (gameId: string) => {
    setCurrentGame(gameId)
  }

  const handleGameComplete = (score: number) => {
    if (!currentGame) return

    const game = getMiniGameById(currentGame)
    if (!game) return

    const gameScore = {
      id: crypto.randomUUID(),
      gameId: currentGame,
      gameName: game.title,
      score,
      xpEarned: Math.floor((score / game.maxScore) * game.xpReward),
      playedAt: new Date(),
    }

    addMiniGameScore(gameScore)
    setCurrentGame(null)
  }

  const handleGameExit = () => {
    setCurrentGame(null)
  }

  // Render specific game component
  if (currentGame) {
    switch (currentGame) {
      case "waste-sorting":
        return <WasteSortingGame onGameComplete={handleGameComplete} onGameExit={handleGameExit} />
      case "water-drops":
        return <WaterDropsGame onGameComplete={handleGameComplete} onGameExit={handleGameExit} />
      default:
        // For games not yet implemented, show coming soon
        const game = getMiniGameById(currentGame)
        return (
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="text-6xl">{game?.icon}</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">{game?.title}</h2>
              <p className="text-muted-foreground">This game is coming soon!</p>
            </div>
            <Button onClick={handleGameExit} size="lg">
              Back to Games
            </Button>
          </div>
        )
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-accent flex items-center gap-2">
            <Gamepad2 className="h-8 w-8" />
            Mini Games
          </h1>
          <p className="text-muted-foreground mt-2">Learn sustainability through interactive games</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">{MINI_GAMES.length} Games Available</Badge>
          <Badge variant="outline">{miniGameScores.length} Games Played</Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          All Games
        </Button>
        <Button variant={filter === "waste" ? "default" : "outline"} size="sm" onClick={() => setFilter("waste")}>
          ♻️ Waste
        </Button>
        <Button variant={filter === "water" ? "default" : "outline"} size="sm" onClick={() => setFilter("water")}>
          💧 Water
        </Button>
        <Button variant={filter === "energy" ? "default" : "outline"} size="sm" onClick={() => setFilter("energy")}>
          ⚡ Energy
        </Button>
        <Button
          variant={filter === "transport" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("transport")}
        >
          🚲 Transport
        </Button>
        <Button
          variant={filter === "biodiversity" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("biodiversity")}
        >
          🌱 Nature
        </Button>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <GameCard key={game.id} game={game} onPlayGame={handlePlayGame} bestScore={getBestScore(game.id)} />
        ))}
      </div>

      {/* Player Stats */}
      {miniGameScores.length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-accent" />
            <h3 className="font-semibold">Your Gaming Stats</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-accent">{miniGameScores.length}</div>
              <div className="text-sm text-muted-foreground">Games Played</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {miniGameScores.reduce((sum, score) => sum + score.xpEarned, 0)}
              </div>
              <div className="text-sm text-muted-foreground">XP Earned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">
                {Math.round(miniGameScores.reduce((sum, score) => sum + score.score, 0) / miniGameScores.length)}
              </div>
              <div className="text-sm text-muted-foreground">Avg Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-chart-1">
                {Math.max(...miniGameScores.map((score) => score.score))}
              </div>
              <div className="text-sm text-muted-foreground">Best Score</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
