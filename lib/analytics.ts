import type { PlayerProfile, Quest, QuizSession, MiniGameScore, Achievement } from "./types"

export interface ActivityData {
  date: string
  challenges: number
  quizzes: number
  games: number
  xpEarned: number
}

export interface CategoryStats {
  category: string
  completed: number
  totalXP: number
  averageScore?: number
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  streakHistory: { date: string; active: boolean }[]
}

export interface ProgressInsights {
  totalActivities: number
  totalXPEarned: number
  averageXPPerDay: number
  mostActiveCategory: string
  favoriteActivity: "challenges" | "quizzes" | "games"
  improvementAreas: string[]
  achievements: {
    total: number
    recent: Achievement[]
  }
}

export function generateActivityData(
  quests: Quest[],
  quizSessions: QuizSession[],
  miniGameScores: MiniGameScore[],
  days = 30,
): ActivityData[] {
  const endDate = new Date()
  const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)

  const activityMap = new Map<string, ActivityData>()

  // Initialize all dates with zero values
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0]
    activityMap.set(dateStr, {
      date: dateStr,
      challenges: 0,
      quizzes: 0,
      games: 0,
      xpEarned: 0,
    })
  }

  // Add quest completions
  quests
    .filter((q) => q.status === "completed" && q.completedAt)
    .forEach((quest) => {
      const dateStr = quest.completedAt!.toISOString().split("T")[0]
      const data = activityMap.get(dateStr)
      if (data) {
        data.challenges++
        data.xpEarned += quest.xpReward
      }
    })

  // Add quiz sessions
  quizSessions.forEach((session) => {
    const dateStr = session.completedAt.toISOString().split("T")[0]
    const data = activityMap.get(dateStr)
    if (data) {
      data.quizzes++
      data.xpEarned += session.xpEarned
    }
  })

  // Add mini game scores
  miniGameScores.forEach((score) => {
    const dateStr = score.playedAt.toISOString().split("T")[0]
    const data = activityMap.get(dateStr)
    if (data) {
      data.games++
      data.xpEarned += score.xpEarned
    }
  })

  return Array.from(activityMap.values()).sort((a, b) => a.date.localeCompare(b.date))
}

export function generateCategoryStats(quests: Quest[], quizSessions: QuizSession[]): CategoryStats[] {
  const categories = ["waste", "water", "energy", "transport", "biodiversity"] as const

  return categories.map((category) => {
    const categoryQuests = quests.filter((q) => q.type === category && q.status === "completed")
    const categoryQuizzes = quizSessions.filter((s) => s.questions.some((q) => q.category === category))

    const questXP = categoryQuests.reduce((sum, q) => sum + q.xpReward, 0)
    const quizXP = categoryQuizzes.reduce((sum, s) => sum + s.xpEarned, 0)

    const quizScores = categoryQuizzes.map((s) => (s.score / s.questions.length) * 100)
    const averageScore =
      quizScores.length > 0 ? quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length : 0

    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      completed: categoryQuests.length + categoryQuizzes.length,
      totalXP: questXP + quizXP,
      averageScore: Math.round(averageScore),
    }
  })
}

export function generateStreakData(player: PlayerProfile, activityData: ActivityData[]): StreakData {
  const streakHistory = activityData.map((data) => ({
    date: data.date,
    active: data.challenges > 0 || data.quizzes > 0 || data.games > 0,
  }))

  return {
    currentStreak: player.currentStreak,
    longestStreak: player.longestStreak,
    streakHistory,
  }
}

export function generateProgressInsights(
  player: PlayerProfile,
  quests: Quest[],
  quizSessions: QuizSession[],
  miniGameScores: MiniGameScore[],
  achievements: Achievement[],
  activityData: ActivityData[],
): ProgressInsights {
  const completedQuests = quests.filter((q) => q.status === "completed")
  const totalActivities = completedQuests.length + quizSessions.length + miniGameScores.length

  const activeDays = activityData.filter((d) => d.xpEarned > 0).length
  const averageXPPerDay = activeDays > 0 ? Math.round(player.totalXP / activeDays) : 0

  // Find most active category
  const categoryStats = generateCategoryStats(quests, quizSessions)
  const mostActiveCategory = categoryStats.reduce((max, cat) => (cat.completed > max.completed ? cat : max)).category

  // Find favorite activity type
  const challengeCount = completedQuests.length
  const quizCount = quizSessions.length
  const gameCount = miniGameScores.length

  let favoriteActivity: "challenges" | "quizzes" | "games" = "challenges"
  if (quizCount > challengeCount && quizCount > gameCount) favoriteActivity = "quizzes"
  else if (gameCount > challengeCount && gameCount > quizCount) favoriteActivity = "games"

  // Identify improvement areas
  const improvementAreas: string[] = []
  if (player.currentStreak < 3) improvementAreas.push("Build a longer daily streak")
  if (categoryStats.some((cat) => cat.completed === 0)) improvementAreas.push("Try activities in all categories")
  if (quizSessions.length < 5) improvementAreas.push("Take more quizzes to test knowledge")
  if (miniGameScores.length < 3) improvementAreas.push("Play more mini-games for fun learning")

  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const recentAchievements = unlockedAchievements
    .filter((a) => a.unlockedAt)
    .sort((a, b) => b.unlockedAt!.getTime() - a.unlockedAt!.getTime())
    .slice(0, 3)

  return {
    totalActivities,
    totalXPEarned: player.totalXP,
    averageXPPerDay,
    mostActiveCategory,
    favoriteActivity,
    improvementAreas,
    achievements: {
      total: unlockedAchievements.length,
      recent: recentAchievements,
    },
  }
}

export function getWeeklyComparison(activityData: ActivityData[]): {
  thisWeek: number
  lastWeek: number
  change: number
} {
  const now = new Date()
  const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const lastWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const thisWeekXP = activityData
    .filter((d) => new Date(d.date) >= thisWeekStart)
    .reduce((sum, d) => sum + d.xpEarned, 0)

  const lastWeekXP = activityData
    .filter((d) => new Date(d.date) >= lastWeekStart && new Date(d.date) < thisWeekStart)
    .reduce((sum, d) => sum + d.xpEarned, 0)

  const change = lastWeekXP > 0 ? Math.round(((thisWeekXP - lastWeekXP) / lastWeekXP) * 100) : 0

  return {
    thisWeek: thisWeekXP,
    lastWeek: lastWeekXP,
    change,
  }
}
