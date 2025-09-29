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

const placeholderTextarea = typeof document !== "undefined" ? document.createElement("textarea") : undefined

export interface TextareaProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "onChange" | "onFocus" | "onBlur"
  > {
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, onFocus, onBlur, value, defaultValue, ...rest }, ref) => {
    const kendoRef = React.useRef<TextAreaHandle | null>(null)

    React.useImperativeHandle(ref, () => kendoRef.current?.element.current ?? placeholderTextarea!)

    const handleChange = React.useCallback(
      (event: TextAreaChangeEvent) => {
        if (!onChange) return
        const syntheticEvent = event.syntheticEvent as React.ChangeEvent<HTMLTextAreaElement>
        if (syntheticEvent && syntheticEvent.target) {
          ;(syntheticEvent.target as HTMLTextAreaElement).value =
            (event.value ?? "") as string
        }
        onChange(syntheticEvent)
      },
      [onChange],
    )

    const handleFocus = React.useCallback(
      (event: TextAreaFocusEvent) => {
        if (!onFocus) return
        onFocus(event.syntheticEvent as React.FocusEvent<HTMLTextAreaElement>)
      },
      [onFocus],
    )

    const handleBlur = React.useCallback(
      (event: TextAreaBlurEvent) => {
        if (!onBlur) return
        onBlur(event.syntheticEvent as React.FocusEvent<HTMLTextAreaElement>)
      },
      [onBlur],
    )

    return (
      <TextArea
        {...rest}
        ref={kendoRef}
        value={value as any}
        defaultValue={defaultValue as any}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "k-textarea flex min-h-[80px] w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-base shadow-sm transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:ring-offset-0 hover:border-gray-300 resize-none disabled:pointer-events-none disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400/20 dark:hover:border-gray-600 dark:disabled:bg-gray-800 md:text-sm [&_textarea]:placeholder:text-gray-500 [&_textarea]:dark:placeholder:text-gray-400 [&_textarea]:text-gray-900 [&_textarea]:dark:text-gray-100 [&_textarea]:bg-transparent [&_textarea]:border-0 [&_textarea]:outline-0 [&_textarea]:focus:ring-0 [&_textarea]:resize-none [&_textarea]:w-full [&_textarea]:h-full",
          className,
        )}
      />
    )
  },
)
Textarea.displayName = "Textarea"

export { Textarea }
