import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
  id?: string;
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className,
  glass = false,
  hover = false,
  padding = "md",
  onClick,
  id,
}: CardProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={cn(
        "rounded-2xl border transition-all duration-200",
        glass
          ? "bg-white/60 dark:bg-white/5 backdrop-blur-md border-white/30 dark:border-white/10 shadow-glass dark:shadow-glass-dark"
          : "bg-white dark:bg-surface-dark-100 border-surface-200 dark:border-surface-dark-300 shadow-card",
        hover &&
          "cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5 hover:border-brand-200 dark:hover:border-brand-800",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <div>{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "text-lg font-bold text-gray-900 dark:text-white",
        className
      )}
    >
      {children}
    </h3>
  );
}
