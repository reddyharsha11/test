import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0–100
  max?: number;
  size?: "xs" | "sm" | "md";
  color?: "brand" | "green" | "orange" | "red";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

const colorMap = {
  brand: "bg-brand-gradient",
  green: "bg-gradient-to-r from-green-400 to-emerald-500",
  orange: "bg-gradient-to-r from-orange-400 to-amber-500",
  red: "bg-gradient-to-r from-red-400 to-rose-500",
};

const sizeMap = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2.5",
};

export function ProgressBar({
  value,
  max = 100,
  size = "sm",
  color = "brand",
  showLabel = false,
  animated = true,
  className,
}: ProgressBarProps) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {Math.round(percent)}%
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full bg-surface-200 dark:bg-surface-dark-300 rounded-full overflow-hidden",
          sizeMap[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            colorMap[color],
            animated && "transition-[width]"
          )}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={Math.round(percent)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
