"use client"

import * as React from "react"
import {
  DatePicker,
  type DatePickerChangeEvent,
  type DatePickerHandle,
  type DatePickerProps as KendoDatePickerProps,
} from "@progress/kendo-react-dateinputs"

import { cn } from "@/lib/utils"

export interface DatePickerFieldProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "value" | "defaultValue" | "onChange" | "onBlur" | "onFocus" | "type" | "min" | "max" | "placeholder" | "size"
    >,
    Pick<KendoDatePickerProps, "min" | "max" | "format"> {
  value?: Date | null
  defaultValue?: Date | null
  onValueChange?: (value: Date | null) => void
  onChange?: (event: DatePickerChangeEvent) => void
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  placeholder?: KendoDatePickerProps["placeholder"]
}

type KendoFocusEvent = Parameters<NonNullable<KendoDatePickerProps["onFocus"]>>[0]
type KendoBlurEvent = Parameters<NonNullable<KendoDatePickerProps["onBlur"]>>[0]

const DatePickerField = React.forwardRef<HTMLInputElement, DatePickerFieldProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      onChange,
      onBlur,
      onFocus,
      min,
      max,
      format = "yyyy-MM-dd",
      placeholder,
      ...rest
    },
    ref,
  ) => {
    const kendoRef = React.useRef<DatePickerHandle | null>(null)

    React.useImperativeHandle(ref, () => (kendoRef.current?.element ?? null) as HTMLInputElement)

    const handleChange = React.useCallback(
      (event: DatePickerChangeEvent) => {
        const nextValue = event.value ?? null
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
      <DatePicker
        {...rest}
        ref={kendoRef}
        value={value ?? undefined}
        defaultValue={defaultValue ?? undefined}
        min={min ?? undefined}
        max={max ?? undefined}
        format={format}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "k-datepicker w-full [&_.k-input-inner]:px-3 [&_.k-input-inner]:py-2 [&_.k-input-inner]:text-sm",
          "rounded-md border border-input bg-transparent text-foreground shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
      />
    )
  },
)

DatePickerField.displayName = "DatePickerField"

export { DatePickerField }
