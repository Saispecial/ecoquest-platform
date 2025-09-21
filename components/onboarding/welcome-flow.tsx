"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useGameStore } from "@/stores/game-store"
import { Leaf, User, Target, Clock, Heart, MapPin, Sparkles } from "lucide-react"
import type { UserPreferences } from "@/lib/types"

interface OnboardingStep {
    id: string
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
}

const steps: OnboardingStep[] = [
    {
        id: "welcome",
        title: "Welcome to EcoQuest!",
        description: "Let's personalize your environmental journey",
        icon: Sparkles,
    },
    {
        id: "profile",
        title: "Tell us about yourself",
        description: "Help us create your eco-hero identity",
        icon: User,
    },
    {
        id: "interests",
        title: "What interests you most?",
        description: "Choose areas you'd like to focus on",
        icon: Heart,
    },
    {
        id: "goals",
        title: "What are your main goals?",
        description: "Select what motivates you to be more sustainable",
        icon: Target,
    },
    {
        id: "preferences",
        title: "How do you like to learn?",
        description: "Customize your experience",
        icon: Clock,
    },
    {
        id: "location",
        title: "Where are you located?",
        description: "Get region-specific tips and challenges",
        icon: MapPin,
    },
]

export function WelcomeFlow() {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState({
        name: "",
        displayName: "",
        interests: [] as string[],
        experienceLevel: "beginner" as const,
        primaryGoals: [] as string[],
        availableTime: "10-20min" as const,
        preferredActivities: [] as string[],
        location: { country: "", region: "", climate: undefined as any },
        motivations: [] as string[],
    })

    const { updatePlayer } = useGameStore()

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            completeOnboarding()
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const completeOnboarding = () => {
        const preferences: UserPreferences = {
            interests: formData.interests as any[],
            experienceLevel: formData.experienceLevel,
            primaryGoals: formData.primaryGoals as any[],
            availableTime: formData.availableTime,
            preferredActivities: formData.preferredActivities as any[],
            location: formData.location.country ? formData.location : undefined,
            motivations: formData.motivations as any[],
        }

        updatePlayer({
            name: formData.name,
            displayName: formData.displayName || formData.name,
            preferences,
            isOnboardingComplete: true,
        })
    }

    const progress = ((currentStep + 1) / steps.length) * 100
    const currentStepData = steps[currentStep]
    const Icon = currentStepData.icon

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                        <Leaf className="h-8 w-8 text-primary" />
                        <h1 className="text-2xl font-bold">EcoQuest</h1>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <div className="flex items-center justify-center gap-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <div>
                            <h2 className="text-xl font-semibold">{currentStepData.title}</h2>
                            <p className="text-muted-foreground">{currentStepData.description}</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {currentStep === 0 && <WelcomeStep />}
                    {currentStep === 1 && <ProfileStep formData={formData} setFormData={setFormData} />}
                    {currentStep === 2 && <InterestsStep formData={formData} setFormData={setFormData} />}
                    {currentStep === 3 && <GoalsStep formData={formData} setFormData={setFormData} />}
                    {currentStep === 4 && <PreferencesStep formData={formData} setFormData={setFormData} />}
                    {currentStep === 5 && <LocationStep formData={formData} setFormData={setFormData} />}

                    <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                            Back
                        </Button>
                        <Button onClick={handleNext}>
                            {currentStep === steps.length - 1 ? "Start Your Journey!" : "Continue"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function WelcomeStep() {
    return (
        <div className="text-center space-y-6">
            <div className="text-6xl">🌱</div>
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">Ready to make a difference?</h3>
                <p className="text-muted-foreground">
                    EcoQuest transforms environmental learning into an engaging, personalized adventure.
                    Complete challenges, earn rewards, and track your real-world impact!
                </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                    <div className="text-2xl">🎯</div>
                    <p>Personalized Challenges</p>
                </div>
                <div className="space-y-2">
                    <div className="text-2xl">📊</div>
                    <p>Track Your Impact</p>
                </div>
                <div className="space-y-2">
                    <div className="text-2xl">🏆</div>
                    <p>Earn Achievements</p>
                </div>
            </div>
        </div>
    )
}

interface StepProps {
    formData: any
    setFormData: (data: any) => void
}

function ProfileStep({ formData, setFormData }: StepProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">What's your name?</Label>
                <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="displayName">How should we call you? (optional)</Label>
                <Input
                    id="displayName"
                    placeholder="Nickname or preferred name"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                />
            </div>
            <div className="space-y-3">
                <Label>What's your experience with sustainability?</Label>
                <RadioGroup
                    value={formData.experienceLevel}
                    onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="beginner" id="beginner" />
                        <Label htmlFor="beginner">🌱 Beginner - Just getting started</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="intermediate" id="intermediate" />
                        <Label htmlFor="intermediate">🌿 Intermediate - Some experience</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advanced" id="advanced" />
                        <Label htmlFor="advanced">🌳 Advanced - Very knowledgeable</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    )
}

function InterestsStep({ formData, setFormData }: StepProps) {
    const interests = [
        { id: "waste", label: "♻️ Waste Reduction", description: "Minimize, reuse, recycle" },
        { id: "water", label: "💧 Water Conservation", description: "Protect our water resources" },
        { id: "energy", label: "⚡ Energy Efficiency", description: "Reduce energy consumption" },
        { id: "transport", label: "🚲 Sustainable Transport", description: "Eco-friendly mobility" },
        { id: "biodiversity", label: "🦋 Biodiversity", description: "Protect wildlife and nature" },
    ]

    const toggleInterest = (interestId: string) => {
        const newInterests = formData.interests.includes(interestId)
            ? formData.interests.filter((id: string) => id !== interestId)
            : [...formData.interests, interestId]
        setFormData({ ...formData, interests: newInterests })
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select all that interest you (choose at least 2)</p>
            <div className="grid gap-3">
                {interests.map((interest) => (
                    <Card
                        key={interest.id}
                        className={`cursor-pointer transition-all ${formData.interests.includes(interest.id)
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                            }`}
                        onClick={() => toggleInterest(interest.id)}
                    >
                        <CardContent className="p-4 flex items-center gap-3">
                            <Checkbox
                                checked={formData.interests.includes(interest.id)}
                                onChange={() => toggleInterest(interest.id)}
                            />
                            <div>
                                <div className="font-medium">{interest.label}</div>
                                <div className="text-sm text-muted-foreground">{interest.description}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function GoalsStep({ formData, setFormData }: StepProps) {
    const goals = [
        { id: "reduce_waste", label: "🗑️ Reduce Waste", description: "Cut down on trash and packaging" },
        { id: "save_energy", label: "💡 Save Energy", description: "Lower electricity and heating costs" },
        { id: "conserve_water", label: "🚿 Conserve Water", description: "Reduce water usage at home" },
        { id: "sustainable_transport", label: "🚌 Green Transport", description: "Use eco-friendly travel options" },
        { id: "protect_nature", label: "🌲 Protect Nature", description: "Support biodiversity and ecosystems" },
    ]

    const motivations = [
        { id: "save_money", label: "💰 Save Money" },
        { id: "help_planet", label: "🌍 Help the Planet" },
        { id: "learn_new_things", label: "📚 Learn New Things" },
        { id: "compete_friends", label: "🏆 Compete with Friends" },
        { id: "build_habits", label: "⚡ Build Better Habits" },
    ]

    const toggleGoal = (goalId: string) => {
        const newGoals = formData.primaryGoals.includes(goalId)
            ? formData.primaryGoals.filter((id: string) => id !== goalId)
            : [...formData.primaryGoals, goalId]
        setFormData({ ...formData, primaryGoals: newGoals })
    }

    const toggleMotivation = (motivationId: string) => {
        const newMotivations = formData.motivations.includes(motivationId)
            ? formData.motivations.filter((id: string) => id !== motivationId)
            : [...formData.motivations, motivationId]
        setFormData({ ...formData, motivations: newMotivations })
    }

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <h4 className="font-medium">What do you want to achieve?</h4>
                <div className="grid gap-2">
                    {goals.map((goal) => (
                        <Badge
                            key={goal.id}
                            variant={formData.primaryGoals.includes(goal.id) ? "default" : "outline"}
                            className="cursor-pointer justify-start p-3 h-auto"
                            onClick={() => toggleGoal(goal.id)}
                        >
                            <div>
                                <div className="font-medium">{goal.label}</div>
                                <div className="text-xs opacity-80">{goal.description}</div>
                            </div>
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="font-medium">What motivates you?</h4>
                <div className="flex flex-wrap gap-2">
                    {motivations.map((motivation) => (
                        <Badge
                            key={motivation.id}
                            variant={formData.motivations.includes(motivation.id) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleMotivation(motivation.id)}
                        >
                            {motivation.label}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    )
}

function PreferencesStep({ formData, setFormData }: StepProps) {
    const timeOptions = [
        { id: "5-10min", label: "5-10 minutes", description: "Quick daily actions" },
        { id: "10-20min", label: "10-20 minutes", description: "Short focused sessions" },
        { id: "20-30min", label: "20-30 minutes", description: "Moderate engagement" },
        { id: "30min+", label: "30+ minutes", description: "Deep dive sessions" },
    ]

    const activities = [
        { id: "challenges", label: "🎯 Real-world Challenges", description: "Take action in your daily life" },
        { id: "quizzes", label: "🧠 Knowledge Quizzes", description: "Test and expand your knowledge" },
        { id: "games", label: "🎮 Interactive Games", description: "Learn through fun activities" },
        { id: "reading", label: "📖 Educational Content", description: "Read tips and guides" },
    ]

    const toggleActivity = (activityId: string) => {
        const newActivities = formData.preferredActivities.includes(activityId)
            ? formData.preferredActivities.filter((id: string) => id !== activityId)
            : [...formData.preferredActivities, activityId]
        setFormData({ ...formData, preferredActivities: newActivities })
    }

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <h4 className="font-medium">How much time can you dedicate daily?</h4>
                <RadioGroup
                    value={formData.availableTime}
                    onValueChange={(value) => setFormData({ ...formData, availableTime: value })}
                >
                    {timeOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label htmlFor={option.id} className="flex-1">
                                <div className="font-medium">{option.label}</div>
                                <div className="text-sm text-muted-foreground">{option.description}</div>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <div className="space-y-3">
                <h4 className="font-medium">How do you prefer to learn?</h4>
                <div className="grid gap-2">
                    {activities.map((activity) => (
                        <Card
                            key={activity.id}
                            className={`cursor-pointer transition-all ${formData.preferredActivities.includes(activity.id)
                                ? "border-primary bg-primary/5"
                                : "hover:border-primary/50"
                                }`}
                            onClick={() => toggleActivity(activity.id)}
                        >
                            <CardContent className="p-3 flex items-center gap-3">
                                <Checkbox
                                    checked={formData.preferredActivities.includes(activity.id)}
                                    onChange={() => toggleActivity(activity.id)}
                                />
                                <div>
                                    <div className="font-medium text-sm">{activity.label}</div>
                                    <div className="text-xs text-muted-foreground">{activity.description}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

function LocationStep({ formData, setFormData }: StepProps) {
    const countries = [
        "United States", "Canada", "United Kingdom", "Germany", "France", "Australia",
        "Japan", "Brazil", "India", "Other"
    ]

    const climates = [
        { id: "temperate", label: "🌤️ Temperate", description: "Moderate seasons" },
        { id: "tropical", label: "🌴 Tropical", description: "Hot and humid" },
        { id: "arid", label: "🏜️ Arid", description: "Dry and hot" },
        { id: "polar", label: "❄️ Cold", description: "Cold winters" },
    ]

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Help us provide region-specific tips and challenges (optional)
            </p>

            <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <select
                    id="country"
                    className="w-full p-2 border rounded-md"
                    value={formData.location.country}
                    onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, country: e.target.value }
                    })}
                >
                    <option value="">Select your country</option>
                    {countries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="region">State/Region (optional)</Label>
                <Input
                    id="region"
                    placeholder="e.g., California, Ontario, etc."
                    value={formData.location.region}
                    onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, region: e.target.value }
                    })}
                />
            </div>

            <div className="space-y-3">
                <Label>Climate type (helps with seasonal tips)</Label>
                <div className="grid grid-cols-2 gap-2">
                    {climates.map((climate) => (
                        <Card
                            key={climate.id}
                            className={`cursor-pointer transition-all ${formData.location.climate === climate.id
                                ? "border-primary bg-primary/5"
                                : "hover:border-primary/50"
                                }`}
                            onClick={() => setFormData({
                                ...formData,
                                location: { ...formData.location, climate: climate.id }
                            })}
                        >
                            <CardContent className="p-3 text-center">
                                <div className="font-medium text-sm">{climate.label}</div>
                                <div className="text-xs text-muted-foreground">{climate.description}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}