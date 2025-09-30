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

const buttonVariants = cva(
  "k-button inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md active:scale-[0.98]",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20 active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md active:scale-[0.98]",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 rounded-md px-4 py-2 text-xs",
        lg: "h-12 rounded-md px-8 py-3 text-base",
        icon: "h-10 w-10 p-2.5",
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
        return (slotRef.current ?? null) as HTMLButtonElement
      }
      return (kendoRef.current?.element ?? null) as HTMLButtonElement
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
