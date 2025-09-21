import type { PlayerProfile, Quest, Achievement } from "./types"

export function getPersonalizedQuests(player: PlayerProfile, allQuests: Quest[]): Quest[] {
  const { interests, experienceLevel, availableTime, primaryGoals } = player.preferences
  
  // Filter quests based on user interests
  let filteredQuests = allQuests.filter(quest => 
    interests.length === 0 || interests.includes(quest.type)
  )

  // Filter by difficulty based on experience level
  const difficultyMap = {
    beginner: ["easy"],
    intermediate: ["easy", "medium"],
    advanced: ["easy", "medium", "hard"]
  }
  
  filteredQuests = filteredQuests.filter(quest =>
    difficultyMap[experienceLevel].includes(quest.difficulty)
  )

  // Sort by relevance to user goals
  filteredQuests.sort((a, b) => {
    const aRelevance = getQuestRelevanceScore(a, player)
    const bRelevance = getQuestRelevanceScore(b, player)
    return bRelevance - aRelevance
  })

  // Limit based on available time (rough estimate)
  const timeLimit = {
    "5-10min": 2,
    "10-20min": 4,
    "20-30min": 6,
    "30min+": 10
  }

  return filteredQuests.slice(0, timeLimit[availableTime])
}

function getQuestRelevanceScore(quest: Quest, player: PlayerProfile): number {
  let score = 0
  
  // Higher score for user's primary interests
  if (player.preferences.interests.includes(quest.type)) {
    score += 10
  }

  // Score based on primary goals alignment
  const goalTypeMap = {
    reduce_waste: "waste",
    save_energy: "energy", 
    conserve_water: "water",
    sustainable_transport: "transport",
    protect_nature: "biodiversity"
  }

  player.preferences.primaryGoals.forEach(goal => {
    if (goalTypeMap[goal as keyof typeof goalTypeMap] === quest.type) {
      score += 15
    }
  })

  // Bonus for appropriate difficulty
  const difficultyScore = {
    beginner: { easy: 5, medium: 0, hard: -5 },
    intermediate: { easy: 2, medium: 5, hard: 2 },
    advanced: { easy: 0, medium: 3, hard: 5 }
  }
  
  score += difficultyScore[player.preferences.experienceLevel][quest.difficulty]

  return score
}

export function getPersonalizedAchievements(player: PlayerProfile, allAchievements: Achievement[]): Achievement[] {
  // Filter achievements based on user interests and progress
  return allAchievements.filter(achievement => {
    // Show all general achievements
    if (["streak", "quiz", "game"].includes(achievement.category)) {
      return true
    }
    
    // Show category-specific achievements only if user is interested
    return player.preferences.interests.length === 0 || 
           player.preferences.interests.includes(achievement.category as any)
  })
}

export function generatePersonalizedTips(player: PlayerProfile): string[] {
  const tips: string[] = []
  const { interests, primaryGoals, location, motivations } = player.preferences

  // Location-based tips
  if (location?.climate === "tropical") {
    tips.push("💧 In tropical climates, collect rainwater for plants during the wet season")
  } else if (location?.climate === "arid") {
    tips.push("🌵 Use drought-resistant plants to reduce water usage in dry climates")
  } else if (location?.climate === "polar") {
    tips.push("🏠 Proper insulation can reduce heating costs by up to 30% in cold climates")
  }

  // Interest-based tips
  if (interests.includes("energy")) {
    tips.push("💡 LED bulbs use 75% less energy than incandescent bulbs")
  }
  if (interests.includes("water")) {
    tips.push("🚿 A 5-minute shower uses about 25 gallons less water than a bath")
  }
  if (interests.includes("waste")) {
    tips.push("♻️ Composting food scraps can reduce household waste by up to 30%")
  }

  // Motivation-based tips
  if (motivations.includes("save_money")) {
    tips.push("💰 Unplugging electronics when not in use can save $100+ per year")
  }

  return tips.slice(0, 3) // Return top 3 most relevant tips
}

export function calculateImpactMetrics(completedQuests: Quest[], player: PlayerProfile) {
  // Rough calculations for environmental impact
  const co2PerQuest = 2.5 // kg CO2 saved per completed quest (average)
  const moneyPerQuest = 5 // dollars saved per quest (average)
  const treesEquivalent = completedQuests.length * 0.1 // trees planted equivalent

  return {
    co2Saved: completedQuests.length * co2PerQuest,
    moneySaved: completedQuests.length * moneyPerQuest,
    treesEquivalent: Math.round(treesEquivalent * 10) / 10
  }
}

export function getNextRecommendedAction(player: PlayerProfile, availableQuests: Quest[]): string {
  const { preferredActivities, availableTime } = player.preferences
  
  if (availableQuests.length > 0 && preferredActivities.includes("challenges")) {
    return "Complete your next eco-challenge"
  }
  
  if (preferredActivities.includes("quizzes")) {
    return "Take a quick sustainability quiz"
  }
  
  if (preferredActivities.includes("games")) {
    return "Play an eco-friendly mini-game"
  }
  
  return "Explore new environmental activities"
}