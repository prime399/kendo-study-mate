"use client"

import * as React from "react"
import {
  DropDownList,
  type DropDownListChangeEvent,
  type DropDownListHandle,
  type DropDownListProps as KendoDropDownListProps,
} from "@progress/kendo-react-dropdowns"

import { cn } from "@/lib/utils"

export interface DropdownOption<Value = string | number> {
  label: React.ReactNode
  value: Value
  disabled?: boolean
}

export interface DropdownListProps<Value = string | number>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "children" | "defaultValue"> {
  options: DropdownOption<Value>[]
  value?: Value | null
  defaultValue?: Value | null
  placeholder?: React.ReactNode
  filterable?: boolean
  onValueChange?: (value: Value | null) => void
  onChange?: (event: DropDownListChangeEvent) => void
  onFocus?: React.FocusEventHandler<HTMLDivElement>
  onBlur?: React.FocusEventHandler<HTMLDivElement>
}

type KendoBlurEvent = Parameters<NonNullable<KendoDropDownListProps["onBlur"]>>[0]
type KendoFocusEvent = Parameters<NonNullable<KendoDropDownListProps["onFocus"]>>[0]

type AnyOption = DropdownOption<any>

const DropdownList = React.forwardRef<HTMLDivElement, DropdownListProps>(
  (
    {
      className,
      options,
      value,
      defaultValue,
      placeholder,
      onValueChange,
      onChange,
      onFocus,
      onBlur,
      filterable = false,
      ...rest
    },
    ref,
  ) => {
    const kendoRef = React.useRef<DropDownListHandle | null>(null)

    React.useImperativeHandle(ref, () => (kendoRef.current?.element ?? null) as HTMLDivElement)

    const data: AnyOption[] = React.useMemo(() => options, [options])
    const defaultItem = React.useMemo(() => {
      if (!placeholder) return undefined
      return { label: placeholder, value: null }
    }, [placeholder])

    const resolveItem = React.useCallback(
      (currentValue: unknown | null) => {
        if (currentValue === null || currentValue === undefined) {
          return null
        }
        return data.find((item) => item.value === currentValue) ?? null
      },
      [data],
    )

    const currentItem = resolveItem(value ?? null)
    const defaultItemValue = defaultValue != null ? resolveItem(defaultValue) : undefined

    const handleChange = React.useCallback(
      (event: DropDownListChangeEvent) => {
        const option = event.value as AnyOption | null
        const nextValue = option?.value ?? null
        onValueChange?.(nextValue)
        onChange?.(event)
      },
      [onChange, onValueChange],
    )

    const handleFocus = React.useCallback(
      (event: KendoFocusEvent) => {
        if (!onFocus) return
        if (typeof event === "object" && event !== null && "syntheticEvent" in event) {
          const focusEvent = (event as { syntheticEvent: React.SyntheticEvent<HTMLElement> }).syntheticEvent
          onFocus(focusEvent as unknown as React.FocusEvent<HTMLDivElement>)
        }
      },
      [onFocus],
    )

    const handleBlur = React.useCallback(
      (event: KendoBlurEvent) => {
        if (!onBlur) return
        if (typeof event === "object" && event !== null && "syntheticEvent" in event) {
          const blurEvent = (event as { syntheticEvent: React.SyntheticEvent<HTMLElement> }).syntheticEvent
          onBlur(blurEvent as unknown as React.FocusEvent<HTMLDivElement>)
        }
      },
      [onBlur],
    )

    return (
      <DropDownList
        {...rest}
        ref={kendoRef}
        data={data}
        textField="label"
        dataItemKey="value"
        value={currentItem ?? undefined}
        defaultValue={defaultItemValue ?? undefined}
        defaultItem={defaultItem as AnyOption | undefined}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        filterable={filterable}
        className={cn(
          "k-dropdownlist w-full h-11 rounded-md border border-input bg-background shadow-sm ring-offset-background transition-all duration-200",
          "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:border-input/80",
          "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
          "[&_.k-input-inner]:h-full [&_.k-input-inner]:px-4 [&_.k-input-inner]:py-2 [&_.k-input-inner]:text-sm [&_.k-input-inner]:bg-transparent [&_.k-input-inner]:border-none",
          "[&_.k-input-inner_input]:bg-transparent [&_.k-input-inner_input]:placeholder:text-muted-foreground",
          "[&_.k-button]:h-9 [&_.k-button]:w-9 [&_.k-button]:border-none [&_.k-button]:bg-transparent [&_.k-button]:text-muted-foreground [&_.k-button]:hover:bg-accent [&_.k-button]:hover:text-accent-foreground [&_.k-button]:rounded-sm [&_.k-button]:transition-colors",
          className,
        )}
      />
    )
  },
)

DropdownList.displayName = "DropdownList"

export { DropdownList }
