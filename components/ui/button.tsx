import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-invoice-blue/30",
  {
    variants: {
      variant: {
        default:
          "bg-onyx-button text-paper-white rounded-[var(--radius-buttons)] px-6 py-[13px] text-body-sm shadow-[var(--shadow-subtle-2)] hover:bg-tinted-shadow",
        ghost:
          "bg-transparent text-midnight-ink rounded-[var(--radius-buttons)] px-4 py-2 text-body-sm hover:text-charcoal-whisper",
      },
      size: {
        default: "min-h-[44px] px-6 py-[13px]",
        sm: "min-h-[36px] px-5 py-2 text-body-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
