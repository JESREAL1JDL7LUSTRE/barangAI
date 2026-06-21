# 09 — AiUrgencyPanel Component

## Problem

The AI Urgency Score section in `command-center.$incidentId.tsx` (lines 112–133) is a bespoke layout with a raw progress bar div — it does not use the shadcn `Progress` that `StatCard` already uses:

```tsx
<section className="rounded-xl border border-border bg-card p-6 shadow-sm">
  <div className="flex items-center justify-between">
    <h2 className="flex items-center gap-2 text-lg font-bold">
      <Brain className="size-5 text-primary" />
      AI Urgency Score
    </h2>
    <span className="rounded bg-lihok-dark px-3 py-2 text-xs font-bold text-white">
      Real-time
    </span>
  </div>
  <p className="mt-5 text-6xl font-black tracking-[-0.08em]">
    98<span className="text-sm text-muted-foreground"> / 100</span>
  </p>
  <div className="mt-4 h-3 rounded-full bg-muted">
    <div className="h-full w-[98%] rounded-full bg-primary" />  {/* ← raw div, not Progress */}
  </div>
  <p className="mt-4 text-sm leading-6 text-muted-foreground">
    Report volume, keyword analysis, and nearby historical flood data
    indicate immediate intervention.
  </p>
</section>
```

Issues:
- Raw progress bar (`<div style="w-[98%]">`) instead of the semantic `Progress` component
- The `Real-time` badge is a hardcoded `<span>` instead of the shadcn `Badge`
- The section shell is the same `<article>` pattern that `SectionCard` will handle
- Score is hardcoded to `98` — should accept `score` and `maxScore` props
- No ARIA role for the progress bar

---

## Solution: `AiUrgencyPanel`

**File to create:** `apps/web/src/components/ai-urgency-panel.tsx`

**Shadcn primitives used:**
- `SectionCard` (from [04-section-card.md](./04-section-card.md))
- `Progress` (already installed)
- `Badge` (already installed)

**Dependencies:** Must implement `SectionCard` (plan 04) first.

### Props interface

```tsx
export interface AiUrgencyPanelProps {
  score: number        // 0–100
  maxScore?: number    // defaults to 100
  reasoning: string    // explanation text below the score
  isRealtime?: boolean // shows "Real-time" badge when true
  className?: string
}
```

### Pseudocode

```tsx
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
        isRealtime && (
          <Badge className="rounded bg-lihok-dark text-white">Real-time</Badge>
        )
      }
      className={className}
    >
      <p className="mt-2 text-6xl font-black tracking-[-0.08em]">
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
```

---

## Where it replaces existing code

| File | Line(s) |
|------|---------|
| `command-center.$incidentId.tsx` | 112–133 — entire AI urgency section |

---

## Files changed

| File | Change |
|------|--------|
| `apps/web/src/components/ai-urgency-panel.tsx` | **[NEW]** |
| `apps/web/src/routes/command-center.$incidentId.tsx` | Replace section with `<AiUrgencyPanel score={98} reasoning="..." />` |

## Visual preservation

- `Progress h-3` — same as `<div className="h-3">` currently
- `bg-primary` fill — same
- `bg-muted` track — same
- `text-6xl font-black tracking-[-0.08em]` — same
- `Badge` "Real-time" uses `bg-lihok-dark text-white` to match current `<span>`
