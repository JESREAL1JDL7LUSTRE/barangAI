# 08 — PersonnelCard Component

## Problem

The personnel unit card in `map.tsx` (lines 62–87) is a standalone article with inline logic:

```tsx
{personnel.map((unit) => (
  <article key={unit.name} className="rounded-xl bg-card p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-bold">{unit.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">{unit.location}</p>
      </div>
      <span
        className={cn(
          "mt-1 size-2 rounded-full",
          statusDot[unit.status] ?? "bg-muted-foreground",
        )}
      />
    </div>
    <div className="mt-4 flex items-center justify-between border-t border-dashed border-border pt-3">
      <span className="flex gap-1">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="size-4 rounded-full bg-muted" />
        ))}
      </span>
      <button className="text-sm font-semibold text-lihok-ink transition-colors hover:text-primary">
        {unit.action}
      </button>
    </div>
  </article>
))}
```

Issues:
- `statusDot` is a local magic-string map with no type safety
- The action button is a raw `<button>` — should be shadcn `Button`
- The three decorative dots have no semantic meaning — they should be an avatar/icon placeholder
- No `onClick` handler exists — the button does nothing
- This card will eventually be shared with a personnel list page

---

## Solution: `PersonnelCard`

**File to create:** `apps/web/src/components/personnel-card.tsx`

**Shadcn primitives used:**
- `Card`, `CardContent` (already installed)
- `Button` (already installed)
- `Tooltip` (install via `tooltip`)

### Types

```tsx
export type PersonnelStatus = "online" | "busy" | "offline"
export type PersonnelAction = "Deploy" | "Re-assign" | "Message"

export interface PersonnelCardProps {
  name: string
  location: string
  status: PersonnelStatus
  action: PersonnelAction
  onAction?: () => void
  className?: string
}
```

### Status dot mapping

```tsx
const statusConfig: Record<PersonnelStatus, { dot: string; label: string }> = {
  online:  { dot: "bg-status-verified",  label: "Online" },
  busy:    { dot: "bg-urgency-high",     label: "Busy" },
  offline: { dot: "bg-urgency-critical", label: "Offline" },
}
```

### Pseudocode

```tsx
export function PersonnelCard({ name, location, status, action, onAction, className }: PersonnelCardProps) {
  const config = statusConfig[status]

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-bold text-sm">{name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{location}</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn("mt-1 size-2 shrink-0 rounded-full", config.dot)} />
            </TooltipTrigger>
            <TooltipContent>{config.label}</TooltipContent>
          </Tooltip>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-dashed border-border pt-3">
          {/* Avatar/unit placeholder dots — kept for visual parity */}
          <span className="flex gap-1">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="size-4 rounded-full bg-muted" />
            ))}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="font-semibold text-lihok-ink hover:text-primary"
            onClick={onAction}
          >
            {action}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Tooltip benefit

When the status dot is hovered, a `Tooltip` will show "Online" / "Busy" / "Offline" text — improving accessibility and UX without any visual change to the default state.

---

## Where it replaces existing code

| File | Line(s) |
|------|---------|
| `map.tsx` | 62–87 — personnel article loop + `statusDot` map |

---

## Files changed

| File | Change |
|------|--------|
| `packages/ui/src/components/tooltip.tsx` | **[NEW via shadcn install]** |
| `apps/web/src/components/personnel-card.tsx` | **[NEW]** |
| `apps/web/src/routes/map.tsx` | Remove `statusDot` map, replace article loop with `<PersonnelCard>` |

## Visual preservation

- Card: `rounded-xl bg-card p-4 shadow-sm` → shadcn `Card + CardContent` produces same output
- Status dot: same size, same token colours
- Three placeholder dots: unchanged (preserved as-is)
- Action button: `ghost` variant with same hover colour
