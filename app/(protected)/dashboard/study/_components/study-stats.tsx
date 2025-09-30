import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { formatHours, formatTimeTimer } from "@/lib/utils"
import { ChartBar, Clock, Target, TrendingUp, Timer, Award } from "lucide-react"
import NumberFlow from "@number-flow/react"

export default function StudyStats({
  studyTime,
  progress,
  totalStudyTime,
}: {
  studyTime: number
  progress: number
  totalStudyTime: number
}) {
  const hours = Math.floor(totalStudyTime / 3600)
  const minutes = Math.floor((totalStudyTime % 3600) / 60)
  const currentSessionMinutes = Math.floor(studyTime / 60)
  const currentSessionSeconds = studyTime % 60
  
  const getProgressColor = () => {
    if (progress >= 100) return "bg-emerald-500"
    if (progress >= 75) return "bg-blue-500"
    if (progress >= 50) return "bg-yellow-500"
    return "bg-gray-400"
  }

  const getProgressBadge = () => {
    if (progress >= 100) return { label: "Complete!", color: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800" }
    if (progress >= 75) return { label: "Almost There!", color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800" }
    if (progress >= 50) return { label: "Halfway", color: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800" }
    if (progress >= 25) return { label: "Getting Started", color: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800" }
    return { label: "Just Started", color: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800" }
  }

  const progressBadge = getProgressBadge()

  return (
    <div className="space-y-6">
      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Current Session */}
        <Card className="relative overflow-hidden bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Current Session
                </p>
                <div className="text-2xl font-bold tracking-tight">
                  <NumberFlow 
                    value={currentSessionMinutes}
                    format={{ minimumIntegerDigits: 2 }}
                  />
                  :
                  <NumberFlow 
                    value={currentSessionSeconds}
                    format={{ minimumIntegerDigits: 2 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {studyTime > 0 ? formatTimeTimer(studyTime) : "Not started"}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Study Time */}
        <Card className="relative overflow-hidden bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Total Study Time
                </p>
                <div className="text-2xl font-bold tracking-tight">
                  <NumberFlow
                    value={hours}
                    format={{ minimumIntegerDigits: 1 }}
                  />
                  h {minutes}m
                </div>
                <p className="text-xs text-muted-foreground">
                  Lifetime achievement
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                <ChartBar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
