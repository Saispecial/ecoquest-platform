"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trash2, Recycle, Leaf, RotateCcw, Play } from "lucide-react"

interface WasteItem {
  id: string
  name: string
  type: "compost" | "recycle" | "trash"
  icon: string
}

const WASTE_ITEMS: WasteItem[] = [
  { id: "banana-peel", name: "Banana Peel", type: "compost", icon: "🍌" },
  { id: "plastic-bottle", name: "Plastic Bottle", type: "recycle", icon: "🍼" },
  { id: "newspaper", name: "Newspaper", type: "recycle", icon: "📰" },
  { id: "apple-core", name: "Apple Core", type: "compost", icon: "🍎" },
  { id: "candy-wrapper", name: "Candy Wrapper", type: "trash", icon: "🍬" },
  { id: "glass-jar", name: "Glass Jar", type: "recycle", icon: "🫙" },
  { id: "coffee-grounds", name: "Coffee Grounds", type: "compost", icon: "☕" },
  { id: "chip-bag", name: "Chip Bag", type: "trash", icon: "🥔" },
  { id: "cardboard", name: "Cardboard Box", type: "recycle", icon: "📦" },
  { id: "eggshells", name: "Eggshells", type: "compost", icon: "🥚" },
]

interface WasteSortingGameProps {
  onGameComplete: (score: number) => void
  onGameExit: () => void
}

export function WasteSortingGame({ onGameComplete, onGameExit }: WasteSortingGameProps) {
  const [currentItem, setCurrentItem] = useState<WasteItem | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds
  const [gameActive, setGameActive] = useState(false)
  const [itemsProcessed, setItemsProcessed] = useState(0)
  const [streak, setStreak] = useState(0)
  const [feedback, setFeedback] = useState<{ message: string; type: "correct" | "incorrect" } | null>(null)

  const getRandomItem = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * WASTE_ITEMS.length)
    return WASTE_ITEMS[randomIndex]
  }, [])

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setTimeLeft(60)
    setItemsProcessed(0)
    setStreak(0)
    setCurrentItem(getRandomItem())
    setFeedback(null)
  }

  const handleBinChoice = (binType: "compost" | "recycle" | "trash") => {
    if (!currentItem || !gameActive) return

    const isCorrect = currentItem.type === binType
    const basePoints = isCorrect ? 10 : -5
    const streakBonus = isCorrect ? streak * 2 : 0
    const timeBonus = isCorrect ? Math.floor(timeLeft / 10) : 0

    const points = Math.max(0, basePoints + streakBonus + timeBonus)

    setScore((prev) => prev + points)
    setItemsProcessed((prev) => prev + 1)
    setStreak((prev) => (isCorrect ? prev + 1 : 0))

    setFeedback({
      message: isCorrect
        ? `Correct! +${points} points ${streak > 0 ? `(${streak} streak!)` : ""}`
        : `Wrong bin! ${currentItem.name} goes in ${currentItem.type}`,
      type: isCorrect ? "correct" : "incorrect",
    })

    setTimeout(() => {
      setFeedback(null)
      setCurrentItem(getRandomItem())
    }, 1500)
  }

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false)
          onGameComplete(score)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameActive, timeLeft, score, onGameComplete])

  const getBinColor = (binType: "compost" | "recycle" | "trash") => {
    switch (binType) {
      case "compost":
        return "bg-green-100 border-green-300 hover:bg-green-200 text-green-800"
      case "recycle":
        return "bg-blue-100 border-blue-300 hover:bg-blue-200 text-blue-800"
      case "trash":
        return "bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-800"
    }
  }

  const getBinIcon = (binType: "compost" | "recycle" | "trash") => {
    switch (binType) {
      case "compost":
        return <Leaf className="h-8 w-8" />
      case "recycle":
        return <Recycle className="h-8 w-8" />
      case "trash":
        return <Trash2 className="h-8 w-8" />
    }
  }

  if (!gameActive && timeLeft === 60) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          <div className="text-6xl">♻️</div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Waste Sorting Challenge</h2>
            <p className="text-muted-foreground">Sort items into the correct bins as quickly as possible!</p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center space-y-2">
              <div className="p-3 bg-green-100 rounded-lg">
                <Leaf className="h-6 w-6 text-green-600 mx-auto" />
              </div>
              <div className="text-sm font-medium">Compost</div>
            </div>
            <div className="text-center space-y-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Recycle className="h-6 w-6 text-blue-600 mx-auto" />
              </div>
              <div className="text-sm font-medium">Recycle</div>
            </div>
            <div className="text-center space-y-2">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Trash2 className="h-6 w-6 text-gray-600 mx-auto" />
              </div>
              <div className="text-sm font-medium">Trash</div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={startGame} size="lg">
              <Play className="h-4 w-4 mr-2" />
              Start Game
            </Button>
            <Button onClick={onGameExit} variant="outline" size="lg">
              Back to Games
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!gameActive && timeLeft === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          <div className="text-6xl">🏆</div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
            <div className="text-4xl font-bold text-primary mb-2">{score}</div>
            <p className="text-muted-foreground">Final Score</p>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-sm">
            <div>
              <div className="font-semibold">{itemsProcessed}</div>
              <div className="text-muted-foreground">Items Sorted</div>
            </div>
            <div>
              <div className="font-semibold">{Math.floor((score / itemsProcessed) * 10) / 10 || 0}</div>
              <div className="text-muted-foreground">Avg Points</div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={startGame} size="lg">
              <RotateCcw className="h-4 w-4 mr-2" />
              Play Again
            </Button>
            <Button onClick={onGameExit} variant="outline" size="lg">
              Back to Games
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Game Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                Score: {score}
              </Badge>
              <Badge variant="outline">Streak: {streak}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium">Time: {timeLeft}s</div>
              <Button onClick={onGameExit} variant="outline" size="sm">
                Exit Game
              </Button>
            </div>
          </div>
          <Progress value={(timeLeft / 60) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Item */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-8 text-center">
          {currentItem && (
            <div className="space-y-4">
              <div className="text-8xl">{currentItem.icon}</div>
              <div>
                <h3 className="text-2xl font-bold">{currentItem.name}</h3>
                <p className="text-muted-foreground">Where does this belong?</p>
              </div>
            </div>
          )}

          {feedback && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                feedback.type === "correct" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {feedback.message}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bins */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={() => handleBinChoice("compost")}
          className={`h-32 ${getBinColor("compost")} border-2`}
          variant="outline"
          disabled={!!feedback}
        >
          <div className="text-center space-y-2">
            {getBinIcon("compost")}
            <div className="font-semibold">Compost</div>
            <div className="text-xs">Organic waste</div>
          </div>
        </Button>

        <Button
          onClick={() => handleBinChoice("recycle")}
          className={`h-32 ${getBinColor("recycle")} border-2`}
          variant="outline"
          disabled={!!feedback}
        >
          <div className="text-center space-y-2">
            {getBinIcon("recycle")}
            <div className="font-semibold">Recycle</div>
            <div className="text-xs">Paper, plastic, glass</div>
          </div>
        </Button>

        <Button
          onClick={() => handleBinChoice("trash")}
          className={`h-32 ${getBinColor("trash")} border-2`}
          variant="outline"
          disabled={!!feedback}
        >
          <div className="text-center space-y-2">
            {getBinIcon("trash")}
            <div className="font-semibold">General Waste</div>
            <div className="text-xs">Non-recyclable items</div>
          </div>
        </Button>
      </div>
    </div>
  )
}
