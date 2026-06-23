# 13 — TimeRangeToggle Component

## Problem

The time range toggle in `reports.tsx` (lines 35–48) is a manual loop of `<button>` elements with hand-rolled active state logic:

```tsx
<div className="flex rounded-md border border-border bg-card p-1 text-xs font-bold">
  {ranges.map((item) => (
    <button
      key={item}
      onClick={() => setRange(item)}
      className={cn(
        "rounded px-4 py-2 text-muted-foreground transition-colors hover:text-lihok-ink",
        range === item && "bg-lihok-accent/40 text-lihok-ink",
      )}
    >
      {item}
    </button>
  ))}
</div>
```

Issues:
- No ARIA `role="group"` or `aria-label` for the button group
- Active state is purely visual — no `aria-pressed` or `aria-selected`
- `value` is a local `useState` — if multiple pages used this toggle, state would not be shared
- The shadcn `ToggleGroup` provides all the ARIA semantics automatically
- Could also be used on the dashboard (if a time range filter is added there in the future)

---

## Solution: `TimeRangeToggle`

**File to create:** `apps/web/src/components/time-range-toggle.tsx`

**Shadcn primitives to install:**
- `toggle-group` → `pnpm dlx shadcn@latest add toggle-group -c apps/web`

### Type

```tsx
export type TimeRange = "24H" | "7D" | "30D"
```

### Props interface

```tsx
export interface TimeRangeToggleProps {
  value: TimeRange
  onChange: (value: TimeRange) => void
  className?: string
}
```

### Pseudocode

```tsx
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"

const RANGES: TimeRange[] = ["24H", "7D", "30D"]

export function TimeRangeToggle({ value, onChange, className }: TimeRangeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => { if (v) onChange(v as TimeRange) }}
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
```

### Why `ToggleGroup` over manual buttons

- `ToggleGroup` from Radix UI automatically manages `aria-pressed` per item
- `type="single"` enforces single selection natively
- `onValueChange` fires only when a new value is selected (not on deselect click of current value)
- `data-[state=on]:` CSS selectors provide active state styling — more robust than ternary class logic
- The visual output is **identical** to the current design

### URL state (future enhancement)

Once TanStack Router search params are connected, `value` and `onChange` can be driven by URL search params (`?range=7D`) rather than local state — making filters bookmarkable. The `TimeRangeToggle` API is already compatible with this pattern.

---

## Where it replaces existing code

| File | Line(s) |
|------|---------|
| `reports.tsx` | 11 (`ranges` const), 21 (`useState`), 35–48 (button group) |

---

## Files changed

| File | Change |
|------|--------|
| `packages/ui/src/components/toggle-group.tsx` | **[NEW via shadcn install]** |
| `apps/web/src/components/time-range-toggle.tsx` | **[NEW]** |
| `apps/web/src/routes/reports.tsx` | Remove manual button loop + `ranges` const + `useState`, import `<TimeRangeToggle>` |

## Visual preservation

- Outer container: `rounded-md border border-border bg-card p-1` — same
- Item: `rounded px-4 py-2` — same sizing
- Active state: `bg-lihok-accent/40 text-lihok-ink` — same via `data-[state=on]:`
- Inactive state: `text-muted-foreground` — same
