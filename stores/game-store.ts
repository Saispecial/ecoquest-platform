import { create } from "zustand"
import type { GameState, Quest, Achievement, QuizSession, MiniGameScore, PlayerProfile } from "@/lib/types"
import { saveGameState, loadGameState, createInitialGameState } from "@/lib/storage"
import { checkAchievements } from "@/lib/achievements"
import { getPersonalizedQuests, calculateImpactMetrics } from "@/lib/personalization"

interface GameStore extends GameState {
  // Actions
  initializeGame: () => void
  updatePlayer: (updates: Partial<PlayerProfile>) => void
  addQuest: (quest: Quest) => void
  updateQuest: (questId: string, updates: Partial<Quest>) => void
  completeQuest: (questId: string) => void
  addQuizSession: (session: QuizSession) => void
  addMiniGameScore: (score: MiniGameScore) => void
  updateStreak: () => void
  resetGame: () => void

  // Computed values
  getAvailableQuests: () => Quest[]
  getPersonalizedQuests: () => Quest[]
  getCompletedQuests: () => Quest[]
  getUnlockedAchievements: () => Achievement[]
  getCurrentLevel: () => number
  getXPForNextLevel: () => number
  getProgressToNextLevel: () => number
  updateImpactMetrics: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  ...createInitialGameState(),

  // Actions
  initializeGame: () => {
    const savedState = loadGameState()
    if (savedState) {
      // Update achievements in case new ones were added
      const updatedAchievements = checkAchievements(
        savedState.achievements,
        savedState.player,
        savedState.quests,
        savedState.quizSessions,
        savedState.miniGameScores,
      )

      set({
        ...savedState,
        achievements: updatedAchievements,
      })
    } else {
      const initialState = createInitialGameState()
      set(initialState)
      saveGameState(initialState)
    }
  },

  updatePlayer: (updates) => {
    set((state) => {
      const newState = {
        ...state,
        player: { ...state.player, ...updates, lastActiveAt: new Date() },
      }
      saveGameState(newState)
      return newState
    })
  },

  addQuest: (quest) => {
    set((state) => {
      const newState = {
        ...state,
        quests: [...state.quests, quest],
      }
      saveGameState(newState)
      return newState
    })
  },

  updateQuest: (questId, updates) => {
    set((state) => {
      const newState = {
        ...state,
        quests: state.quests.map((q) => (q.id === questId ? { ...q, ...updates } : q)),
      }
      saveGameState(newState)
      return newState
    })
  },

  completeQuest: (questId) => {
    set((state) => {
      const quest = state.quests.find((q) => q.id === questId)
      if (!quest || quest.status === "completed") return state

      const newXP = state.player.totalXP + quest.xpReward
      const newLevel = Math.floor(newXP / 1000) + 1

      const updatedQuests = state.quests.map((q) =>
        q.id === questId ? { ...q, status: "completed" as const, completedAt: new Date() } : q,
      )

      // Calculate impact metrics
      const completedQuests = updatedQuests.filter(q => q.status === "completed")
      const impactMetrics = calculateImpactMetrics(completedQuests, state.player)

      // Update weekly progress
      const now = new Date()
      const weekStart = new Date(state.player.weeklyTarget.weekStartDate)
      const isCurrentWeek = now >= weekStart && now < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      const updatedPlayer = {
        ...state.player,
        totalXP: newXP,
        level: newLevel,
        lastActiveAt: new Date(),
        stats: {
          ...state.player.stats,
          challengesCompleted: state.player.stats.challengesCompleted + 1,
          co2Saved: impactMetrics.co2Saved,
          moneySaved: impactMetrics.moneySaved,
          treesEquivalent: impactMetrics.treesEquivalent,
        },
        weeklyTarget: {
          ...state.player.weeklyTarget,
          currentWeekProgress: isCurrentWeek 
            ? state.player.weeklyTarget.currentWeekProgress + 1
            : 1,
          weekStartDate: isCurrentWeek ? weekStart : now
        }
      }

      const updatedAchievements = checkAchievements(
        state.achievements,
        updatedPlayer,
        updatedQuests,
        state.quizSessions,
        state.miniGameScores,
      )

      const newState = {
        ...state,
        player: updatedPlayer,
        quests: updatedQuests,
        achievements: updatedAchievements,
      }

      saveGameState(newState)
      return newState
    })
  },

  addQuizSession: (session) => {
    set((state) => {
      const newXP = state.player.totalXP + session.xpEarned
      const newLevel = Math.floor(newXP / 1000) + 1

      const updatedPlayer = {
        ...state.player,
        totalXP: newXP,
        level: newLevel,
        lastActiveAt: new Date(),
        stats: {
          ...state.player.stats,
          quizzesCompleted: state.player.stats.quizzesCompleted + 1,
        },
      }

      const updatedQuizSessions = [...state.quizSessions, session]

      const updatedAchievements = checkAchievements(
        state.achievements,
        updatedPlayer,
        state.quests,
        updatedQuizSessions,
        state.miniGameScores,
      )

      const newState = {
        ...state,
        player: updatedPlayer,
        quizSessions: updatedQuizSessions,
        achievements: updatedAchievements,
      }

      saveGameState(newState)
      return newState
    })
  },

  addMiniGameScore: (score) => {
    set((state) => {
      const newXP = state.player.totalXP + score.xpEarned
      const newLevel = Math.floor(newXP / 1000) + 1

      const updatedPlayer = {
        ...state.player,
        totalXP: newXP,
        level: newLevel,
        lastActiveAt: new Date(),
        stats: {
          ...state.player.stats,
          miniGamesPlayed: state.player.stats.miniGamesPlayed + 1,
        },
      }

      const updatedMiniGameScores = [...state.miniGameScores, score]

      const updatedAchievements = checkAchievements(
        state.achievements,
        updatedPlayer,
        state.quests,
        state.quizSessions,
        updatedMiniGameScores,
      )

      const newState = {
        ...state,
        player: updatedPlayer,
        miniGameScores: updatedMiniGameScores,
        achievements: updatedAchievements,
      }

      saveGameState(newState)
      return newState
    })
  },

  updateStreak: () => {
    set((state) => {
      const now = new Date()
      const lastActive = new Date(state.player.lastActiveAt)
      const daysDiff = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24))

      let newStreak = state.player.currentStreak

      if (daysDiff === 1) {
        // Consecutive day
        newStreak += 1
      } else if (daysDiff > 1) {
        // Streak broken
        newStreak = 1
      }
      // If daysDiff === 0, same day, keep current streak

      const updatedPlayer = {
        ...state.player,
        currentStreak: newStreak,
        longestStreak: Math.max(state.player.longestStreak, newStreak),
        lastActiveAt: now,
      }

      const updatedAchievements = checkAchievements(
        state.achievements,
        updatedPlayer,
        state.quests,
        state.quizSessions,
        state.miniGameScores,
      )

      const newState = {
        ...state,
        player: updatedPlayer,
        achievements: updatedAchievements,
      }

      saveGameState(newState)
      return newState
    })
  },

  resetGame: () => {
    const initialState = createInitialGameState()
    set(initialState)
    saveGameState(initialState)
  },

  // Computed values
  getAvailableQuests: () => {
    const state = get()
    return state.quests.filter((q) => q.status === "available")
  },

  getPersonalizedQuests: () => {
    const state = get()
    const availableQuests = state.quests.filter((q) => q.status === "available")
    return getPersonalizedQuests(state.player, availableQuests)
  },

  getCompletedQuests: () => {
    const state = get()
    return state.quests.filter((q) => q.status === "completed")
  },

  getUnlockedAchievements: () => {
    const state = get()
    return state.achievements.filter((a) => a.unlocked)
  },

  getCurrentLevel: () => {
    const state = get()
    return Math.floor(state.player.totalXP / 1000) + 1
  },

  getXPForNextLevel: () => {
    const state = get()
    const currentLevel = Math.floor(state.player.totalXP / 1000) + 1
    return currentLevel * 1000
  },

  getProgressToNextLevel: () => {
    const state = get()
    const currentLevelXP = (state.getCurrentLevel() - 1) * 1000
    const nextLevelXP = state.getCurrentLevel() * 1000
    const progress = (state.player.totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)
    return Math.min(progress, 1)
  },

  updateImpactMetrics: () => {
    set((state) => {
      const completedQuests = state.quests.filter(q => q.status === "completed")
      const impactMetrics = calculateImpactMetrics(completedQuests, state.player)
      
      const updatedPlayer = {
        ...state.player,
        stats: {
          ...state.player.stats,
          co2Saved: impactMetrics.co2Saved,
          moneySaved: impactMetrics.moneySaved,
          treesEquivalent: impactMetrics.treesEquivalent,
        }
      }

      const newState = {
        ...state,
        player: updatedPlayer,
      }

      saveGameState(newState)
      return newState
    })
  },
}))
