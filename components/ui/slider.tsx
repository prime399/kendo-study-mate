"use client"

import * as React from "react"
import {
  Slider as KendoSlider,
  type SliderBlurEvent,
  type SliderChangeEvent,
  type SliderHandle,
  type SliderProps as KendoSliderProps,
} from "@progress/kendo-react-inputs"

import { cn } from "@/lib/utils"

export interface SliderProps
  extends Omit<
    KendoSliderProps,
    "className" | "value" | "defaultValue" | "onChange" | "onBlur" | "orientation"
  > {
  className?: string
  value?: number[]
  defaultValue?: number[]
  onValueChange?: (value: number[]) => void
  onValueCommit?: (value: number[]) => void
  orientation?: "horizontal" | "vertical"
}

const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      onValueCommit,
      orientation = "horizontal",
      onChange,
      onBlur,
      min,
      max,
      step,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const isControlled = Array.isArray(value)
    const initialValue = React.useMemo(() => {
      if (isControlled && value && typeof value[0] === "number") {
        return value[0]
      }
      if (defaultValue && typeof defaultValue[0] === "number") {
        return defaultValue[0]
      }
      if (typeof min === "number") {
        return min
      }
      return 0
    }, [defaultValue, isControlled, min, value])

    const [internalValue, setInternalValue] = React.useState<number>(initialValue)

    React.useEffect(() => {
      if (isControlled && value && typeof value[0] === "number") {
        setInternalValue(value[0])
      }
    }, [isControlled, value])

    const kendoRef = React.useRef<SliderHandle | null>(null)
    React.useImperativeHandle(ref, () => kendoRef.current?.element ?? null)

    const emitValueChange = React.useCallback(
      (next: number) => {
        onValueChange?.([next])
      },
      [onValueChange],
    )

    const emitValueCommit = React.useCallback(
      (next: number) => {
        onValueCommit?.([next])
      },
      [onValueCommit],
    )

    const handleChange = React.useCallback(
      (event: SliderChangeEvent) => {
        const nextValue = event.value ?? 0
        if (!isControlled) {
          setInternalValue(nextValue)
        }
        emitValueChange(nextValue)
        onChange?.(event)
      },
      [emitValueChange, isControlled, onChange],
    )

    const handleBlur = React.useCallback(
      (event: SliderBlurEvent) => {
        const nextValue = event.value ?? (isControlled && value ? value[0] ?? 0 : internalValue)
        emitValueCommit(nextValue)
        onBlur?.(event)
      },
      [emitValueCommit, internalValue, isControlled, onBlur, value],
    )

    return (
      <KendoSlider
        {...rest}
        ref={kendoRef}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={cn(
          "k-slider w-full py-2 [&_.k-slider-track]:!h-2 [&_.k-slider-track]:!bg-gray-200 [&_.k-slider-track]:!rounded-full [&_.k-slider-selection]:!bg-blue-500 [&_.k-slider-selection]:!rounded-full [&_.k-draghandle]:!h-5 [&_.k-draghandle]:!w-5 [&_.k-draghandle]:!bg-white [&_.k-draghandle]:!border-2 [&_.k-draghandle]:!border-blue-500 [&_.k-draghandle]:!rounded-full [&_.k-draghandle]:!shadow-md [&_.k-draghandle]:hover:!scale-110 [&_.k-draghandle]:!transition-all [&_.k-draghandle]:!duration-200 dark:[&_.k-slider-track]:!bg-gray-700 dark:[&_.k-slider-selection]:!bg-blue-400 dark:[&_.k-draghandle]:!border-blue-400",
          className,
        )}
        value={isControlled ? value?.[0] : internalValue}
        defaultValue={defaultValue ? defaultValue[0] : undefined}
        onChange={handleChange}
        onBlur={handleBlur}
        orientation={orientation === "vertical" ? "vertical" : "horizontal"}
      />
    )
  },
)
Slider.displayName = "Slider"

export { Slider }
