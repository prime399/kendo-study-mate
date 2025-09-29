"use client"
import PageTitle from "@/components/page-title"
import { Card, CardContent } from "@/components/ui/card"
import { TabStrip } from "@/components/ui/tabstrip"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import { useQueryState } from "nuqs"
import { useCallback, useEffect, useMemo } from "react"
import { toast } from "sonner"
import confetti from "canvas-confetti"
import RecentSessions from "./_components/recent-sessions"
import StudySettings from "./_components/study-settings"
import StudyStats from "./_components/study-stats"
import StudyTimer from "./_components/study-timer"
import NotificationPermission from "./_components/notification-permission"
import { formatTimeTimer } from "@/lib/utils"

const STUDY_TYPE_OPTIONS = [
  { value: "study", label: "Study" },
  { value: "review", label: "Review" },
  { value: "practice", label: "Practice" },
  { value: "reading", label: "Reading" },
]

const triggerNotification = (title: string, body: string) => {
  if (
    typeof window !== "undefined" &&
    "Notification" in window &&
    Notification.permission === "granted"
  ) {
    new Notification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "study-notification",
    })
  }
}

const triggerConfettiSideCannons = () => {
  const end = Date.now() + 3 * 1000
  const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"]

  const frame = () => {
    if (Date.now() > end) return

    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      startVelocity: 60,
      origin: { x: 0, y: 0.5 },
      colors,
    })
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      startVelocity: 60,
      origin: { x: 1, y: 0.5 },
      colors,
    })

    requestAnimationFrame(frame)
  }

  frame()
}

export default function StudyPage() {
  const [studyTime, setStudyTime] = useQueryState("studyTime", {
    defaultValue: 0,
    parse: (value) => Number(value),
  })
  const [isStudying, setIsStudying] = useQueryState("isStudying", {
    defaultValue: false,
    parse: (value) => value === "true",
  })
  const [studyDuration, setStudyDuration] = useQueryState("studyDuration", {
    defaultValue: 25 * 60,
    parse: (value) => Number(value),
  })
  const [dailyGoal, setDailyGoal] = useQueryState("dailyGoal", {
    defaultValue: 120 * 60,
    parse: (value) => Number(value),
  })
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "stats",
    parse: (value) => value as "stats" | "settings" | "history",
  })
  const [studyType, setStudyType] = useQueryState("studyType", {
    defaultValue: "study",
  })

  const updateSettings = useMutation(api.study.updateSettings)
  const completeSession = useMutation(api.study.completeSession)
  const stats = useQuery(api.study.getStats)
  const userSettings = useQuery(api.study.getSettings)

  const selectedStudyType =
    STUDY_TYPE_OPTIONS.find((option) => option.value === studyType) ?? STUDY_TYPE_OPTIONS[0]
  const studyTypeLabel = selectedStudyType.label

  const handleStudyTypeChange = useCallback(
    (value: string) => {
      setStudyType(value)
    },
    [setStudyType],
  )

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    if (userSettings && userSettings.studyDuration && userSettings.dailyGoal) {
      setStudyDuration(userSettings.studyDuration)
      setDailyGoal(userSettings.dailyGoal)
    }
  }, [userSettings, setStudyDuration, setDailyGoal])

  const handleSessionComplete = useCallback(
    (time: number) => {
      completeSession({
        duration: time,
        type: studyType,
        completed: true,
      })
      setStudyTime(0)
      setIsStudying(false)
      triggerNotification("Session complete!", `Nice work finishing ${studyTypeLabel.toLowerCase()} time.`)
      triggerConfettiSideCannons()
    },
    [completeSession, setIsStudying, setStudyTime, studyType, studyTypeLabel],
  )

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined

    if (isStudying) {
      interval = setInterval(() => {
        setStudyTime((prevTime) => {
          const nextTime = prevTime + 1
          if (nextTime >= studyDuration) {
            handleSessionComplete(nextTime)
            return 0
          }
          return nextTime
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [handleSessionComplete, isStudying, setStudyTime, studyDuration])

  const handleDailyGoalChange = useCallback(
    (minutes: number) => {
      const sanitized = Math.max(1, minutes)
      setDailyGoal(sanitized * 60)
      toast.success(`Daily goal set to ${sanitized} minutes.`)
    },
    [setDailyGoal],
  )

  const handleDurationChange = useCallback(
    (minutes: number) => {
      const sanitized = Math.max(1, minutes)
      setStudyDuration(sanitized * 60)
      toast.success(`Study duration set to ${sanitized} minutes.`)
    },
    [setStudyDuration],
  )

  const handleStartStop = () => {
    if (isStudying) {
      completeSession({
        duration: studyTime,
        type: studyType,
        completed: false,
      })
      toast.success(`${studyTypeLabel} session paused at ${formatTimeTimer(studyTime)}.`)
    } else {
      toast.success(`${studyTypeLabel} session started.`)
    }
    setIsStudying(!isStudying)
  }

  const handleReset = () => {
    if (isStudying) {
      completeSession({
        duration: studyTime,
        type: studyType,
        completed: false,
      })
    }
    setStudyTime(0)
    setIsStudying(false)
    toast.success(`${studyTypeLabel} timer has been reset to 0.`)
  }

  const handleSaveSettings = useCallback(async () => {
    try {
      await updateSettings({
        studyDuration,
        dailyGoal,
      })
      toast.success("Your study settings have been saved to your account.")
    } catch (error) {
      toast.error("Failed to save settings.")
    }
  }, [updateSettings, studyDuration, dailyGoal])

  const progress = (studyTime / studyDuration) * 100

  const tabItems = useMemo(
    () => [
      {
        key: "stats",
        title: "Statistics",
        content: (
          <StudyStats
            studyTime={studyTime}
            progress={progress}
            totalStudyTime={stats?.totalStudyTime ?? 0}
          />
        ),
      },
      {
        key: "settings",
        title: "Settings",
        content: (
          <StudySettings
            studyDuration={studyDuration}
            dailyGoal={dailyGoal}
            onDurationChange={handleDurationChange}
            onDailyGoalChange={handleDailyGoalChange}
            onSave={handleSaveSettings}
          />
        ),
      },
      {
        key: "history",
        title: "History",
        content: stats?.recentSessions && stats.recentSessions.length > 0 ? (
          <RecentSessions sessions={stats.recentSessions} />
        ) : (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No study sessions recorded yet.
            </CardContent>
          </Card>
        ),
      },
    ],
    [
      stats?.recentSessions,
      stats?.totalStudyTime,
      studyTime,
      progress,
      studyDuration,
      dailyGoal,
      handleDurationChange,
      handleDailyGoalChange,
      handleSaveSettings,
    ],
  )

  return (
    <div>
      <PageTitle title="Study Dashboard" />
      <NotificationPermission />
      <div className="grid gap-6">
        <StudyTimer
          studyTime={studyTime}
          studyDuration={studyDuration}
          studyType={studyType}
          studyTypeOptions={STUDY_TYPE_OPTIONS}
          onStudyTypeChange={handleStudyTypeChange}
          isStudying={isStudying}
          onStartStop={handleStartStop}
          onReset={handleReset}
        />

        <TabStrip
          className="w-full"
          items={tabItems}
          value={activeTab}
          onValueChange={setActiveTab}
          keepMount
        />
      </div>
    </div>
  )
}

