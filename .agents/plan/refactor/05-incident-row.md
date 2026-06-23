# 05 — IncidentRow Component

## Problem

The same incident list row pattern appears in **2 pages** (and will be needed in a 3rd):

```tsx
// dashboard.tsx — Recent Incident List (lines 100–122)
<a
  key={incident.id}
  href="/command-center/demo"
  className="grid gap-1 py-3 text-sm transition-colors hover:text-primary"
>
  <div className="flex items-center justify-between gap-3">
    <span className={cn(
      "rounded-full px-2 py-1 text-[10px] font-black uppercase",
      urgencyClass[incident.urgency] ?? urgencyClass.low,
    )}>
      {incident.urgency}
    </span>
    <span className="text-xs text-muted-foreground">{incident.timeAgo}</span>
  </div>
  <p className="font-bold">{incident.title}</p>
  <p className="text-xs text-muted-foreground">{incident.location}</p>
</a>

// incidents.tsx — Incidents page (currently just shows title, stub)
<a
  key={incident.id}
  href="/command-center/demo"
  className="rounded-xl border border-border bg-card p-4 font-bold shadow-sm transition-colors hover:bg-muted"
>
  {incident.title}
</a>
```

The incidents page stub needs to be upgraded to match the dashboard's richer row format.

---

## Solution: `IncidentRow`

**File to create:** `apps/web/src/components/incident-row.tsx`

**Shadcn primitives used:** `UrgencyBadge` (from [02-urgency-badge.md](./02-urgency-badge.md))

**Dependencies:** Must implement `UrgencyBadge` (plan 02) first.

### Props interface

```tsx
export interface IncidentRowProps {
  id: string
  title: string
  location: string
  urgency: "critical" | "high" | "medium" | "low"
  timeAgo: string
  href?: string
  /** "compact" = dashboard list style, "card" = incidents page card style */
  variant?: "compact" | "card"
  className?: string
}
```

### Pseudocode

```tsx
export function IncidentRow({
  title,
  location,
  urgency,
  timeAgo,
  href = "/command-center/demo",
  variant = "compact",
  className,
}: IncidentRowProps) {
  if (variant === "card") {
    return (
      <Link to={href} className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-muted flex items-start gap-3",
        className,
      )}>
        <UrgencyBadge level={urgency} size="sm" />
        <div>
          <p className="font-bold text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
        <span className="ml-auto text-xs text-muted-foreground shrink-0">{timeAgo}</span>
      </Link>
    )
  }

  return (
    <Link to={href} className={cn(
      "grid gap-1 py-3 text-sm transition-colors hover:text-primary",
      className,
    )}>
      <div className="flex items-center justify-between gap-3">
        <UrgencyBadge level={urgency} size="sm" />
        <span className="text-xs text-muted-foreground">{timeAgo}</span>
      </div>
      <p className="font-bold">{title}</p>
      <p className="text-xs text-muted-foreground">{location}</p>
    </Link>
  )
}
```

### Important note on `Link`

Current `dashboard.tsx` still uses `<a href>` for incident links — that should become a TanStack Router `<Link to>`. The `IncidentRow` component handles this correctly internally.

---

## Where it replaces existing code

| File | Line(s) | Variant |
|------|---------|---------|
| `dashboard.tsx` | 100–122 | `variant="compact"` |
| `incidents.tsx` | 12–19 | Upgrade stub to `variant="card"` — also upgrades the incidents page! |

---

## Files changed

| File | Change |
|------|--------|
| `apps/web/src/components/incident-row.tsx` | **[NEW]** |
| `apps/web/src/routes/dashboard.tsx` | Remove `urgencyClass` map, replace `<a>` loop with `<IncidentRow>` |
| `apps/web/src/routes/incidents.tsx` | Replace stub `<a>` with `<IncidentRow variant="card">` — **upgrades incidents page for free** |

## Side effect: Incidents page upgrade

Currently `incidents.tsx` is a stub that just shows titles. Switching to `IncidentRow variant="card"` gives it proper urgency badges, locations, timestamps — matching the design — at **zero extra cost**.
