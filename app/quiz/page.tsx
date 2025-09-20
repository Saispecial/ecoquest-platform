"use client"

import { useState } from "react"
import { useGameStore } from "@/stores/game-store"
import { QuizSetup } from "@/components/quiz/quiz-setup"
import { QuizInterface } from "@/components/quiz/quiz-interface"
import { generateAIQuiz } from "@/lib/quiz-questions"
import type { QuizQuestion, QuizSession } from "@/lib/types"
import { BookOpen } from "lucide-react"

export default function QuizPage() {
  const { addQuizSession } = useGameStore()
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[] | null>(null)
  const [isQuizActive, setIsQuizActive] = useState(false)

  const handleStartQuiz = (questions: QuizQuestion[]) => {
    setCurrentQuestions(questions)
    setIsQuizActive(true)
  }

  const handleQuizComplete = (session: QuizSession) => {
    addQuizSession(session)
    setIsQuizActive(false)
  }

  const handleRestartQuiz = () => {
    setCurrentQuestions(null)
    setIsQuizActive(false)
  }

  const handleGenerateQuiz = async (count: number, category?: string, difficulty?: string): Promise<QuizQuestion[]> => {
    return generateAIQuiz(count, category as QuizQuestion["category"], difficulty as QuizQuestion["difficulty"])
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8" />
          Environmental Knowledge Quiz
        </h1>
        <p className="text-muted-foreground mt-2">Test and expand your sustainability knowledge</p>
      </div>

      {/* Quiz Content */}
      {!isQuizActive ? (
        <QuizSetup onStartQuiz={handleStartQuiz} onGenerateQuiz={handleGenerateQuiz} />
      ) : currentQuestions ? (
        <QuizInterface questions={currentQuestions} onComplete={handleQuizComplete} onRestart={handleRestartQuiz} />
      ) : null}
    </div>
  )
}
