"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import type { QuizQuestion } from "@/lib/types"
import { Brain, Play, Sparkles, Loader2 } from "lucide-react"

interface QuizSetupProps {
  onStartQuiz: (questions: QuizQuestion[]) => void
  onGenerateQuiz: (count: number, category?: string, difficulty?: string) => Promise<QuizQuestion[]>
}

export function QuizSetup({ onStartQuiz, onGenerateQuiz }: QuizSetupProps) {
  const [questionCount, setQuestionCount] = useState([5])
  const [selectedCategory, setSelectedCategory] = useState<string>("any")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("any")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleStartQuiz = async () => {
    setIsGenerating(true)
    try {
      const questions = await onGenerateQuiz(
        questionCount[0],
        selectedCategory === "any" ? undefined : selectedCategory,
        selectedDifficulty === "any" ? undefined : selectedDifficulty,
      )
      onStartQuiz(questions)
    } catch (error) {
      console.error("Failed to generate quiz:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-primary/5">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Brain className="h-6 w-6 text-secondary" />
            AI-Powered Environmental Quiz
          </CardTitle>
          <p className="text-muted-foreground">Test your environmental knowledge with personalized questions</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Count */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Number of Questions: {questionCount[0]}</label>
            <Slider
              value={questionCount}
              onValueChange={setQuestionCount}
              max={10}
              min={3}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>3 questions</span>
              <span>10 questions</span>
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Topic Focus</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Any topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">🌍 All Topics</SelectItem>
                <SelectItem value="waste">♻️ Waste Management</SelectItem>
                <SelectItem value="water">💧 Water Conservation</SelectItem>
                <SelectItem value="energy">⚡ Energy & Climate</SelectItem>
                <SelectItem value="transport">🚲 Sustainable Transport</SelectItem>
                <SelectItem value="biodiversity">🌱 Biodiversity & Nature</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty Level</label>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Any difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">🎯 Mixed Difficulty</SelectItem>
                <SelectItem value="easy">🟢 Easy</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="hard">🔴 Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quiz Preview */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <h4 className="font-medium text-sm">Quiz Preview:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{questionCount[0]} questions</Badge>
              {selectedCategory !== "any" && <Badge variant="outline">Topic: {selectedCategory}</Badge>}
              {selectedDifficulty !== "any" && <Badge variant="outline">Level: {selectedDifficulty}</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">
              Earn up to {questionCount[0] * 20} XP • Estimated time: {Math.ceil(questionCount[0] * 1.5)} minutes
            </p>
          </div>

          {/* Start Button */}
          <Button onClick={handleStartQuiz} disabled={isGenerating} className="w-full" size="lg">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Quiz
              </>
            )}
          </Button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              <span>Questions are AI-curated for your learning level</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
