"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ActivityData } from "@/lib/analytics"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Calendar } from "lucide-react"

interface ActivityChartProps {
  data: ActivityData[]
  title: string
  type?: "bar" | "line"
}

export function ActivityChart({ data, title, type = "bar" }: ActivityChartProps) {
  const totalXP = data.reduce((sum, d) => sum + d.xpEarned, 0)
  const totalActivities = data.reduce((sum, d) => sum + d.challenges + d.quizzes + d.games, 0)
  const activeDays = data.filter((d) => d.xpEarned > 0).length

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{formatDate(label)}</p>
          <div className="space-y-1 text-sm">
            <p className="text-primary">XP Earned: {data.xpEarned}</p>
            <p className="text-green-600">Challenges: {data.challenges}</p>
            <p className="text-blue-600">Quizzes: {data.quizzes}</p>
            <p className="text-purple-600">Games: {data.games}</p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {title}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">{totalXP} XP</Badge>
            <Badge variant="outline">{activeDays} Active Days</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === "line" ? (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="xpEarned"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="xpEarned" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 text-center text-sm">
          <div>
            <div className="font-semibold text-primary">{totalXP}</div>
            <div className="text-muted-foreground">Total XP</div>
          </div>
          <div>
            <div className="font-semibold text-secondary">{totalActivities}</div>
            <div className="text-muted-foreground">Activities</div>
          </div>
          <div>
            <div className="font-semibold text-accent">{activeDays}</div>
            <div className="text-muted-foreground">Active Days</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
