import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

export interface SectionCardProps {
  title?: React.ReactNode
  description?: string
  action?: React.ReactNode       // right-side element in header (e.g. "⋮" or badge)
  children: React.ReactNode
  className?: string
  contentClassName?: string
  variant?: "default" | "dashed" // "dashed" for system log card
  noPadding?: boolean            // for cards that have edge-to-edge content (table, chart)
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
  variant = "default",
  noPadding = false,
}: SectionCardProps) {
  return (
    <Card
      className={cn(
        "shadow-sm",
        variant === "dashed" && "border-dashed bg-card/70",
        className,
      )}
    >
      {(title ?? action) && (
        <CardHeader className="flex flex-row items-start justify-between gap-4 p-6 pb-0">
          <div>
            {title && <CardTitle className="text-base font-bold">{title}</CardTitle>}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </CardHeader>
      )}
      <CardContent className={cn(noPadding ? "p-0" : "p-6", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}
