"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw } from "lucide-react"

interface WaterDrop {
  id: string
  x: number
  y: number
  speed: number
  type: "clean" | "polluted"
  size: number
}

interface WaterDropsGameProps {
  onGameComplete: (score: number) => void
  onGameExit: () => void
}

export function WaterDropsGame({ onGameComplete, onGameExit }: WaterDropsGameProps) {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(45)
  const [gameActive, setGameActive] = useState(false)
  const [bucketX, setBucketX] = useState(50) // percentage from left
  const [drops, setDrops] = useState<WaterDrop[]>([])
  const [streak, setStreak] = useState(0)
  const [dropsCaught, setDropsCaught] = useState(0)
  const [dropsLost, setDropsLost] = useState(0)
  const gameAreaRef = useRef<HTMLDivElement>(null)

  const createDrop = useCallback((): WaterDrop => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 90 + 5, // 5% to 95% from left
      y: -5,
      speed: Math.random() * 2 + 1, // 1-3 speed
      type: Math.random() > 0.8 ? "polluted" : "clean", // 20% chance of polluted
      size: Math.random() * 10 + 15, // 15-25px size
    }
  }, [])

  const startGame = () => {
    setGameActive(true)
    setScore(0)
    setTimeLeft(45)
    setDropsCaught(0)
    setDropsLost(0)
    setStreak(0)
    setBucketX(50)
    setDrops([])
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameAreaRef.current || !gameActive) return

    const rect = gameAreaRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    setBucketX(Math.max(5, Math.min(95, x)))
  }

  const checkCollisions = useCallback(() => {
    setDrops((prevDrops) => {
      const newDrops: WaterDrop[] = []
      let scoreChange = 0
      let caughtCount = 0
      let lostCount = 0
      let newStreak = streak

      prevDrops.forEach((drop) => {
        // Check if drop is caught by bucket
        const bucketLeft = bucketX - 8 // bucket width is ~16%
        const bucketRight = bucketX + 8
        const bucketTop = 85 // bucket is at 85% from top

        if (drop.y >= bucketTop && drop.y <= bucketTop + 5 && drop.x >= bucketLeft && drop.x <= bucketRight) {
          // Drop caught!
          if (drop.type === "clean") {
            const points = 10 + Math.floor(newStreak / 3) * 5 // bonus for streak
            scoreChange += points
            caughtCount++
            newStreak++
          } else {
            // Caught polluted water - penalty
            scoreChange -= 5
            newStreak = 0
          }
        } else if (drop.y > 100) {
          // Drop missed
          if (drop.type === "clean") {
            lostCount++
            newStreak = 0
          }
        } else {
          // Drop still falling
          newDrops.push({
            ...drop,
            y: drop.y + drop.speed,
          })
        }
      })

      setScore((prev) => Math.max(0, prev + scoreChange))
      setDropsCaught((prev) => prev + caughtCount)
      setDropsLost((prev) => prev + lostCount)
      setStreak(newStreak)

      return newDrops
    })
  }, [bucketX, streak])

  // Game loop
  useEffect(() => {
    if (!gameActive) return

    const gameLoop = setInterval(() => {
      // Add new drops occasionally
      if (Math.random() < 0.3) {
        setDrops((prev) => [...prev, createDrop()])
      }

      // Update drop positions and check collisions
      checkCollisions()
    }, 100)

    return () => clearInterval(gameLoop)
  }, [gameActive, createDrop, checkCollisions])

  // Timer
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

  if (!gameActive && timeLeft === 45) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          <div className="text-6xl">💧</div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Save the Water Drops</h2>
            <p className="text-muted-foreground">Catch clean water drops and avoid polluted ones!</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
              <span>Clean water drops = +10 points</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
              <span>Polluted drops = -5 points</span>
            </div>
            <div className="text-muted-foreground">Move your mouse to control the bucket</div>
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
    const accuracy = dropsCaught + dropsLost > 0 ? Math.round((dropsCaught / (dropsCaught + dropsLost)) * 100) : 0

    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          <div className="text-6xl">🏆</div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
            <div className="text-4xl font-bold text-primary mb-2">{score}</div>
            <p className="text-muted-foreground">Final Score</p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto text-sm">
            <div>
              <div className="font-semibold text-green-600">{dropsCaught}</div>
              <div className="text-muted-foreground">Caught</div>
            </div>
            <div>
              <div className="font-semibold text-red-600">{dropsLost}</div>
              <div className="text-muted-foreground">Lost</div>
            </div>
            <div>
              <div className="font-semibold">{accuracy}%</div>
              <div className="text-muted-foreground">Accuracy</div>
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
              <Badge variant="outline" className="text-green-600">
                Caught: {dropsCaught}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium">Time: {timeLeft}s</div>
              <Button onClick={onGameExit} variant="outline" size="sm">
                Exit Game
              </Button>
            </div>
          </div>
          <Progress value={(timeLeft / 45) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Game Area */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-0">
          <div
            ref={gameAreaRef}
            className="relative h-96 bg-gradient-to-b from-sky-100 to-sky-200 overflow-hidden cursor-none"
            onMouseMove={handleMouseMove}
          >
            {/* Water drops */}
            {drops.map((drop) => (
              <div
                key={drop.id}
                className={`absolute rounded-full ${
                  drop.type === "clean" ? "bg-blue-400" : "bg-gray-600"
                } transition-all duration-100`}
                style={{
                  left: `${drop.x}%`,
                  top: `${drop.y}%`,
                  width: `${drop.size}px`,
                  height: `${drop.size}px`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}

            {/* Bucket */}
            <div
              className="absolute bottom-8 w-16 h-12 bg-yellow-600 rounded-b-lg border-2 border-yellow-700 transition-all duration-75"
              style={{
                left: `${bucketX}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="w-full h-2 bg-yellow-500 rounded-t-sm"></div>
            </div>

            {/* Instructions */}
            <div className="absolute top-4 left-4 text-sm text-muted-foreground bg-white/80 p-2 rounded">
              Move mouse to control bucket
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
