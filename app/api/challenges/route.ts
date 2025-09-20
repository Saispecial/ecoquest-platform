import { NextResponse } from "next/server"
import { generateAIChallenge } from "@/lib/challenges"
import type { Quest } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, difficulty } = body

    // In a real implementation, this would call the Gemini API
    // For now, we use the fallback library
    const challengeTemplate = await generateAIChallenge(type, difficulty)

    const newQuest: Quest = {
      ...challengeTemplate,
      id: crypto.randomUUID(),
      status: "available",
      createdAt: new Date(),
    }

    return NextResponse.json(newQuest)
  } catch (error) {
    console.error("Error generating challenge:", error)
    return NextResponse.json({ error: "Failed to generate challenge" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Return a random challenge from the library
    const challengeTemplate = await generateAIChallenge()

    const newQuest: Quest = {
      ...challengeTemplate,
      id: crypto.randomUUID(),
      status: "available",
      createdAt: new Date(),
    }

    return NextResponse.json(newQuest)
  } catch (error) {
    console.error("Error fetching challenge:", error)
    return NextResponse.json({ error: "Failed to fetch challenge" }, { status: 500 })
  }
}
