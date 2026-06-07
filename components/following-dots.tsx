"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const DOT_DELAYS = [0, 0.2, 0.4];

export function FollowingDots({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <span className={cn("inline-flex", className)} aria-hidden>
      {DOT_DELAYS.map((delay, i) => (
        <motion.span
          key={i}
          className="inline-block w-[0.35em] text-center font-semibold"
          animate={
            reducedMotion
              ? { opacity: 1, y: 0 }
              : { opacity: [0.2, 1, 0.2], y: [0, -3, 0] }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 1.1,
                  repeat: Infinity,
                  delay,
                  ease: "easeInOut",
                }
          }
        >
          .
        </motion.span>
      ))}
    </span>
  );
}
