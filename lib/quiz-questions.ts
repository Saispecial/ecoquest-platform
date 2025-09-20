import type { QuizQuestion } from "./types"

export const QUIZ_QUESTION_BANK: QuizQuestion[] = [
  // Waste Management Questions
  {
    id: "waste-001",
    question: "How long does it take for a plastic bottle to decompose in a landfill?",
    options: ["50 years", "100 years", "450 years", "1000 years"],
    correctAnswer: 2,
    explanation:
      "Plastic bottles can take up to 450 years to decompose in landfills, which is why recycling and reducing plastic use is so important.",
    category: "waste",
    difficulty: "easy",
  },
  {
    id: "waste-002",
    question: "What percentage of plastic waste is actually recycled globally?",
    options: ["Less than 10%", "About 25%", "Around 50%", "Over 75%"],
    correctAnswer: 0,
    explanation:
      "Less than 10% of plastic waste is actually recycled globally. Most plastic ends up in landfills, oceans, or is incinerated.",
    category: "waste",
    difficulty: "medium",
  },
  {
    id: "waste-003",
    question: "Which of these materials can be composted?",
    options: ["Banana peels", "Plastic bags", "Glass bottles", "Aluminum cans"],
    correctAnswer: 0,
    explanation:
      "Banana peels are organic matter that can be composted. Plastic, glass, and aluminum should be recycled through different processes.",
    category: "waste",
    difficulty: "easy",
  },
  {
    id: "waste-004",
    question: "What is the concept of 'circular economy' in waste management?",
    options: [
      "Throwing waste in circular bins",
      "Reusing and recycling materials to minimize waste",
      "Burning waste in circular furnaces",
      "Burying waste in circular patterns",
    ],
    correctAnswer: 1,
    explanation:
      "A circular economy focuses on reusing, recycling, and regenerating materials to keep them in use for as long as possible, minimizing waste.",
    category: "waste",
    difficulty: "hard",
  },

  // Water Conservation Questions
  {
    id: "water-001",
    question: "What percentage of Earth's water is fresh water available for human use?",
    options: ["30%", "10%", "3%", "Less than 1%"],
    correctAnswer: 3,
    explanation:
      "Less than 1% of Earth's water is fresh water available for human use. Most water is saltwater in oceans or frozen in ice caps.",
    category: "water",
    difficulty: "medium",
  },
  {
    id: "water-002",
    question: "How much water does a typical 5-minute shower use?",
    options: ["10 gallons", "25 gallons", "50 gallons", "100 gallons"],
    correctAnswer: 1,
    explanation:
      "A typical 5-minute shower uses about 25 gallons of water. Reducing shower time is an easy way to conserve water.",
    category: "water",
    difficulty: "easy",
  },
  {
    id: "water-003",
    question: "Which activity uses the most water in an average household?",
    options: ["Showering", "Toilet flushing", "Washing clothes", "Washing dishes"],
    correctAnswer: 1,
    explanation:
      "Toilet flushing typically uses the most water in an average household, accounting for about 30% of indoor water use.",
    category: "water",
    difficulty: "medium",
  },
  {
    id: "water-004",
    question: "What is greywater?",
    options: [
      "Dirty rainwater",
      "Water from sinks, showers, and washing machines",
      "Water mixed with concrete",
      "Polluted groundwater",
    ],
    correctAnswer: 1,
    explanation:
      "Greywater is wastewater from sinks, showers, and washing machines that can be reused for irrigation and other non-potable uses.",
    category: "water",
    difficulty: "hard",
  },

  // Energy Conservation Questions
  {
    id: "energy-001",
    question: "Which type of light bulb is most energy-efficient?",
    options: ["Incandescent", "Halogen", "CFL (Compact Fluorescent)", "LED"],
    correctAnswer: 3,
    explanation:
      "LED bulbs are the most energy-efficient, using up to 80% less energy than incandescent bulbs and lasting much longer.",
    category: "energy",
    difficulty: "easy",
  },
  {
    id: "energy-002",
    question: "What are 'phantom loads' or 'vampire power'?",
    options: [
      "Solar power at night",
      "Energy used by devices when turned off but plugged in",
      "Power from wind turbines",
      "Energy stored in batteries",
    ],
    correctAnswer: 1,
    explanation:
      "Phantom loads refer to energy consumed by electronic devices when they're turned off but still plugged in, which can account for 5-10% of home energy use.",
    category: "energy",
    difficulty: "medium",
  },
  {
    id: "energy-003",
    question: "Which renewable energy source is most widely used globally?",
    options: ["Solar", "Wind", "Hydroelectric", "Geothermal"],
    correctAnswer: 2,
    explanation:
      "Hydroelectric power is the most widely used renewable energy source globally, providing about 16% of the world's electricity.",
    category: "energy",
    difficulty: "medium",
  },
  {
    id: "energy-004",
    question: "What is the most effective way to reduce home energy consumption?",
    options: [
      "Using energy-efficient appliances",
      "Improving insulation",
      "Using renewable energy",
      "All of the above",
    ],
    correctAnswer: 3,
    explanation:
      "The most effective approach combines energy-efficient appliances, proper insulation, and renewable energy sources to minimize overall consumption.",
    category: "energy",
    difficulty: "hard",
  },

  // Sustainable Transport Questions
  {
    id: "transport-001",
    question: "Which mode of transport produces the least CO2 emissions per passenger?",
    options: ["Car", "Bus", "Train", "Bicycle"],
    correctAnswer: 3,
    explanation:
      "Bicycles produce zero direct emissions and are the most environmentally friendly mode of transport for short to medium distances.",
    category: "transport",
    difficulty: "easy",
  },
  {
    id: "transport-002",
    question: "How much can carpooling reduce individual carbon emissions from commuting?",
    options: ["10-20%", "25-35%", "45-55%", "65-75%"],
    correctAnswer: 2,
    explanation:
      "Carpooling can reduce individual carbon emissions by 45-55% by sharing the environmental cost among multiple passengers.",
    category: "transport",
    difficulty: "medium",
  },
  {
    id: "transport-003",
    question: "What is the main environmental benefit of electric vehicles?",
    options: [
      "They're completely emission-free",
      "They reduce local air pollution",
      "They're always powered by renewable energy",
      "They never need maintenance",
    ],
    correctAnswer: 1,
    explanation:
      "Electric vehicles reduce local air pollution and can have lower overall emissions, especially when powered by clean electricity sources.",
    category: "transport",
    difficulty: "medium",
  },
  {
    id: "transport-004",
    question: "What does 'active transportation' refer to?",
    options: ["Electric vehicles", "Public transportation", "Walking and cycling", "Ride-sharing services"],
    correctAnswer: 2,
    explanation:
      "Active transportation refers to human-powered transport like walking and cycling, which provides health benefits while producing zero emissions.",
    category: "transport",
    difficulty: "easy",
  },

  // Biodiversity Questions
  {
    id: "biodiversity-001",
    question: "What percentage of known species are currently threatened with extinction?",
    options: ["5%", "15%", "25%", "40%"],
    correctAnswer: 2,
    explanation:
      "Approximately 25% of known plant and animal species are currently threatened with extinction due to human activities and climate change.",
    category: "biodiversity",
    difficulty: "medium",
  },
  {
    id: "biodiversity-002",
    question: "Which of these is most important for supporting local biodiversity?",
    options: ["Planting exotic species", "Using pesticides", "Creating native plant gardens", "Building more roads"],
    correctAnswer: 2,
    explanation:
      "Native plant gardens provide food and habitat for local wildlife and are adapted to local climate conditions, supporting biodiversity.",
    category: "biodiversity",
    difficulty: "easy",
  },
  {
    id: "biodiversity-003",
    question: "What are pollinators essential for?",
    options: ["Cleaning the air", "Food production", "Water purification", "Soil formation"],
    correctAnswer: 1,
    explanation:
      "Pollinators like bees, butterflies, and birds are essential for food production, as they help plants reproduce by transferring pollen.",
    category: "biodiversity",
    difficulty: "easy",
  },
  {
    id: "biodiversity-004",
    question: "What is habitat fragmentation?",
    options: [
      "Animals moving to new areas",
      "Breaking up large habitats into smaller, isolated pieces",
      "Creating new habitats for wildlife",
      "Protecting endangered species",
    ],
    correctAnswer: 1,
    explanation:
      "Habitat fragmentation occurs when large, continuous habitats are broken into smaller, isolated pieces, making it difficult for wildlife to survive and reproduce.",
    category: "biodiversity",
    difficulty: "hard",
  },
]

export function getRandomQuestions(count = 5, category?: QuizQuestion["category"]): QuizQuestion[] {
  let availableQuestions = [...QUIZ_QUESTION_BANK]

  if (category) {
    availableQuestions = availableQuestions.filter((q) => q.category === category)
  }

  // Shuffle array and take first 'count' questions
  const shuffled = availableQuestions.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function getQuestionsByDifficulty(difficulty: QuizQuestion["difficulty"]): QuizQuestion[] {
  return QUIZ_QUESTION_BANK.filter((q) => q.difficulty === difficulty)
}

export function getQuestionsByCategory(category: QuizQuestion["category"]): QuizQuestion[] {
  return QUIZ_QUESTION_BANK.filter((q) => q.category === category)
}

// AI Quiz Generation (fallback to question bank)
export async function generateAIQuiz(
  count = 5,
  category?: QuizQuestion["category"],
  difficulty?: QuizQuestion["difficulty"],
): Promise<QuizQuestion[]> {
  try {
    // This would integrate with Gemini API in a real implementation
    // For now, we'll use the question bank as fallback
    let availableQuestions = [...QUIZ_QUESTION_BANK]

    if (category) {
      availableQuestions = availableQuestions.filter((q) => q.category === category)
    }

    if (difficulty) {
      availableQuestions = availableQuestions.filter((q) => q.difficulty === difficulty)
    }

    // Shuffle and return requested count
    const shuffled = availableQuestions.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, shuffled.length))
  } catch (error) {
    console.error("Failed to generate AI quiz, using fallback:", error)
    return getRandomQuestions(count, category)
  }
}
