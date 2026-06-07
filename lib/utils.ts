import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      // Acctual type scale — font sizes, not text colors
      text: [
        "caption",
        "body-sm",
        "body",
        "subheading",
        "heading",
        "heading-lg",
        "display",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
