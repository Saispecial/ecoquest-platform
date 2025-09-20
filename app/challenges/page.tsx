"use client"

import { useState } from "react"
import { useGameStore } from "@/stores/game-store"
import { ChallengeCard } from "@/components/challenges/challenge-card"
import { ChallengeGenerator } from "@/components/challenges/challenge-generator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Filter, RotateCcw } from "lucide-react"
import type { Quest } from "@/lib/types"

export default function ChallengesPage() {
  const { quests, getAvailableQuests, getCompletedQuests } = useGameStore()
  const [filter, setFilter] = useState<"all" | Quest["type"]>("all")
  const [sortBy, setSortBy] = useState<"newest" | "difficulty" | "xp">("newest")

  const availableQuests = getAvailableQuests()
  const inProgressQuests = quests.filter((q) => q.status === "in-progress")
  const completedQuests = getCompletedQuests()

  const filterQuests = (questList: Quest[]) => {
    let filtered = filter === "all" ? questList : questList.filter((q) => q.type === filter)

    // Sort quests
    switch (sortBy) {
      case "newest":
        filtered = filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case "difficulty":
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
        filtered = filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
        break
      case "xp":
        filtered = filtered.sort((a, b) => b.xpReward - a.xpReward)
        break
    }

    return filtered
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Target className="h-8 w-8" />
            Eco Challenges
          </h1>
          <p className="text-muted-foreground mt-2">Take on real-world sustainability challenges</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">{availableQuests.length} Available</Badge>
          <Badge variant="outline">{inProgressQuests.length} In Progress</Badge>
          <Badge variant="outline">{completedQuests.length} Completed</Badge>
        </div>
      </div>

      {/* Challenge Generator */}
      <ChallengeGenerator />

      {/* Filters and Sorting */}
      {quests.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All Types
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

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border rounded px-2 py-1 bg-background"
            >
              <option value="newest">Newest First</option>
              <option value="difficulty">By Difficulty</option>
              <option value="xp">By XP Reward</option>
            </select>
          </div>
        </div>
      )}

      {/* Challenge Lists */}
      {quests.length > 0 ? (
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Available ({filterQuests(availableQuests).length})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({filterQuests(inProgressQuests).length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({filterQuests(completedQuests).length})</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            {filterQuests(availableQuests).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterQuests(availableQuests).map((quest) => (
                  <ChallengeCard key={quest.id} quest={quest} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Available Challenges</h3>
                <p className="text-muted-foreground mb-4">
                  {filter !== "all"
                    ? `No ${filter} challenges available. Try a different filter or generate new challenges.`
                    : "Generate your first challenge to get started!"}
                </p>
                <Button onClick={() => setFilter("all")} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            {filterQuests(inProgressQuests).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterQuests(inProgressQuests).map((quest) => (
                  <ChallengeCard key={quest.id} quest={quest} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Challenges in Progress</h3>
                <p className="text-muted-foreground">Start a challenge from the Available tab to see it here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filterQuests(completedQuests).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterQuests(completedQuests).map((quest) => (
                  <ChallengeCard key={quest.id} quest={quest} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Completed Challenges</h3>
                <p className="text-muted-foreground">Complete challenges to see your achievements here.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Challenges Yet</h3>
          <p className="text-muted-foreground mb-4">
            Generate your first eco-challenge to start making a positive impact!
          </p>
        </div>
      )}
    </div>
  )
}
