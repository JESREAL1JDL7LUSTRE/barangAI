# 11 — HeatZoneCell Component

## Problem

The purok heat map cells in `reports.tsx` (lines 119–134) are raw `<button>` elements with a `densityClass` lookup map:

```tsx
const densityClass: Record<string, string> = {
  safe:     "bg-heatmap-safe text-lihok-ink",
  moderate: "bg-heatmap-moderate text-white",
  high:     "bg-heatmap-high text-white",
  critical: "bg-heatmap-critical text-white",
}

{heatZones.map((zone, index) => (
  <button
    key={zone.zone}
    className={cn(
      "flex min-h-28 flex-col justify-end rounded-lg p-4 text-left shadow-inner transition-opacity hover:opacity-90",
      densityClass[zone.density],
      index === 1 && "md:col-span-2",
      index === 5 && "md:col-span-2",
    )}
  >
    <span className="text-[10px] font-bold uppercase opacity-80">{zone.zone}</span>
    <span className="text-xs font-black">{zone.label}</span>
  </button>
))}
```

Issues:
- `densityClass` is a loose `Record<string, string>` with no type enforcement
- `index === 1 && "md:col-span-2"` index-based span logic is fragile — if zones are reordered or filtered, the wrong cell gets the wide span
- No `aria-label` or `aria-pressed` for the interactive button
- Click handler is missing — the button doesn't do anything
- `density` type is untyped `string` in mock-data

---

## Solution: `HeatZoneCell`

**File to create:** `apps/web/src/components/heat-zone-cell.tsx`

**Shadcn primitives used:** None directly (the shadcn `Button` would fight the full-area click style; a raw `<button>` with Tailwind tokens is correct here)

**Note:** This is a case where shadcn `Button` is **not** the right primitive — the cell is a full-area colour block, not a standard button. The value of this component is **type safety + elimination of the loose map**, not shadcn wrapping.

### Types (update `mock-data.ts`)

```tsx
export type HeatDensity = "safe" | "moderate" | "high" | "critical"

export interface HeatZone {
  zone: string
  label: string
  density: HeatDensity
  /** If true, this cell spans 2 columns on md breakpoint */
  wideOnMd?: boolean
}
```

### Updated mock data

```tsx
export const heatZones: HeatZone[] = [
  { zone: "ZONE 01",    label: "Safe Level",        density: "safe" },
  { zone: "ZONE 02-03", label: "Increased Activity", density: "high",     wideOnMd: true },
  { zone: "ZONE 04",    label: "Safe Level",        density: "safe" },
  { zone: "ZONE 05",    label: "High Density",       density: "critical" },
  { zone: "ZONE 06",    label: "Moderate",           density: "moderate" },
  { zone: "ZONE 07-08", label: "Critical Area",      density: "critical",  wideOnMd: true },
  { zone: "ZONE 09",    label: "Moderate",           density: "moderate" },
  { zone: "ZONE 10",    label: "Safe Level",        density: "safe" },
  { zone: "ZONE 11-12", label: "Increased Activity", density: "high" },
]
```

### CVA variants

```tsx
const cellVariants = cva(
  "flex min-h-28 flex-col justify-end rounded-lg p-4 text-left shadow-inner transition-opacity hover:opacity-90",
  {
    variants: {
      density: {
        safe:     "bg-heatmap-safe text-lihok-ink",
        moderate: "bg-heatmap-moderate text-white",
        high:     "bg-heatmap-high text-white",
        critical: "bg-heatmap-critical text-white",
      },
    },
    defaultVariants: { density: "safe" },
  }
)
```

### Props interface

```tsx
export interface HeatZoneCellProps {
  zone: string
  label: string
  density: HeatDensity
  wideOnMd?: boolean
  onClick?: () => void
  className?: string
}
```

### Pseudocode

```tsx
export function HeatZoneCell({ zone, label, density, wideOnMd, onClick, className }: HeatZoneCellProps) {
  return (
    <button
      className={cn(cellVariants({ density }), wideOnMd && "md:col-span-2", className)}
      onClick={onClick}
      aria-label={`${zone}: ${label}`}
    >
      <span className="text-[10px] font-bold uppercase opacity-80">{zone}</span>
      <span className="text-xs font-black">{label}</span>
    </button>
  )
}
```

---

## Where it replaces existing code

| File | Line(s) |
|------|---------|
| `reports.tsx` | 13–17 (`densityClass` map), 119–134 (button loop) |
| `apps/web/src/lib/mock-data.ts` | Add `HeatDensity` type + `wideOnMd` field |

---

## Files changed

| File | Change |
|------|--------|
| `apps/web/src/components/heat-zone-cell.tsx` | **[NEW]** |
| `apps/web/src/routes/reports.tsx` | Remove `densityClass` map, replace button loop with `<HeatZoneCell>` |
| `apps/web/src/lib/mock-data.ts` | Add `HeatDensity` / `HeatZone` types, add `wideOnMd` field |

## Visual preservation

All four density colours map 1:1 to existing CSS token classes. The `wideOnMd` flag replaces the fragile `index === 1` condition — semantically equivalent, data-driven rather than position-driven.
