"use client"

import * as React from "react"
import {
  Switch as KendoSwitch,
  type SwitchChangeEvent,
  type SwitchHandle,
  type SwitchProps as KendoSwitchProps,
} from "@progress/kendo-react-inputs"

import { cn } from "@/lib/utils"

export interface SwitchProps
  extends Omit<KendoSwitchProps, "className" | "onChange"> {
  className?: string
  onCheckedChange?: (checked: boolean) => void
  onChange?: (event: SwitchChangeEvent) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    { className, onCheckedChange, onChange, checked, defaultChecked, disabled, ...rest },
    ref,
  ) => {
    const kendoRef = React.useRef<SwitchHandle | null>(null)
    React.useImperativeHandle(ref, () => kendoRef.current?.element ?? null)

    const handleChange = React.useCallback(
      (event: SwitchChangeEvent) => {
        onCheckedChange?.(event.value)
        onChange?.(event)
      },
      [onCheckedChange, onChange],
    )

    return (
      <KendoSwitch
        {...rest}
        ref={kendoRef}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={handleChange}
        size="small"
        className={cn(
          "k-switch !h-6 !w-11 align-middle transition-all duration-200",
          "[&_.k-switch-track]:!rounded-full [&_.k-switch-track]:!bg-gray-300 [&_.k-switch-track]:!border-0 [&_.k-switch-track]:!transition-all [&_.k-switch-track]:!duration-200",
          "[&_.k-switch-thumb]:!h-5 [&_.k-switch-thumb]:!w-5 [&_.k-switch-thumb]:!bg-white [&_.k-switch-thumb]:!rounded-full [&_.k-switch-thumb]:!shadow-md [&_.k-switch-thumb]:!transition-all [&_.k-switch-thumb]:!duration-200 [&_.k-switch-thumb]:!border-0",
          "checked:[&_.k-switch-track]:!bg-blue-500 checked:[&_.k-switch-thumb]:!translate-x-5",
          "hover:[&_.k-switch-track]:!bg-gray-400 hover:checked:[&_.k-switch-track]:!bg-blue-600",
          "disabled:[&_.k-switch-track]:!bg-gray-200 disabled:[&_.k-switch-track]:!cursor-not-allowed disabled:[&_.k-switch-thumb]:!bg-gray-100",
          "dark:[&_.k-switch-track]:!bg-gray-600 dark:checked:[&_.k-switch-track]:!bg-blue-400 dark:hover:[&_.k-switch-track]:!bg-gray-500 dark:hover:checked:[&_.k-switch-track]:!bg-blue-500 dark:disabled:[&_.k-switch-track]:!bg-gray-700 dark:disabled:[&_.k-switch-thumb]:!bg-gray-600",
          className,
        )}
      />
    )
  },
)
Switch.displayName = "Switch"

export { Switch }
