import { Brain } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Progress } from "@workspace/ui/components/progress"
import { SectionCard } from "@/components/section-card"

export interface AiUrgencyPanelProps {
  score: number        // 0–100
  maxScore?: number    // defaults to 100
  reasoning: string    // explanation text below the score
  isRealtime?: boolean // shows "Real-time" badge when true
  className?: string
}

export function AiUrgencyPanel({
  score,
  maxScore = 100,
  reasoning,
  isRealtime = true,
  className,
}: AiUrgencyPanelProps) {
  const percentage = Math.round((score / maxScore) * 100)

  return (
    <SectionCard
      title={
        <span className="flex items-center gap-2">
          <Brain className="size-5 text-primary" />
          AI Urgency Score
        </span>
      }
      action={
        isRealtime ? (
          <Badge className="rounded bg-lihok-dark px-3 py-1 font-bold text-white hover:bg-lihok-dark/90 border-transparent">
            Real-time
          </Badge>
        ) : undefined
      }
      className={className}
    >
      <p className="mt-5 text-6xl font-black tracking-[-0.08em]">
        {score}
        <span className="text-sm text-muted-foreground"> / {maxScore}</span>
      </p>
      <Progress
        value={percentage}
        className="mt-4 h-3 bg-muted [&_[data-slot=progress-indicator]]:bg-primary"
        aria-label={`AI urgency score: ${score} out of ${maxScore}`}
      />
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{reasoning}</p>
    </SectionCard>
  )
}
