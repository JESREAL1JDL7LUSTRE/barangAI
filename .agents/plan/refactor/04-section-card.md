# 04 — SectionCard Component

## Problem

The pattern `<article className="rounded-xl border border-border bg-card p-6 shadow-sm">` appears **10 times** across all routes:

| Occurrences | File |
|-------------|------|
| 4× | `dashboard.tsx` (SLA chart, categories, recent incidents, system logs) |
| 3× | `command-center.$incidentId.tsx` (incident detail, AI urgency, broadcast) |
| 2× | `reports.tsx` (SLA chart, categories) |
| 1× | `reports.tsx` (heatmap) |

Additionally the `<aside>` cards in Command Center and Map each form a slightly different surface but share the same shell shape.

---

## Solution: `SectionCard`

**File to create:** `apps/web/src/components/section-card.tsx`

**Shadcn primitives used:** `Card`, `CardHeader`, `CardTitle`, `CardContent` (already installed)

### Props interface

```tsx
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
```

### Pseudocode

```tsx
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
```

### Key design decisions

- `noPadding` is needed for the SMS feed table (which goes edge-to-edge) and the Tremor chart (which has its own internal padding)
- `variant="dashed"` maps to the system log card style (`border-dashed bg-card/70`)
- The shadcn `Card` already provides `rounded-xl border border-border bg-card` — no duplication needed

---

## Where it replaces existing code

| File | Element | SectionCard props |
|------|---------|-------------------|
| `dashboard.tsx` line 50 | SLA chart article | `title="Response Time SLA Trends"` `description="..."` `action={<span>⋮</span>}` `noPadding` |
| `dashboard.tsx` line 71 | Categories article | `title="Incident Category"` |
| `dashboard.tsx` line 97 | Recent incidents article | `title="Recent Incident List"` |
| `dashboard.tsx` line 126 | System logs article | `title="System Logs"` |
| `command-center.$incidentId.tsx` line 24 | Incident detail section | `noPadding` (table inside) |
| `command-center.$incidentId.tsx` line 113 | AI urgency section | `title="AI Urgency Score"` `action={<Badge>Real-time</Badge>}` |
| `command-center.$incidentId.tsx` line 136 | Broadcast section | `title="Citizen Update Loop"` |
| `command-center.$incidentId.tsx` line 154 | System log aside section | `title="System Log"` `variant="dashed"` |
| `reports.tsx` line 68 | SLA chart article | `title="Response Time SLA Trends"` `noPadding` |
| `reports.tsx` line 82 | Categories article | `title="Incident Categories"` |
| `reports.tsx` line 108 | Heatmap article | `title="Purok Heat Map"` |

---

## Files changed

| File | Change |
|------|--------|
| `apps/web/src/components/section-card.tsx` | **[NEW]** |
| `apps/web/src/routes/dashboard.tsx` | Replace 4× `<article>` with `<SectionCard>` |
| `apps/web/src/routes/command-center.$incidentId.tsx` | Replace 4× `<section>` with `<SectionCard>` |
| `apps/web/src/routes/reports.tsx` | Replace 3× `<article>` with `<SectionCard>` |

## Visual preservation guarantee

The shadcn `Card` outputs:
- `rounded-xl` ✓
- `border border-border` ✓ 
- `bg-card` ✓

`CardContent` outputs:
- `p-6` ✓

The CSS classes are structurally identical. No visual change.
