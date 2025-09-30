"use client"

import * as React from "react"
import {
  TextArea,
  type TextAreaBlurEvent,
  type TextAreaChangeEvent,
  type TextAreaFocusEvent,
  type TextAreaHandle,
} from "@progress/kendo-react-inputs"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "onChange" | "onFocus" | "onBlur" | "value" | "defaultValue"
  > {
  value?: string | null
  defaultValue?: string | null
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, onFocus, onBlur, value, defaultValue, ...rest }, ref) => {
    const kendoRef = React.useRef<TextAreaHandle | null>(null)

    React.useImperativeHandle(ref, () => (kendoRef.current?.element.current ?? null) as HTMLTextAreaElement)

    const handleChange = React.useCallback(
      (event: TextAreaChangeEvent) => {
        if (!onChange) return
        const syntheticEvent = event.syntheticEvent as unknown as React.ChangeEvent<HTMLTextAreaElement>
        if (syntheticEvent && syntheticEvent.target) {
          ;(syntheticEvent.target as HTMLTextAreaElement).value = (event.value ?? "") as string
        }
        onChange(syntheticEvent)
      },
      [onChange],
    )

    const handleFocus = React.useCallback(
      (event: TextAreaFocusEvent) => {
        if (!onFocus) return
        onFocus(event.syntheticEvent as unknown as React.FocusEvent<HTMLTextAreaElement>)
      },
      [onFocus],
    )

    const handleBlur = React.useCallback(
      (event: TextAreaBlurEvent) => {
        if (!onBlur) return
        onBlur(event.syntheticEvent as unknown as React.FocusEvent<HTMLTextAreaElement>)
      },
      [onBlur],
    )

    return (
      <TextArea
        {...rest}
        ref={kendoRef}
        value={value ?? undefined}
        defaultValue={defaultValue ?? undefined}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "k-textarea flex min-h-[120px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm shadow-sm ring-offset-background transition-all duration-200 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:border-input/80 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
          "[&_textarea]:bg-transparent [&_textarea]:border-none [&_textarea]:shadow-none [&_textarea]:resize-none [&_textarea]:placeholder:text-muted-foreground [&_textarea]:text-sm [&_textarea]:leading-relaxed",
          className,
        )}
      />
    )
  },
)
Textarea.displayName = "Textarea"

export { Textarea }
