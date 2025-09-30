import NumberFlow from "@number-flow/react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DropdownList } from "@/components/ui/dropdown-list"
import { formatTimeTimer } from "@/lib/utils"
import { Clock, Pause, Play, RotateCcw } from "lucide-react"
import { useTopsStore } from "@/store/use-tops-store"
import { useEffect, useMemo } from "react"

export default function StudyTimer({
  studyTime,
  studyDuration,
  studyType,
  studyTypeOptions,
  isStudying,
  onStudyTypeChange,
  onStartStop,
  onReset,
}: {
  studyTime: number
  studyDuration: number
  studyType: string
  studyTypeOptions: { value: string; label: string }[]
  isStudying: boolean
  onStudyTypeChange: (value: string) => void
  onStartStop: () => void
  onReset: () => void
}) {
  const { incrementTops, resetSessionTops } = useTopsStore()
  const progress = (studyTime / studyDuration) * 100
  const hours = Math.floor(studyTime / 3600)
  const minutes = Math.floor((studyTime % 3600) / 60)
  const seconds = studyTime % 60

  const dropdownOptions = useMemo(
    () =>
      studyTypeOptions.map((option) => ({
        label: option.label,
        value: option.value,
      })),
    [studyTypeOptions],
  )

  useEffect(() => {
    if (!isStudying) return

    const interval = setInterval(() => {
      incrementTops(1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isStudying, incrementTops])

  const handleReset = () => {
    resetSessionTops()
    onReset()
  }
  return (
    <Card className="border-2 border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-center text-2xl text-card-foreground">
          <Clock className="mr-3 h-8 w-8" />
          Study Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center text-7xl font-bold tracking-tighter text-card-foreground">
          <div className="flex items-center justify-center">
            {hours > 0 && (
              <>
                <NumberFlow value={hours} />
                <span>:</span>
              </>
            )}
            <NumberFlow value={minutes} format={{ minimumIntegerDigits: 2 }} />
            <span>:</span>
            <NumberFlow value={seconds} format={{ minimumIntegerDigits: 2 }} />
          </div>
        </div>
        <Progress 
          value={Math.min(progress, 100)} 
          className="h-3 bg-muted/30 [&_.k-progressbar-value]:bg-primary [&_.k-progressbar-value]:rounded-full" 
        />
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium text-muted-foreground">Study type</p>
          <div className="flex justify-center">
            <DropdownList
              className="w-56 capitalize"
              options={dropdownOptions}
              value={studyType}
              onValueChange={(next) => {
                if (typeof next === "string") {
                  onStudyTypeChange(next)
                }
              }}
              placeholder="Select type"
            />
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Button 
            size="lg" 
            onClick={onStartStop} 
            className="w-32 bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black dark:hover:bg-white/90 border-0 !border-none shadow-none"
          >
            {isStudying ? (
              <>
                <Pause className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>Start</span>
              </>
            )}
          </Button>
          <Button
            size="lg"
            onClick={handleReset}
            className="w-32 bg-black text-white hover:bg-black/90 dark:bg-black dark:text-white dark:hover:bg-black/90 border-0 !border-none shadow-none"
          >
            <RotateCcw className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>Reset</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

