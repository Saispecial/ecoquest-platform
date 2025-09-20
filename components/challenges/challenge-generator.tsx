"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useGameStore } from "@/stores/game-store"
import { generateAIChallenge } from "@/lib/challenges"
import type { Quest } from "@/lib/types"
import { Sparkles, Plus, Loader2 } from "lucide-react"

export function ChallengeGenerator() {
  const { addQuest } = useGameStore()
  const [selectedType, setSelectedType] = useState<Quest["type"] | "any">("any")
  const [selectedDifficulty, setSelectedDifficulty] = useState<Quest["difficulty"] | "any">("any")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateChallenge = async () => {
    setIsGenerating(true)
    try {
      const challengeTemplate = await generateAIChallenge(
        selectedType === "any" ? undefined : selectedType,
        selectedDifficulty === "any" ? undefined : selectedDifficulty,
      )

      const newQuest: Quest = {
        ...challengeTemplate,
        id: crypto.randomUUID(),
        status: "available",
        createdAt: new Date(),
      }

      addQuest(newQuest)
    } catch (error) {
      console.error("Failed to generate challenge:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border-dashed border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          Generate New Challenge
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Challenge Type</label>
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as Quest["type"] | "any")}>
              <SelectTrigger>
                <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any type</SelectItem>
                <SelectItem value="waste">♻️ Waste Management</SelectItem>
                <SelectItem value="water">💧 Water Conservation</SelectItem>
                <SelectItem value="energy">⚡ Energy Saving</SelectItem>
                <SelectItem value="transport">🚲 Sustainable Transport</SelectItem>
                <SelectItem value="biodiversity">🌱 Biodiversity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty Level</label>
            <Select
              value={selectedDifficulty}
              onValueChange={(value) => setSelectedDifficulty(value as Quest["difficulty"] | "any")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any difficulty</SelectItem>
                <SelectItem value="easy">🟢 Easy</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="hard">🔴 Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedType !== "any" && <Badge variant="secondary">Type: {selectedType}</Badge>}
          {selectedDifficulty !== "any" && <Badge variant="secondary">Difficulty: {selectedDifficulty}</Badge>}
        </div>

        <Button onClick={handleGenerateChallenge} disabled={isGenerating} className="w-full" size="lg">
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Challenge...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Generate Challenge
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          AI-powered challenges are personalized based on your preferences and learning progress
        </p>
      </CardContent>
    </Card>
  )
}
