"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { Kanban, KanbanBoard, KanbanColumn, KanbanColumnContent, KanbanItem, KanbanItemHandle, KanbanOverlay, type KanbanMoveEvent } from "@/components/ui/kanban"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { format } from "date-fns"
import {
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  ClipboardList,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const STATUS_CONFIG = [
  {
    id: "backlog",
    label: "Backlog",
    hint: "Ideas and tasks waiting for prioritisation",
    accent:
      "border-blue-300 bg-blue-100 text-blue-800 shadow-sm dark:border-blue-600 dark:bg-blue-900/40 dark:text-blue-200",
    headerClass:
      "from-blue-50 via-blue-100/50 to-blue-50/30 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-blue-900/10",
  },
  {
    id: "in_progress",
    label: "In Progress",
    hint: "Currently being worked on",
    accent:
      "border-indigo-300 bg-indigo-100 text-indigo-800 shadow-sm dark:border-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200",
    headerClass:
      "from-indigo-50 via-indigo-100/50 to-indigo-50/30 dark:from-indigo-900/30 dark:via-indigo-800/20 dark:to-indigo-900/10",
  },
  {
    id: "done",
    label: "Done",
    hint: "Completed tasks",
    accent:
      "border-emerald-300 bg-emerald-100 text-emerald-800 shadow-sm dark:border-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200",
    headerClass:
      "from-emerald-50 via-emerald-100/50 to-emerald-50/30 dark:from-emerald-900/30 dark:via-emerald-800/20 dark:to-emerald-900/10",
  },
] as const

const PRIORITY_CONFIG = {
  low: {
    label: "Low",
    className:
      "border-sky-200/70 bg-sky-50/90 text-sky-800 dark:border-sky-400/60 dark:bg-sky-500/15 dark:text-sky-100",
  },
  medium: {
    label: "Medium",
    className:
      "border-amber-300/70 bg-amber-50/90 text-amber-900 dark:border-amber-500/60 dark:bg-amber-500/15 dark:text-amber-100",
  },
  high: {
    label: "High",
    className:
      "border-rose-500 bg-rose-500 text-rose-50 shadow-sm dark:border-rose-400/80 dark:bg-rose-500/90 dark:text-rose-50",
  },
} as const

type StatusId = (typeof STATUS_CONFIG)[number]["id"]
type PriorityId = keyof typeof PRIORITY_CONFIG

type TodoDoc = Doc<"todos">

type BoardState = Record<StatusId, TodoDoc[]>

const EMPTY_BOARD: BoardState = STATUS_CONFIG.reduce(
  (acc, column) => ({
    ...acc,
    [column.id]: [],
  }),
  {} as BoardState,
)

const copyBoard = (board: BoardState): BoardState => {
  const next: Partial<BoardState> = {}
  for (const column of STATUS_CONFIG) {
    next[column.id] = [...board[column.id]]
  }
  return next as BoardState
}

const formatDueDate = (input?: number | null) => {
  if (!input) return null
  try {
    return format(new Date(input), "MMM d")
  } catch (error) {
    return null
  }
}

const toDateInputValue = (input?: number | null) => {
  if (!input) return ""
  try {
    return new Date(input).toISOString().slice(0, 10)
  } catch (error) {
    return ""
  }
}

const toTimestamp = (value: string) => {
  if (!value) return null
  const date = new Date(value + "T00:00:00")
  if (Number.isNaN(date.getTime())) return null
  return date.getTime()
}

interface TaskFormState {
  title: string
  description: string
  status: StatusId
  priority: PriorityId
  dueDate: string
}

const defaultFormState: TaskFormState = {
  title: "",
  description: "",
  status: "backlog",
  priority: "medium",
  dueDate: "",
}

export function TodoBoard() {
  const boardResponse = useQuery(api.todos.getBoard)
  const createTask = useMutation(api.todos.createTask)
  const updateTask = useMutation(api.todos.updateTask)
  const moveTask = useMutation(api.todos.moveTask)
  const deleteTask = useMutation(api.todos.deleteTask)

  const [board, setBoard] = useState<BoardState>(EMPTY_BOARD)
  const previousBoard = useRef<BoardState>(EMPTY_BOARD)

  useEffect(() => {
    if (!boardResponse?.columns) return
    const next = copyBoard(boardResponse.columns)
    setBoard(next)
    previousBoard.current = next
  }, [boardResponse?.columns])
  const totals = boardResponse?.totals ?? { all: 0, done: 0 }
  const inProgressCount = totals.all - totals.done

  const [dialogOpen, setDialogOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [formState, setFormState] = useState<TaskFormState>(defaultFormState)
  const [activeTask, setActiveTask] = useState<TodoDoc | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleBoardChange = useCallback((next: Record<string, TodoDoc[]>) => {
    const typedBoard = next as BoardState
    setBoard((prev) => {
      previousBoard.current = copyBoard(prev)
      return copyBoard(typedBoard)
    })
  }, [])

  const findTask = useCallback(
    (id: Id<"todos">) => {
      for (const column of STATUS_CONFIG) {
        const task = board[column.id].find((item) => item._id === id)
        if (task) return task
      }
      return null
    },
    [board],
  )

  const openCreateDialog = (status?: StatusId) => {
    setFormMode("create")
    setActiveTask(null)
    setFormState({
      ...defaultFormState,
      status: status ?? defaultFormState.status,
    })
    setDialogOpen(true)
  }

  const openEditDialog = (task: TodoDoc) => {
    setFormMode("edit")
    setActiveTask(task)
    setFormState({
      title: task.title,
      description: task.description ?? "",
      status: task.status as StatusId,
      priority: task.priority as PriorityId,
      dueDate: toDateInputValue(task.dueDate),
    })
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setTimeout(() => {
      setFormState(defaultFormState)
      setActiveTask(null)
    }, 150)
  }

  const handleSubmit = async () => {
    if (!formState.title.trim()) {
      toast.error("Please give the task a title.")
      return
    }

    setIsSubmitting(true)

    const payload = {
      title: formState.title.trim(),
      description: formState.description.trim() || undefined,
      status: formState.status,
      priority: formState.priority,
      dueDate: toTimestamp(formState.dueDate),
    }

    try {
      if (formMode === "create") {
        await createTask(payload)
        toast.success("Task created")
      } else if (activeTask) {
        await updateTask({
          taskId: activeTask._id,
          title: payload.title,
          description: payload.description ?? null,
          priority: payload.priority,
          dueDate: payload.dueDate,
        })
        if (activeTask.status !== payload.status) {
          await moveTask({ taskId: activeTask._id, toStatus: payload.status, toIndex: 0 })
        }
        toast.success("Task updated")
      }
      closeDialog()
    } catch (error) {
      console.error(error)
      toast.error("We couldn't save that task. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMove = useCallback(
    async ({ activeContainer, overContainer, overIndex, event }: KanbanMoveEvent) => {
      if (!overContainer) return

      const toStatus = overContainer as StatusId
      const toIndex = overIndex >= 0 ? overIndex : board[toStatus].length
      const taskId = event.active.id as Id<"todos">

      try {
        await moveTask({ taskId, toStatus, toIndex })
      } catch (error) {
        console.error(error)
        setBoard(copyBoard(previousBoard.current))
        toast.error("Drag failed. We've restored the previous order.")
      }
    },
    [board, moveTask],
  )

  const handleDelete = async (taskId: Id<"todos">) => {
    try {
      await deleteTask({ taskId })
      toast.success("Task removed")
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete task")
    }
  }

  const isLoading = !boardResponse

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">To-Do Board</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base leading-relaxed">
            Plan your study focus, drag tasks between columns, and keep your goals on track.
          </p>
        </div>
        <Button 
          onClick={() => openCreateDialog()} 
          variant="ghost"
          className="self-start sm:self-auto rounded-full bg-white text-gray-700 border-2 border-gray-200 px-4 sm:px-6 py-2.5 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 hover:shadow-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 md:gap-8">
        <SummaryCard
          title="Total tasks"
          value={totals.all}
          icon={ClipboardList}
          tone="primary"
        />
        <SummaryCard
          title="In progress"
          value={Math.max(inProgressCount, 0)}
          icon={CircleDashed}
          tone="amber"
        />
        <SummaryCard title="Completed" value={totals.done} icon={CheckCircle2} tone="emerald" />
      </div>

      <div className="space-y-6 sm:space-y-8">
        <Kanban
          value={board}
          onValueChange={handleBoardChange}
          getItemValue={(item) => item._id}
          onMove={handleMove}
          className="space-y-6 sm:space-y-8"
        >
          <KanbanBoard className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:gap-6 md:gap-8 lg:gap-10">
            {STATUS_CONFIG.map((column) => {
              const tasks = board[column.id]
              return (
                <KanbanColumn key={column.id} value={column.id} disabled className="flex flex-col">
                  <Card className={cn("group flex h-full flex-col overflow-hidden border-2 border-gray-200 bg-white shadow-md transition-all duration-300 hover:border-blue-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-600")}>
                    <CardHeader className={cn("space-y-4 border-b-2 border-gray-200 pb-6 text-foreground dark:border-gray-700", "bg-gradient-to-br", column.headerClass)}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-1">
                          <CardTitle className="text-xl font-semibold text-foreground">
                            {column.label}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground leading-relaxed">{column.hint}</p>
                        </div>
                        <Badge variant="outline" className="rounded-lg border border-blue-300 bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-800 shadow-sm dark:border-blue-600 dark:bg-blue-900/40 dark:text-blue-200">
                          {tasks.length}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={cn("inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold text-foreground shadow-sm", column.accent)}>
                          {column.label}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 px-4 bg-white text-gray-600 border border-gray-200 transition-all hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:border-gray-500 dark:hover:text-gray-100"
                          onClick={() => openCreateDialog(column.id)}
                        >
                          <Plus className="mr-1.5 h-4 w-4" />
                          Add Task
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="flex h-full flex-col gap-4 sm:gap-6 bg-gray-50 dark:bg-gray-800/50 pt-4 sm:pt-6">
                      <KanbanColumnContent value={column.id} className="min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] flex flex-1 flex-col gap-4 sm:gap-5 rounded-xl border border-dashed border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-900 p-3 sm:p-4 transition-colors duration-300">
                        {isLoading && tasks.length === 0 ? (
                          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800 p-4 sm:p-6 lg:p-8 text-sm font-medium text-gray-600 dark:text-gray-400">
                            Loading tasks...
                          </div>
                        ) : tasks.length === 0 ? (
                          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800 p-4 sm:p-6 lg:p-8 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                            {column.id === "backlog"
                              ? "Drop ideas here to work on later."
                              : "Nothing here yet. Move a task over when ready."}
                          </div>
                        ) : (
                          tasks.map((task) => (
                            <KanbanItem key={task._id} value={task._id}>
                              <KanbanItemHandle className="block cursor-grab transition-all duration-300 data-[dragging=true]:rotate-2 data-[dragging=true]:scale-[1.02] data-[dragging=true]:shadow-xl">
                                <TaskCard
                                  task={task}
                                  onEdit={openEditDialog}
                                  onDelete={handleDelete}
                                />
                              </KanbanItemHandle>
                            </KanbanItem>
                          ))
                        )}
                      </KanbanColumnContent>
                    </CardContent>
                  </Card>
                </KanbanColumn>
              )
            })}
          </KanbanBoard>

          <KanbanOverlay className="pointer-events-none">
            {({ value, variant }) => {
              if (variant === "column") return null
              const task = findTask(value as Id<"todos">)
              if (!task) return null
              return (
                <div className="animate-in fade-in-0 zoom-in-95 duration-200">
                  <div className="transform rotate-2 scale-105 transition-transform duration-200">
                    <TaskCard task={task} isOverlay />
                  </div>
                </div>
              )
            }}
          </KanbanOverlay>
        </Kanban>
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={(open) => (open ? setDialogOpen(true) : closeDialog())}
        mode={formMode}
        state={formState}
        onStateChange={setFormState}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

interface SummaryCardProps {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  tone: "primary" | "amber" | "emerald" | "neutral"
}

function SummaryCard({ title, value, icon: Icon, tone }: SummaryCardProps) {
  const toneStyles: Record<SummaryCardProps["tone"], string> = {
    primary: "bg-blue-100 text-blue-700 border border-blue-200 shadow-sm dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    amber: "bg-amber-100 text-amber-700 border border-amber-200 shadow-sm dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    emerald: "bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    neutral: "bg-gray-100 text-gray-700 border border-gray-200 shadow-sm dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
  }

  return (
    <Card className="border border-border/60 bg-white dark:bg-gray-900 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5">
      <CardContent className="flex items-center gap-5 py-7 px-6">
        <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl shadow-md transition-all duration-200 hover:scale-105", toneStyles[tone])}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

interface TaskCardProps {
  task: TodoDoc
  onEdit?: (task: TodoDoc) => void
  onDelete?: (taskId: Id<"todos">) => void
  isOverlay?: boolean
}

function TaskCard({ task, onEdit, onDelete, isOverlay }: TaskCardProps) {
  const dueLabel = formatDueDate(task.dueDate)
  const priority = PRIORITY_CONFIG[task.priority as PriorityId] ?? PRIORITY_CONFIG.medium

  return (
    <div
      className={cn(
        "group rounded-xl border-2 border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-800 p-3 sm:p-4 lg:p-5 shadow-md transition-all duration-300",
        !isOverlay && "hover:-translate-y-1.5 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100/50 dark:hover:border-blue-500 dark:hover:shadow-blue-900/20",
        isOverlay && "border-blue-400 shadow-2xl rotate-3 scale-105 backdrop-blur"
      )}
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1 space-y-3 sm:space-y-4">
          <p className="line-clamp-2 text-base sm:text-lg font-semibold leading-tight text-foreground">{task.title}</p>
          {task.description && (
            <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">{task.description}</p>
          )}
        </div>
        {!isOverlay && (onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-muted/60"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-36 border border-border/60 bg-popover text-popover-foreground shadow-xl"
            >
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(task)} className="hover:bg-muted/60">
                  <Pencil className="mr-2 h-4 w-4 text-muted-foreground" /> Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onDelete(task._id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Separator className="my-5 bg-border/60" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Badge variant="outline" className={cn("rounded-lg px-3 py-1 text-sm font-medium", priority.className)}>
          {priority.label} priority
        </Badge>
        {dueLabel && (
          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            {dueLabel}
          </span>
        )}
      </div>
    </div>
  )
}

interface TaskDialogProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  mode: "create" | "edit"
  state: TaskFormState
  onStateChange: (state: TaskFormState) => void
  onSubmit: () => void
  isSubmitting: boolean
}

function TaskDialog({ open, onOpenChange, mode, state, onStateChange, onSubmit, isSubmitting }: TaskDialogProps) {
  const handleChange = <K extends keyof TaskFormState>(key: K, value: TaskFormState[K]) => {
    onStateChange({ ...state, [key]: value })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-4 max-w-lg sm:mx-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create new task" : "Edit task"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Add a new item to your Kanban board and assign where it should start."
              : "Update the task details or move it to a new column."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="task-title" className="text-sm font-medium">Title</Label>
            <Input
              id="task-title"
              placeholder="Quick summary"
              value={state.title}
              onChange={(event) => handleChange("title", event.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="task-description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="task-description"
              placeholder="Add context, resources, or acceptance criteria"
              value={state.description}
              onChange={(event) => handleChange("description", event.target.value)}
              rows={4}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={state.status} onValueChange={(value: StatusId) => handleChange("status", value)}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_CONFIG.map((column) => (
                    <SelectItem key={column.id} value={column.id} className="capitalize">
                      {column.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium">Priority</Label>
              <Select
                value={state.priority}
                onValueChange={(value: PriorityId) => handleChange("priority", value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(PRIORITY_CONFIG) as PriorityId[]).map((priority) => (
                    <SelectItem key={priority} value={priority} className="capitalize">
                      {PRIORITY_CONFIG[priority].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label htmlFor="task-due" className="text-sm font-medium">Due date</Label>
              <Input
                type="date"
                id="task-due"
                value={state.dueDate}
                onChange={(event) => handleChange("dueDate", event.target.value)}
                className="h-11"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 pt-6">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)} 
            disabled={isSubmitting}
            className="bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 px-6 py-2.5"
          >
            Cancel
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting}
            variant="ghost"
            className="bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-500 px-6 py-2.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>Save task</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


