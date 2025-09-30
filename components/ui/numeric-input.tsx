"use client"

import * as React from "react"
import {
  NumericTextBox,
  type NumericTextBoxChangeEvent,
  type NumericTextBoxHandle,
  type NumericTextBoxProps as KendoNumericTextBoxProps,
} from "@progress/kendo-react-inputs"

import { cn } from "@/lib/utils"

export interface NumericInputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "type" | "value" | "defaultValue" | "onChange" | "onBlur" | "onFocus" | "min" | "max" | "step" | "placeholder" | "size"
    > {
  value?: number | null
  defaultValue?: number | null
  onValueChange?: (value: number | null) => void
  onChange?: (event: NumericTextBoxChangeEvent) => void
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  min?: KendoNumericTextBoxProps["min"]
  max?: KendoNumericTextBoxProps["max"]
  step?: KendoNumericTextBoxProps["step"]
  format?: KendoNumericTextBoxProps["format"]
  spinners?: KendoNumericTextBoxProps["spinners"]
  placeholder?: KendoNumericTextBoxProps["placeholder"]
}

type KendoFocusEvent = Parameters<NonNullable<KendoNumericTextBoxProps["onFocus"]>>[0]
type KendoBlurEvent = Parameters<NonNullable<KendoNumericTextBoxProps["onBlur"]>>[0]

const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  (
    {
      className,
      value,
      defaultValue,
      min,
      max,
      step,
      format,
      spinners = false,
      placeholder,
      onValueChange,
      onChange,
      onBlur,
      onFocus,
      ...rest
    },
    ref,
  ) => {
    const kendoRef = React.useRef<NumericTextBoxHandle | null>(null)

    React.useImperativeHandle(ref, () => (kendoRef.current?.element ?? null) as HTMLInputElement)

    const handleChange = React.useCallback(
      (event: NumericTextBoxChangeEvent) => {
        const nextValue = typeof event.value === "number" ? event.value : event.value ?? null
        onValueChange?.(nextValue)
        onChange?.(event)
      },
      [onChange, onValueChange],
    )

    const handleFocus = React.useCallback(
      (event: KendoFocusEvent) => {
        if (!onFocus) return
        if (typeof event === "object" && event !== null && "syntheticEvent" in event) {
          const focusEvent = (event as { syntheticEvent: React.SyntheticEvent<HTMLInputElement> }).syntheticEvent
          onFocus(focusEvent as unknown as React.FocusEvent<HTMLInputElement>)
        }
      },
      [onFocus],
    )

    const handleBlur = React.useCallback(
      (event: KendoBlurEvent) => {
        if (!onBlur) return
        if (typeof event === "object" && event !== null && "syntheticEvent" in event) {
          const blurEvent = (event as { syntheticEvent: React.SyntheticEvent<HTMLInputElement> }).syntheticEvent
          onBlur(blurEvent as unknown as React.FocusEvent<HTMLInputElement>)
        }
      },
      [onBlur],
    )

    return (
      <NumericTextBox
        {...rest}
        ref={kendoRef}
        value={value ?? undefined}
        defaultValue={defaultValue ?? undefined}
        min={min ?? undefined}
        max={max ?? undefined}
        step={step ?? undefined}
        format={format}
        spinners={spinners}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "k-numerictextbox w-full h-11 rounded-md border border-input bg-background shadow-sm ring-offset-background transition-all duration-200",
          "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:border-input/80",
          "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
          "[&_.k-input]:h-full [&_.k-input]:px-4 [&_.k-input]:py-2 [&_.k-input]:text-sm [&_.k-input]:bg-transparent [&_.k-input]:border-none",
          "[&_.k-input_input]:bg-transparent [&_.k-input_input]:placeholder:text-muted-foreground",
          "[&_.k-button]:h-7 [&_.k-button]:w-7 [&_.k-button]:border-none [&_.k-button]:bg-transparent [&_.k-button]:text-muted-foreground [&_.k-button]:hover:bg-accent [&_.k-button]:hover:text-accent-foreground [&_.k-button]:rounded-sm [&_.k-button]:transition-colors",
          "[&_.k-button-group]:flex-col [&_.k-button-group]:gap-0.5 [&_.k-button-group]:mr-1",
          className,
        )}
      />
    )
  },
)

NumericInput.displayName = "NumericInput"

export { NumericInput }
