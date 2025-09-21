export interface UserPreferences {
  interests: ("waste" | "water" | "energy" | "transport" | "biodiversity")[]
  experienceLevel: "beginner" | "intermediate" | "advanced"
  primaryGoals: ("reduce_waste" | "save_energy" | "conserve_water" | "sustainable_transport" | "protect_nature")[]
  availableTime: "5-10min" | "10-20min" | "20-30min" | "30min+"
  preferredActivities: ("challenges" | "quizzes" | "games" | "reading")[]
  location?: {
    country: string
    region?: string
    climate?: "tropical" | "temperate" | "arid" | "polar"
  }
  motivations: ("save_money" | "help_planet" | "learn_new_things" | "compete_friends" | "build_habits")[]
}

export interface PersonalGoal {
  id: string
  title: string
  description: string
  category: "waste" | "water" | "energy" | "transport" | "biodiversity"
  targetValue: number
  currentValue: number
  unit: string
  deadline: Date
  isActive: boolean
  createdAt: Date
  completedAt?: Date
}

export interface PlayerProfile {
  id: string
  name: string
  displayName?: string
  avatar?: string
  level: number
  totalXP: number
  currentStreak: number
  longestStreak: number
  joinedAt: Date
  lastActiveAt: Date
  theme: "light" | "dark"
  isOnboardingComplete: boolean
  preferences: UserPreferences
  personalGoals: PersonalGoal[]
  stats: {
    challengesCompleted: number
    quizzesCompleted: number
    miniGamesPlayed: number
    badgesEarned: number
    co2Saved: number // in kg
    moneySaved: number // in local currency
    treesEquivalent: number
  }
  weeklyTarget: {
    challengesPerWeek: number
    currentWeekProgress: number
    weekStartDate: Date
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
