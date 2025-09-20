import type { Achievement, PlayerProfile, Quest, QuizSession, MiniGameScore } from "./types"

export const ACHIEVEMENTS: Achievement[] = [
  // Waste Management Badges
  {
    id: "waste-warrior-1",
    title: "Waste Warrior",
    description: "Complete 5 waste management challenges",
    icon: "♻️",
    category: "waste",
    requirement: { type: "quest_count", value: 5, category: "waste" },
    xpReward: 100,
    unlocked: false,
  },
  {
    id: "waste-master",
    title: "Waste Master",
    description: "Complete 15 waste management challenges",
    icon: "🗂️",
    category: "waste",
    requirement: { type: "quest_count", value: 15, category: "waste" },
    xpReward: 250,
    unlocked: false,
  },

  // Water Conservation Badges
  {
    id: "jal-rakshak",
    title: "Jal Rakshak",
    description: "Complete 5 water conservation challenges",
    icon: "💧",
    category: "water",
    requirement: { type: "quest_count", value: 5, category: "water" },
    xpReward: 100,
    unlocked: false,
  },
  {
    id: "water-guardian",
    title: "Water Guardian",
    description: "Complete 15 water conservation challenges",
    icon: "🌊",
    category: "water",
    requirement: { type: "quest_count", value: 15, category: "water" },
    xpReward: 250,
    unlocked: false,
  },

  // Biodiversity Badges
  {
    id: "biodiversity-scout",
    title: "Biodiversity Scout",
    description: "Complete 5 biodiversity challenges",
    icon: "🌱",
    category: "biodiversity",
    requirement: { type: "quest_count", value: 5, category: "biodiversity" },
    xpReward: 100,
    unlocked: false,
  },
  {
    id: "nature-protector",
    title: "Nature Protector",
    description: "Complete 15 biodiversity challenges",
    icon: "🌳",
    category: "biodiversity",
    requirement: { type: "quest_count", value: 15, category: "biodiversity" },
    xpReward: 250,
    unlocked: false,
  },

  // Energy Conservation Badges
  {
    id: "energy-saver",
    title: "Energy Saver",
    description: "Complete 5 energy conservation challenges",
    icon: "⚡",
    category: "energy",
    requirement: { type: "quest_count", value: 5, category: "energy" },
    xpReward: 100,
    unlocked: false,
  },

  // Transport Badges
  {
    id: "green-commuter",
    title: "Green Commuter",
    description: "Complete 5 sustainable transport challenges",
    icon: "🚲",
    category: "transport",
    requirement: { type: "quest_count", value: 5, category: "transport" },
    xpReward: 100,
    unlocked: false,
  },

  // Streak Badges
  {
    id: "consistent-learner",
    title: "Consistent Learner",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    category: "streak",
    requirement: { type: "streak_days", value: 7 },
    xpReward: 150,
    unlocked: false,
  },
  {
    id: "dedication-master",
    title: "Dedication Master",
    description: "Maintain a 30-day streak",
    icon: "🏆",
    category: "streak",
    requirement: { type: "streak_days", value: 30 },
    xpReward: 500,
    unlocked: false,
  },

  // Quiz Badges
  {
    id: "quiz-champion",
    title: "Quiz Champion",
    description: "Score 100% on 5 quizzes",
    icon: "🧠",
    category: "quiz",
    requirement: { type: "quiz_score", value: 5 },
    xpReward: 200,
    unlocked: false,
  },

  // Game Badges
  {
    id: "game-master",
    title: "Game Master",
    description: "Play 10 mini-games",
    icon: "🎮",
    category: "game",
    requirement: { type: "game_score", value: 10 },
    xpReward: 150,
    unlocked: false,
  },
]

export function checkAchievements(
  achievements: Achievement[],
  player: PlayerProfile,
  quests: Quest[],
  quizSessions: QuizSession[],
  miniGameScores: MiniGameScore[],
): Achievement[] {
  return achievements.map((achievement) => {
    if (achievement.unlocked) return achievement

    let isUnlocked = false

    switch (achievement.requirement.type) {
      case "quest_count":
        const completedQuests = quests.filter(
          (q) =>
            q.status === "completed" &&
            (!achievement.requirement.category || q.type === achievement.requirement.category),
        )
        isUnlocked = completedQuests.length >= achievement.requirement.value
        break

      case "streak_days":
        isUnlocked = player.currentStreak >= achievement.requirement.value
        break

      case "quiz_score":
        const perfectQuizzes = quizSessions.filter((session) => session.score === session.questions.length)
        isUnlocked = perfectQuizzes.length >= achievement.requirement.value
        break

      case "game_score":
        isUnlocked = miniGameScores.length >= achievement.requirement.value
        break

      case "xp_total":
        isUnlocked = player.totalXP >= achievement.requirement.value
        break
    }

    return {
      ...achievement,
      unlocked: isUnlocked,
      unlockedAt: isUnlocked && !achievement.unlocked ? new Date() : achievement.unlockedAt,
    }
  })
}
