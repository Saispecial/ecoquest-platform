"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { QuizQuestion, QuizSession } from "@/lib/types"
import { CheckCircle, XCircle, Brain, Award, RotateCcw, ArrowRight } from "lucide-react"

interface QuizInterfaceProps {
  questions: QuizQuestion[]
  onComplete: (session: QuizSession) => void
  onRestart: () => void
}

export function QuizInterface({ questions, onComplete, onRestart }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return

    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
    setShowResult(true)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setShowResult(false)
    } else {
      // Quiz completed
      const correctAnswers = selectedAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length
      const xpEarned = correctAnswers * 20 // 20 XP per correct answer

      const session: QuizSession = {
        id: crypto.randomUUID(),
        questions,
        answers: selectedAnswers,
        score: correctAnswers,
        xpEarned,
        completedAt: new Date(),
      }

      setQuizCompleted(true)
      onComplete(session)
    }
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  if (quizCompleted) {
    const correctAnswers = selectedAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length
    const percentage = Math.round((correctAnswers / questions.length) * 100)

    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Award className="h-6 w-6 text-secondary" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-4">
            <div className={`text-4xl font-bold ${getScoreColor(correctAnswers, questions.length)}`}>
              {correctAnswers}/{questions.length}
            </div>
            <div className="text-lg text-muted-foreground">
              {percentage}% Correct • +{correctAnswers * 20} XP Earned
            </div>
            <Progress value={percentage} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Correct Answers</div>
              <div className="text-lg font-semibold text-green-600">{correctAnswers}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Incorrect Answers</div>
              <div className="text-lg font-semibold text-red-600">{questions.length - correctAnswers}</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={onRestart} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Take Another Quiz
            </Button>
            <Button onClick={() => (window.location.href = "/")}>Return to Dashboard</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <Badge variant="secondary">{Math.round(progress)}% Complete</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-secondary" />
            <Badge variant="outline" className="capitalize">
              {currentQuestion.category}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {currentQuestion.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-xl leading-relaxed">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === index
              const isCorrect = index === currentQuestion.correctAnswer
              const showCorrectAnswer = showResult && isCorrect
              const showIncorrectAnswer = showResult && isSelected && !isCorrect

              return (
                <Button
                  key={index}
                  variant={
                    showCorrectAnswer
                      ? "default"
                      : showIncorrectAnswer
                        ? "destructive"
                        : isSelected
                          ? "secondary"
                          : "outline"
                  }
                  className={`w-full justify-start text-left h-auto p-4 ${
                    showCorrectAnswer
                      ? "bg-green-100 border-green-300 text-green-800 hover:bg-green-100"
                      : showIncorrectAnswer
                        ? "bg-red-100 border-red-300 text-red-800 hover:bg-red-100"
                        : ""
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {showCorrectAnswer && <CheckCircle className="h-5 w-5 flex-shrink-0" />}
                    {showIncorrectAnswer && <XCircle className="h-5 w-5 flex-shrink-0" />}
                  </div>
                </Button>
              )
            })}
          </div>

          {showResult && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-2 mb-2">
                <Brain className="h-4 w-4 mt-0.5 text-secondary flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium mb-1">Explanation:</div>
                  <div className="text-muted-foreground">{currentQuestion.explanation}</div>
                </div>
              </div>
            </div>
          )}

          {showResult && (
            <Button onClick={handleNextQuestion} className="w-full" size="lg">
              {currentQuestionIndex < questions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Complete Quiz
                  <Award className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
