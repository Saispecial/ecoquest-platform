import { NextResponse } from "next/server"
import { generateAIQuiz } from "@/lib/quiz-questions"
import type { QuizQuestion } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { count = 5, category, difficulty } = body

    // In a real implementation, this would call the Gemini API
    // For now, we use the question bank as fallback
    const questions = await generateAIQuiz(count, category, difficulty)

    return NextResponse.json(questions)
  } catch (error) {
    console.error("Error generating quiz:", error)
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const count = Number.parseInt(searchParams.get("count") || "5")
    const category = searchParams.get("category") || undefined
    const difficulty = searchParams.get("difficulty") || undefined

    const questions = await generateAIQuiz(
      count,
      category as QuizQuestion["category"],
      difficulty as QuizQuestion["difficulty"],
    )

    return NextResponse.json(questions)
  } catch (error) {
    console.error("Error fetching quiz:", error)
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 })
  }
}
