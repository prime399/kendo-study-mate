"use client"

import * as React from "react"
import {
  ProgressBar as KendoProgressBar,
  type ProgressBarProps as KendoProgressBarProps,
  type ProgressBarHandle,
} from "@progress/kendo-react-progressbars"

import { cn } from "@/lib/utils"

export interface ProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "children" | "defaultValue"> {
  value?: number
  max?: number
  min?: number
  animation?: KendoProgressBarProps["animation"]
  onFocus?: React.FocusEventHandler<HTMLDivElement>
  onBlur?: React.FocusEventHandler<HTMLDivElement>
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, min = 0, max = 100, animation = false, onFocus, onBlur, ...rest }, ref) => {
    const kendoRef = React.useRef<ProgressBarHandle | null>(null)

    React.useImperativeHandle(ref, () => (kendoRef.current?.element ?? null) as HTMLDivElement)

    React.useEffect(() => {
      const element = kendoRef.current?.element
      if (!element) return

      const handleFocus = (event: FocusEvent) => {
        if (!onFocus) return
        onFocus(event as unknown as React.FocusEvent<HTMLDivElement>)
      }

      const handleBlur = (event: FocusEvent) => {
        if (!onBlur) return
        onBlur(event as unknown as React.FocusEvent<HTMLDivElement>)
      }

      if (onFocus) {
        element.addEventListener("focus", handleFocus)
      }
      if (onBlur) {
        element.addEventListener("blur", handleBlur)
      }

      return () => {
        if (onFocus) {
          element.removeEventListener("focus", handleFocus)
        }
        if (onBlur) {
          element.removeEventListener("blur", handleBlur)
        }
      }
    }, [onBlur, onFocus])

    return (
      <KendoProgressBar
        {...rest}
        ref={kendoRef}
        min={min}
        max={max}
        value={Math.min(Math.max(value, min), max)}
        animation={animation}
        className={cn(
          "k-progressbar h-2 w-full overflow-hidden rounded-full bg-secondary border border-transparent shadow-sm",
          "[&_.k-progressbar-value]:bg-primary [&_.k-progressbar-value]:rounded-full [&_.k-progressbar-value]:transition-all [&_.k-progressbar-value]:duration-300 [&_.k-progressbar-value]:ease-out",
          "[&_.k-progressbar-value]:shadow-sm [&_.k-progressbar-value]:relative",
          className,
        )}
      />
    )
  },
)

Progress.displayName = "Progress"

export { Progress }
