import { Progress } from "@workspace/ui/components/progress"
import { cn } from "@workspace/ui/lib/utils"

export interface CategoryBarProps {
  name: string
  percentage: number
  /** Override bar fill colour — defaults to bg-primary */
  barClassName?: string
  className?: string
}

export function CategoryBar({ name, percentage, barClassName = "bg-primary", className }: CategoryBarProps) {
  return (
    <div className={cn("grid gap-1", className)}>
      <div className="mb-1 flex justify-between text-xs font-semibold">
        <span>{name}</span>
        <span className="text-muted-foreground">{percentage}%</span>
      </div>
      <Progress
        value={percentage}
        className={cn(
          "h-2 bg-muted",
          `[&_[data-slot=progress-indicator]]:${barClassName}`
        )}
      />
    </div>
  )
}
