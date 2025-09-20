"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { CategoryStats } from "@/lib/analytics"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Target } from "lucide-react"

interface CategoryBreakdownProps {
  data: CategoryStats[]
}

const CATEGORY_COLORS = {
  Waste: "#10b981", // green
  Water: "#3b82f6", // blue
  Energy: "#f59e0b", // yellow
  Transport: "#8b5cf6", // purple
  Biodiversity: "#06b6d4", // cyan
}

const CATEGORY_ICONS = {
  Waste: "♻️",
  Water: "💧",
  Energy: "⚡",
  Transport: "🚲",
  Biodiversity: "🌱",
}

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const totalCompleted = data.reduce((sum, cat) => sum + cat.completed, 0)
  const totalXP = data.reduce((sum, cat) => sum + cat.totalXP, 0)

  const pieData = data.map((cat) => ({
    name: cat.category,
    value: cat.totalXP,
    completed: cat.completed,
    color: CATEGORY_COLORS[cat.category as keyof typeof CATEGORY_COLORS],
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium flex items-center gap-2">
            <span>{CATEGORY_ICONS[data.name as keyof typeof CATEGORY_ICONS]}</span>
            {data.name}
          </p>
          <div className="space-y-1 text-sm">
            <p>XP Earned: {data.value}</p>
            <p>Activities: {data.completed}</p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Category Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pie Chart */}
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={2} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Details */}
        <div className="space-y-4">
          {data
            .sort((a, b) => b.totalXP - a.totalXP)
            .map((category) => {
              const percentage = totalXP > 0 ? (category.totalXP / totalXP) * 100 : 0
              const color = CATEGORY_COLORS[category.category as keyof typeof CATEGORY_COLORS]

              return (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {CATEGORY_ICONS[category.category as keyof typeof CATEGORY_ICONS]}
                      </span>
                      <span className="font-medium">{category.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{category.completed} activities</Badge>
                      <Badge variant="secondary">{category.totalXP} XP</Badge>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" style={{ "--progress-background": color } as any} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(percentage)}% of total XP</span>
                    {category.averageScore !== undefined && <span>Avg Quiz Score: {category.averageScore}%</span>}
                  </div>
                </div>
              )
            })}
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalCompleted}</div>
            <div className="text-sm text-muted-foreground">Total Activities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{totalXP}</div>
            <div className="text-sm text-muted-foreground">Total XP</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
