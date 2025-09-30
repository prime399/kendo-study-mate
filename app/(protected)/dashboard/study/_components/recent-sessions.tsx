import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatTimeTimer } from "@/lib/utils"
import { History } from "lucide-react"

export default function RecentSessions({ sessions }: { sessions: any[] }) {
  const formatType = (type?: string) =>
    type
      ? type
          .split(/[-_]/)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ")
      : "Study"
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="mr-2 h-5 w-5" /> Study History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 overflow-y-auto">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <div>
                <p className="font-medium">{formatType(session.type)} Session</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(session.startTime).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {formatTimeTimer(session.duration)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {session.completed ? "Completed" : "Incomplete"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
