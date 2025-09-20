export interface MiniGame {
  id: string
  title: string
  description: string
  category: "waste" | "water" | "energy" | "transport" | "biodiversity"
  difficulty: "easy" | "medium" | "hard"
  estimatedTime: number // in minutes
  maxScore: number
  xpReward: number
  instructions: string[]
  icon: string
}

export const MINI_GAMES: MiniGame[] = [
  {
    id: "waste-sorting",
    title: "Waste Sorting Challenge",
    description: "Sort different items into the correct recycling bins as quickly as possible!",
    category: "waste",
    difficulty: "easy",
    estimatedTime: 3,
    maxScore: 1000,
    xpReward: 50,
    instructions: [
      "Items will appear on the screen",
      "Drag each item to the correct bin",
      "Green bin: Compostable items",
      "Blue bin: Recyclable items",
      "Gray bin: General waste",
      "Speed and accuracy both matter!",
    ],
    icon: "♻️",
  },
  {
    id: "water-drops",
    title: "Save the Water Drops",
    description: "Catch falling water drops to prevent waste and learn about conservation!",
    category: "water",
    difficulty: "medium",
    estimatedTime: 4,
    maxScore: 1500,
    xpReward: 75,
    instructions: [
      "Water drops are falling from leaky faucets",
      "Move your bucket to catch them",
      "Each drop saved earns points",
      "Avoid catching polluted drops (dark colored)",
      "Bonus points for catching multiple drops in a row",
    ],
    icon: "💧",
  },
  {
    id: "energy-saver",
    title: "Energy Saver House",
    description: "Turn off lights and appliances to save energy in this virtual house!",
    category: "energy",
    difficulty: "easy",
    estimatedTime: 3,
    maxScore: 800,
    xpReward: 60,
    instructions: [
      "Click on lights and appliances to turn them off",
      "Each item turned off saves energy points",
      "Some items use more energy than others",
      "Complete all rooms to finish the game",
      "Faster completion = bonus points",
    ],
    icon: "⚡",
  },
  {
    id: "carbon-footprint",
    title: "Carbon Footprint Race",
    description: "Choose the most eco-friendly transportation options to reduce your carbon footprint!",
    category: "transport",
    difficulty: "medium",
    estimatedTime: 5,
    maxScore: 1200,
    xpReward: 80,
    instructions: [
      "You need to travel to different destinations",
      "Choose from various transport options",
      "Each choice affects your carbon footprint",
      "Lower emissions = higher score",
      "Balance speed, cost, and environmental impact",
    ],
    icon: "🚲",
  },
  {
    id: "pollinator-garden",
    title: "Build a Pollinator Garden",
    description: "Plant the right flowers to attract bees, butterflies, and other pollinators!",
    category: "biodiversity",
    difficulty: "hard",
    estimatedTime: 6,
    maxScore: 2000,
    xpReward: 100,
    instructions: [
      "Different pollinators prefer different flowers",
      "Plant flowers that bloom in different seasons",
      "Consider flower colors and shapes",
      "Create a balanced ecosystem",
      "Watch your garden come to life!",
    ],
    icon: "🌸",
  },
]

export function getMiniGameById(id: string): MiniGame | undefined {
  return MINI_GAMES.find((game) => game.id === id)
}

export function getMiniGamesByCategory(category: MiniGame["category"]): MiniGame[] {
  return MINI_GAMES.filter((game) => game.category === category)
}

export function getMiniGamesByDifficulty(difficulty: MiniGame["difficulty"]): MiniGame[] {
  return MINI_GAMES.filter((game) => game.difficulty === difficulty)
}
