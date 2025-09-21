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
        preferences: parsed.player.preferences || {
          interests: [],
          experienceLevel: "beginner",
          primaryGoals: [],
          availableTime: "10-20min",
          preferredActivities: [],
          motivations: [],
        },
        personalGoals: parsed.player.personalGoals || [],
        weeklyTarget: parsed.player.weeklyTarget || {
          challengesPerWeek: 3,
          currentWeekProgress: 0,
          weekStartDate: new Date(),
        },
        stats: {
          ...parsed.player.stats,
          co2Saved: parsed.player.stats.co2Saved || 0,
          moneySaved: parsed.player.stats.moneySaved || 0,
          treesEquivalent: parsed.player.stats.treesEquivalent || 0,
        },
        isOnboardingComplete: parsed.player.isOnboardingComplete || false,
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
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay()) // Start of current week

  return {
    player: {
      id: crypto.randomUUID(),
      name: "",
      displayName: "",
      level: 1,
      totalXP: 0,
      currentStreak: 0,
      longestStreak: 0,
      joinedAt: now,
      lastActiveAt: now,
      theme: "light",
      isOnboardingComplete: false,
      preferences: {
        interests: [],
        experienceLevel: "beginner",
        primaryGoals: [],
        availableTime: "10-20min",
        preferredActivities: [],
        motivations: [],
      },
      personalGoals: [],
      stats: {
        challengesCompleted: 0,
        quizzesCompleted: 0,
        miniGamesPlayed: 0,
        badgesEarned: 0,
        co2Saved: 0,
        moneySaved: 0,
        treesEquivalent: 0,
      },
      weeklyTarget: {
        challengesPerWeek: 3,
        currentWeekProgress: 0,
        weekStartDate: weekStart,
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
