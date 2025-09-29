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
          "k-switch !h-5 !w-9 align-middle [&_.k-switch-thumb]:!h-4 [&_.k-switch-thumb]:!w-4",
          "[&_.k-switch-track]:!rounded-full [&_.k-switch-thumb]:!rounded-full",
          className,
        )}
      />
    )
  },
)
Switch.displayName = "Switch"

export { Switch }
