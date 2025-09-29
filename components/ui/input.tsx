"use client"

import * as React from "react"
import {
  TextBox,
  type TextBoxChangeEvent,
  type TextBoxHandle,
  type TextBoxProps as KendoTextBoxProps,
} from "@progress/kendo-react-inputs"

import { cn } from "@/lib/utils"

const placeholderInput = typeof document !== "undefined" ? document.createElement("input") : undefined

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "onChange" | "onFocus" | "onBlur"
  > {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

type KendoTextBoxComponentProps = KendoTextBoxProps

type KendoFocusEvent = Parameters<NonNullable<KendoTextBoxComponentProps["onFocus"]>>[0]
type KendoBlurEvent = Parameters<NonNullable<KendoTextBoxComponentProps["onBlur"]>>[0]

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, onChange, onFocus, onBlur, type = "text", value, defaultValue, ...rest },
    ref,
  ) => {
    const kendoRef = React.useRef<TextBoxHandle | null>(null)

    React.useImperativeHandle(ref, () => kendoRef.current?.element ?? placeholderInput!)

    const handleChange = React.useCallback(
      (event: TextBoxChangeEvent) => {
        if (!onChange) return
        const syntheticEvent = event.syntheticEvent
        if (syntheticEvent && syntheticEvent.target) {
          ;(syntheticEvent.target as HTMLInputElement).value =
            (event.value ?? "") as string
        }
        onChange(syntheticEvent)
      },
      [onChange],
    )

    const handleFocus = React.useCallback(
      (event: KendoFocusEvent) => {
        if (!onFocus) return
        const focusEvent =
          typeof event === "object" && event !== null && "syntheticEvent" in event
            ? (event as { syntheticEvent: React.FocusEvent<HTMLInputElement> }).syntheticEvent
            : (event as React.FocusEvent<HTMLInputElement>)
        onFocus(focusEvent)
      },
      [onFocus],
    )

    const handleBlur = React.useCallback(
      (event: KendoBlurEvent) => {
        if (!onBlur) return
        const blurEvent =
          typeof event === "object" && event !== null && "syntheticEvent" in event
            ? (event as { syntheticEvent: React.FocusEvent<HTMLInputElement> }).syntheticEvent
            : (event as React.FocusEvent<HTMLInputElement>)
        onBlur(blurEvent)
      },
      [onBlur],
    )

    return (
      <TextBox
        {...rest}
        ref={kendoRef}
        type={type}
        value={value as any}
        defaultValue={defaultValue as any}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "k-textbox flex h-10 w-full items-center rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 text-base shadow-sm transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:ring-offset-0 hover:border-gray-300 disabled:pointer-events-none disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-blue-400 dark:focus-within:ring-blue-400/20 dark:hover:border-gray-600 dark:disabled:bg-gray-800 md:text-sm",
          className,
        )}
        inputAttributes={{ 
          className: "placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100 bg-transparent border-0 outline-0 focus:ring-0 w-full" 
        }}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }
