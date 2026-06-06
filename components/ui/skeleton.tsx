import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--radius-cards)] bg-cool-mist",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
