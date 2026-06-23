# 03 — CategoryBar Component

## Problem

The same "label + percentage + progress bar" row appears **twice**, with almost identical markup:

```tsx
// dashboard.tsx — Incident Category panel (lines 74–86)
{categories.map((category) => (
  <div key={category.name}>
    <div className="mb-1 flex justify-between text-xs font-semibold">
      <span>{category.name}</span>
      <span className="text-muted-foreground">{category.percentage}%</span>
    </div>
    <div className="h-2 rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${category.percentage}%` }}
      />
    </div>
  </div>
))}

// reports.tsx — Incident Categories panel (lines 86–99)
{categories.slice(1).map((category) => (
  <div key={category.name}>
    <div className="mb-1 flex justify-between text-xs font-semibold">
      <span>{category.name}</span>
      <span className="text-muted-foreground">{category.percentage}%</span>
    </div>
    <div className="h-2 rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${category.percentage}%` }}
      />
    </div>
  </div>
))}
```

The only difference between the two is `.slice(1)` in Reports. Everything else is **identical raw HTML**.

---

## Solution: `CategoryBar`

**File to create:** `apps/web/src/components/category-bar.tsx`

**Shadcn primitives used:** `Progress` (already installed at `@workspace/ui/components/progress`)

### Props interface

```tsx
export interface CategoryBarProps {
  name: string
  percentage: number
  /** Override bar fill colour — defaults to bg-primary */
  barClassName?: string
  className?: string
}
```

### Pseudocode

```tsx
export function CategoryBar({ name, percentage, barClassName, className }: CategoryBarProps) {
  return (
    <div className={cn("grid gap-1", className)}>
      <div className="flex justify-between text-xs font-semibold">
        <span>{name}</span>
        <span className="text-muted-foreground">{percentage}%</span>
      </div>
      <Progress
        value={percentage}
        className="h-2 bg-muted [&_[data-slot=progress-indicator]]:bg-primary"
      />
    </div>
  )
}
```

### Why use `Progress` instead of raw div?

The shadcn `Progress` component from Radix UI provides:
- Correct `role="progressbar"` ARIA semantics
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` attributes automatically
- Native animation via `translateX`
- The raw `<div style={{ width: X% }}` has none of these

---

## Where it replaces existing code

| File | Line(s) | Notes |
|------|---------|-------|
| `dashboard.tsx` | 74–86 | Replace raw div loop with `<CategoryBar>` |
| `reports.tsx` | 86–99 | Replace raw div loop with `<CategoryBar>` |

---

## Files changed

| File | Change |
|------|--------|
| `apps/web/src/components/category-bar.tsx` | **[NEW]** |
| `apps/web/src/routes/dashboard.tsx` | Import + use `CategoryBar` in category panel |
| `apps/web/src/routes/reports.tsx` | Import + use `CategoryBar` in category panel |

## Visual preservation guarantee

- Bar height `h-2` — unchanged
- Bar colour `bg-primary` — unchanged (our green token)
- Track colour `bg-muted` — unchanged
- Text: same font size, weight, colour tokens
