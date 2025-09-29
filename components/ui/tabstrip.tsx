"use client"

import * as React from "react"
import {
  TabStrip as KendoTabStrip,
  TabStripTab,
  type TabStripProps as KendoTabStripProps,
} from "@progress/kendo-react-layout"

import { cn } from "@/lib/utils"

export interface TabStripItem {
  key: string
  title: React.ReactNode
  content: React.ReactNode
  disabled?: boolean
}

export interface TabStripProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "children"> {
  items: TabStripItem[]
  value: string
  onValueChange: (value: string) => void
  keepMount?: boolean
  tabStripProps?: Pick<
    KendoTabStripProps,
    "animation" | "scrollable" | "tabPosition" | "size"
  >
}

type TabStripSelectEvent = Parameters<NonNullable<KendoTabStripProps["onSelect"]>>[0]

const TabStrip = React.forwardRef<HTMLDivElement, TabStripProps>(
  ({ className, items, value, onValueChange, keepMount = false, tabStripProps, ...rest }, ref) => {
    const selectedIndex = React.useMemo(() => {
      const index = items.findIndex((item) => item.key === value)
      return index >= 0 ? index : 0
    }, [items, value])

    const handleSelect = React.useCallback(
      (event: TabStripSelectEvent) => {
        const next = items[event.selected]
        if (next) {
          onValueChange(next.key)
        }
      },
      [items, onValueChange],
    )

    return (
      <div ref={ref} className={className} {...rest}>
        <KendoTabStrip
          {...tabStripProps}
          selected={selectedIndex}
          onSelect={handleSelect}
          className={cn(
            "k-tabstrip k-tabstrip-top rounded-xl border border-input bg-muted/40 p-2",
            "[&_.k-tabstrip-items]:gap-2 [&_.k-tabstrip-items]:rounded-lg",
            "[&_.k-item]:rounded-md [&_.k-item]:border-0 [&_.k-item]:px-4 [&_.k-item]:py-2",
            "[&_.k-link]:text-sm [&_.k-link]:font-medium",
            "[&_.k-state-active_.k-link]:bg-background [&_.k-state-active_.k-link]:text-foreground [&_.k-state-active_.k-link]:shadow",
          )}
        >
          {items.map((item) => (
            <TabStripTab key={item.key} title={item.title} disabled={item.disabled}>
              <div className="mt-6">
                {keepMount || item.key === value ? item.content : null}
              </div>
            </TabStripTab>
          ))}
        </KendoTabStrip>
      </div>
    )
  },
)

TabStrip.displayName = "TabStrip"

export { TabStrip }
