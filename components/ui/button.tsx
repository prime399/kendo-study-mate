"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import {
  Button as KendoButton,
  type ButtonHandle,
  type ButtonProps as KendoButtonProps,
} from "@progress/kendo-react-buttons"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const placeholderButton = typeof document !== "undefined" ? document.createElement("button") : undefined

const buttonVariants = cva(
  "k-button inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95 dark:bg-blue-600 dark:hover:bg-blue-700",
        destructive:
          "bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg active:scale-95 dark:bg-red-600 dark:hover:bg-red-700",
        outline:
          "border-2 border-blue-200 bg-transparent text-blue-700 hover:bg-blue-50 hover:border-blue-300 active:scale-95 dark:border-blue-400/50 dark:text-blue-400 dark:hover:bg-blue-950/20 dark:hover:border-blue-400",
        secondary:
          "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 hover:shadow-md active:scale-95 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50",
        ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:scale-95 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300",
      },
      size: {
        default: "h-10 px-6 py-2.5 text-sm",
        sm: "h-8 px-4 py-1.5 text-xs font-medium",
        lg: "h-12 px-8 py-3 text-base font-semibold",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>
type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>

const kendoFillMode: Record<ButtonVariant, KendoButtonProps["fillMode"] | undefined> = {
  default: "solid",
  destructive: "solid",
  outline: "outline",
  secondary: "solid",
  ghost: "flat",
  link: "link",
}

const kendoThemeColor: Record<ButtonVariant, KendoButtonProps["themeColor"] | undefined> = {
  default: "info",
  destructive: "error",
  outline: "info",
  secondary: "success",
  ghost: "base",
  link: "info",
}

const kendoSize: Record<ButtonSize, KendoButtonProps["size"] | undefined> = {
  sm: "small",
  default: "medium",
  lg: "large",
  icon: "medium",
}

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", asChild = false, children, ...rest },
    ref,
  ) => {
    const variantKey = (variant ?? "default") as ButtonVariant
    const sizeKey = (size ?? "default") as ButtonSize
    const composedClassName = cn(buttonVariants({ variant: variantKey, size: sizeKey }), className)

    const kendoRef = React.useRef<ButtonHandle | null>(null)
    const slotRef = React.useRef<HTMLButtonElement | null>(null)

    React.useImperativeHandle(ref, () => {
      if (asChild) {
        return slotRef.current ?? placeholderButton!
      }
      return kendoRef.current?.element ?? placeholderButton!
    })

    if (asChild) {
      return (
        <Slot
          {...rest}
          className={composedClassName}
          ref={slotRef as unknown as React.Ref<HTMLElement>}
        >
          {children}
        </Slot>
      )
    }

    return (
      <KendoButton
        {...rest}
        ref={kendoRef}
        className={composedClassName}
        fillMode={kendoFillMode[variantKey]}
        themeColor={kendoThemeColor[variantKey]}
        size={kendoSize[sizeKey]}
        rounded="medium"
      >
        {children}
      </KendoButton>
    )
  },
)

Button.displayName = "Button"

export { Button, buttonVariants }
