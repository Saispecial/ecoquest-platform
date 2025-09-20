export interface PlayerProfile {
  id: string
  name: string
  level: number
  totalXP: number
  currentStreak: number
  longestStreak: number
  joinedAt: Date
  lastActiveAt: Date
  theme: "light" | "dark"
  stats: {
    challengesCompleted: number
    quizzesCompleted: number
    miniGamesPlayed: number
    badgesEarned: number
  }
}

export interface Quest {
  id: string
  title: string
  description: string
  type: "waste" | "water" | "energy" | "transport" | "biodiversity"
  difficulty: "easy" | "medium" | "hard"
  xpReward: number
  realm: string
  status: "available" | "in-progress" | "completed"
  completedAt?: Date
  createdAt: Date
  isAIGenerated: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: "waste" | "water" | "energy" | "transport" | "biodiversity" | "streak" | "quiz" | "game"
  requirement: {
    type: "quest_count" | "streak_days" | "quiz_score" | "game_score" | "xp_total"
    value: number
    category?: string
  }
  xpReward: number
  unlocked: boolean
  unlockedAt?: Date
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: "waste" | "water" | "energy" | "transport" | "biodiversity"
  difficulty: "easy" | "medium" | "hard"
}

export interface QuizSession {
  id: string
  questions: QuizQuestion[]
  answers: number[]
  score: number
  xpEarned: number
  completedAt: Date
}

export interface MiniGameScore {
  id: string
  gameId: string
  gameName: string
  score: number
  xpEarned: number
  playedAt: Date
}

export interface GameState {
  player: PlayerProfile
  quests: Quest[]
  achievements: Achievement[]
  quizSessions: QuizSession[]
  miniGameScores: MiniGameScore[]
  lastUpdated: Date
}
