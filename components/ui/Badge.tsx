import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "brand"
  | "beginner"
  | "intermediate"
  | "advanced";

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-surface-100 dark:bg-surface-dark-200 text-gray-700 dark:text-gray-300",
  success:
    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  warning:
    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  error: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  info: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  brand:
    "bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400",
  beginner:
    "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  intermediate:
    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  advanced:
    "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
  dot?: boolean;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3.5 py-1 text-sm",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            variant === "success" && "bg-emerald-500",
            variant === "warning" && "bg-amber-500",
            variant === "error" && "bg-red-500",
            variant === "brand" && "bg-brand-500",
            variant === "info" && "bg-blue-500",
            (variant === "default" || !variant) && "bg-gray-500"
          )}
        />
      )}
      {children}
    </span>
  );
}
