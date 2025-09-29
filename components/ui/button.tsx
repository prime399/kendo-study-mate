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
  "k-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
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
  default: "primary",
  destructive: "error",
  outline: "base",
  secondary: "secondary",
  ghost: "base",
  link: "primary",
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
