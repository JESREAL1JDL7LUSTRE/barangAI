import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"
import { cn } from "@workspace/ui/lib/utils"

export type TimeRange = "24H" | "7D" | "30D"

export interface TimeRangeToggleProps {
  value: TimeRange
  onChange: (value: TimeRange) => void
  className?: string
}

const RANGES: TimeRange[] = ["24H", "7D", "30D"]

export function TimeRangeToggle({ value, onChange, className }: TimeRangeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as TimeRange)
      }}
      className={cn(
        "rounded-md border border-border bg-card p-1 text-xs font-bold",
        className,
      )}
      aria-label="Select time range"
    >
      {RANGES.map((range) => (
        <ToggleGroupItem
          key={range}
          value={range}
          aria-label={range}
          className={cn(
            "rounded px-4 py-2 text-muted-foreground data-[state=on]:bg-lihok-accent/40 data-[state=on]:text-lihok-ink",
          )}
        >
          {range}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
