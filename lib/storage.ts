import type { GameState } from "./types"
import { ACHIEVEMENTS } from "./achievements"

const STORAGE_KEY = "ecoquest-game-state"

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        lastUpdated: new Date().toISOString(),
      }),
    )
  } catch (error) {
    console.error("Failed to save game state:", error)
  }
}

export function loadGameState(): GameState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored)

    // Convert date strings back to Date objects
    return {
      ...parsed,
      player: {
        ...parsed.player,
        joinedAt: new Date(parsed.player.joinedAt),
        lastActiveAt: new Date(parsed.player.lastActiveAt),
      },
      quests: parsed.quests.map((q: any) => ({
        ...q,
        createdAt: new Date(q.createdAt),
        completedAt: q.completedAt ? new Date(q.completedAt) : undefined,
      })),
      achievements: parsed.achievements.map((a: any) => ({
        ...a,
        unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : undefined,
      })),
      quizSessions: parsed.quizSessions.map((s: any) => ({
        ...s,
        completedAt: new Date(s.completedAt),
      })),
      miniGameScores: parsed.miniGameScores.map((s: any) => ({
        ...s,
        playedAt: new Date(s.playedAt),
      })),
      lastUpdated: new Date(parsed.lastUpdated),
    }
  } catch (error) {
    console.error("Failed to load game state:", error)
    return null
  }
}

export function createInitialGameState(): GameState {
  const now = new Date()

  return {
    player: {
      id: crypto.randomUUID(),
      name: "Eco Explorer",
      level: 1,
      totalXP: 0,
      currentStreak: 0,
      longestStreak: 0,
      joinedAt: now,
      lastActiveAt: now,
      theme: "light",
      stats: {
        challengesCompleted: 0,
        quizzesCompleted: 0,
        miniGamesPlayed: 0,
        badgesEarned: 0,
      },
    },
    quests: [],
    achievements: [...ACHIEVEMENTS],
    quizSessions: [],
    miniGameScores: [],
    lastUpdated: now,
  }
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Failed to clear game state:", error)
  }
}
