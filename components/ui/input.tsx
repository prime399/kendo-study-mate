"use client"

import * as React from "react"
import {
  TextBox,
  type TextBoxChangeEvent,
  type TextBoxHandle,
  type TextBoxProps as KendoTextBoxProps,
} from "@progress/kendo-react-inputs"

import { cn } from "@/lib/utils"

export interface InputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "size" | "onChange" | "onFocus" | "onBlur"
    >,
    Pick<KendoTextBoxProps, "placeholder"> {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

type KendoFocusEvent = Parameters<NonNullable<KendoTextBoxProps["onFocus"]>>[0]
type KendoBlurEvent = Parameters<NonNullable<KendoTextBoxProps["onBlur"]>>[0]

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, onChange, onFocus, onBlur, type = "text", value, defaultValue, placeholder, ...rest },
    ref,
  ) => {
    const kendoRef = React.useRef<TextBoxHandle | null>(null)

    React.useImperativeHandle(ref, () => (kendoRef.current?.element ?? null) as HTMLInputElement)

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
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "k-textbox flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 text-base shadow-sm transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background disabled:pointer-events-none disabled:opacity-50 md:text-sm",
          className,
        )}
        inputAttributes={{ className: "placeholder:text-muted-foreground" }}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }
