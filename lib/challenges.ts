import type { Quest } from "./types"

export const CHALLENGE_LIBRARY: Omit<Quest, "id" | "status" | "createdAt" | "completedAt">[] = [
  // Waste Management Challenges
  {
    title: "Plastic-Free Day Challenge",
    description:
      "Go an entire day without using any single-use plastic items. Document alternatives you used and share your experience.",
    type: "waste",
    difficulty: "medium",
    xpReward: 150,
    realm: "Waste Warrior Realm",
    isAIGenerated: false,
  },
  {
    title: "Waste Audit Adventure",
    description:
      "Conduct a waste audit of your household for one week. Categorize and weigh different types of waste, then create an action plan to reduce it.",
    type: "waste",
    difficulty: "hard",
    xpReward: 200,
    realm: "Waste Warrior Realm",
    isAIGenerated: false,
  },
  {
    title: "Upcycling Creation",
    description:
      "Transform at least 3 items that would normally be thrown away into something useful or decorative. Share photos of your creations.",
    type: "waste",
    difficulty: "medium",
    xpReward: 175,
    realm: "Waste Warrior Realm",
    isAIGenerated: false,
  },
  {
    title: "Zero Waste Lunch Week",
    description:
      "Pack waste-free lunches for an entire school/work week using reusable containers, utensils, and napkins.",
    type: "waste",
    difficulty: "easy",
    xpReward: 100,
    realm: "Waste Warrior Realm",
    isAIGenerated: false,
  },

  // Water Conservation Challenges
  {
    title: "Water Usage Tracker",
    description:
      "Track your daily water usage for a week and implement 3 water-saving techniques. Calculate how much water you saved.",
    type: "water",
    difficulty: "medium",
    xpReward: 150,
    realm: "Aqua Guardian Realm",
    isAIGenerated: false,
  },
  {
    title: "Rainwater Harvesting Setup",
    description:
      "Set up a simple rainwater collection system at home or school. Use the collected water for plants or cleaning.",
    type: "water",
    difficulty: "hard",
    xpReward: 200,
    realm: "Aqua Guardian Realm",
    isAIGenerated: false,
  },
  {
    title: "Shower Timer Challenge",
    description:
      "Reduce your shower time to 5 minutes or less for two weeks. Track your water savings and share tips with others.",
    type: "water",
    difficulty: "easy",
    xpReward: 100,
    realm: "Aqua Guardian Realm",
    isAIGenerated: false,
  },
  {
    title: "Greywater Garden Project",
    description: "Create a simple greywater system to reuse water from sinks or washing machines for watering plants.",
    type: "water",
    difficulty: "hard",
    xpReward: 225,
    realm: "Aqua Guardian Realm",
    isAIGenerated: false,
  },

  // Energy Conservation Challenges
  {
    title: "Energy Detective Mission",
    description: "Identify and eliminate 5 energy vampires in your home (devices that consume power when not in use).",
    type: "energy",
    difficulty: "easy",
    xpReward: 100,
    realm: "Power Saver Realm",
    isAIGenerated: false,
  },
  {
    title: "Solar Cooking Experiment",
    description: "Build a simple solar cooker and use it to prepare a meal. Document the process and cooking time.",
    type: "energy",
    difficulty: "hard",
    xpReward: 200,
    realm: "Power Saver Realm",
    isAIGenerated: false,
  },
  {
    title: "LED Light Conversion",
    description:
      "Replace all incandescent bulbs in one room with LED bulbs. Calculate the energy and cost savings over a year.",
    type: "energy",
    difficulty: "medium",
    xpReward: 150,
    realm: "Power Saver Realm",
    isAIGenerated: false,
  },
  {
    title: "Unplugged Day Challenge",
    description:
      "Spend an entire day using minimal electricity - no TV, computer, or unnecessary lights. Find alternative activities.",
    type: "energy",
    difficulty: "medium",
    xpReward: 175,
    realm: "Power Saver Realm",
    isAIGenerated: false,
  },

  // Sustainable Transport Challenges
  {
    title: "Car-Free Week",
    description:
      "Use only sustainable transportation (walking, cycling, public transport) for one week. Track your carbon footprint reduction.",
    type: "transport",
    difficulty: "medium",
    xpReward: 150,
    realm: "Green Mobility Realm",
    isAIGenerated: false,
  },
  {
    title: "Bike Commute Challenge",
    description: "Cycle to school or work for 10 days. Calculate the distance covered and emissions avoided.",
    type: "transport",
    difficulty: "easy",
    xpReward: 125,
    realm: "Green Mobility Realm",
    isAIGenerated: false,
  },
  {
    title: "Public Transport Explorer",
    description:
      "Use only public transportation for two weeks. Create a guide of the most efficient routes in your area.",
    type: "transport",
    difficulty: "easy",
    xpReward: 100,
    realm: "Green Mobility Realm",
    isAIGenerated: false,
  },
  {
    title: "Carpooling Coordinator",
    description:
      "Organize a carpooling system for your school or workplace. Get at least 5 people to participate for one month.",
    type: "transport",
    difficulty: "hard",
    xpReward: 200,
    realm: "Green Mobility Realm",
    isAIGenerated: false,
  },

  // Biodiversity Challenges
  {
    title: "Native Plant Garden",
    description:
      "Create a small garden with at least 5 native plant species. Research their benefits to local wildlife.",
    type: "biodiversity",
    difficulty: "medium",
    xpReward: 175,
    realm: "Nature Guardian Realm",
    isAIGenerated: false,
  },
  {
    title: "Wildlife Habitat Builder",
    description:
      "Build and install 3 different wildlife habitats (bird house, bee hotel, butterfly garden) in your area.",
    type: "biodiversity",
    difficulty: "hard",
    xpReward: 225,
    realm: "Nature Guardian Realm",
    isAIGenerated: false,
  },
  {
    title: "Species Documentation Project",
    description:
      "Document 20 different species (plants, birds, insects) in your local area with photos and descriptions.",
    type: "biodiversity",
    difficulty: "medium",
    xpReward: 150,
    realm: "Nature Guardian Realm",
    isAIGenerated: false,
  },
  {
    title: "Pollinator Garden Challenge",
    description:
      "Plant a pollinator-friendly garden with at least 8 different flowering plants that bloom throughout the season.",
    type: "biodiversity",
    difficulty: "easy",
    xpReward: 125,
    realm: "Nature Guardian Realm",
    isAIGenerated: false,
  },
]

export function getRandomChallenge(): Omit<Quest, "id" | "status" | "createdAt" | "completedAt"> {
  const randomIndex = Math.floor(Math.random() * CHALLENGE_LIBRARY.length)
  return CHALLENGE_LIBRARY[randomIndex]
}

export function getChallengesByType(type: Quest["type"]): Omit<Quest, "id" | "status" | "createdAt" | "completedAt">[] {
  return CHALLENGE_LIBRARY.filter((challenge) => challenge.type === type)
}

export function getChallengesByDifficulty(
  difficulty: Quest["difficulty"],
): Omit<Quest, "id" | "status" | "createdAt" | "completedAt">[] {
  return CHALLENGE_LIBRARY.filter((challenge) => challenge.difficulty === difficulty)
}

// AI Challenge Generation (fallback to library if API fails)
export async function generateAIChallenge(
  type?: Quest["type"],
  difficulty?: Quest["difficulty"],
): Promise<Omit<Quest, "id" | "status" | "createdAt" | "completedAt">> {
  try {
    // This would integrate with Gemini API in a real implementation
    // For now, we'll use the library as fallback
    const availableChallenges = CHALLENGE_LIBRARY.filter((challenge) => {
      return (!type || challenge.type === type) && (!difficulty || challenge.difficulty === difficulty)
    })

    if (availableChallenges.length === 0) {
      return getRandomChallenge()
    }

    const randomIndex = Math.floor(Math.random() * availableChallenges.length)
    return {
      ...availableChallenges[randomIndex],
      isAIGenerated: true, // Mark as AI generated even though it's from library for demo
    }
  } catch (error) {
    console.error("Failed to generate AI challenge, using fallback:", error)
    return getRandomChallenge()
  }
}
