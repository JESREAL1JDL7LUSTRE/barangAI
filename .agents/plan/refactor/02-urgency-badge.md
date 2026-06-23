# 02 — UrgencyBadge Component

## Problem

The same urgency badge pattern appears **6 times** across the codebase, always as an inline `<span>` with a hand-written `cn()` lookup:

```tsx
// dashboard.tsx — Recent Incident List (line 107–114)
<span className={cn(
  "rounded-full px-2 py-1 text-[10px] font-black uppercase",
  urgencyClass[incident.urgency] ?? urgencyClass.low,
)}>
  {incident.urgency}
</span>

// command-center.$incidentId.tsx — Incident header (line 27–29)
<span className="rounded-full bg-urgency-critical/10 px-3 py-1 font-black uppercase text-urgency-critical">
  Critical
</span>

// map.tsx — Personnel status dot (different shape, same semantic)
<span className={cn("mt-1 size-2 rounded-full", statusDot[unit.status])} />
```

Each duplication uses slightly different padding, font size, and shape. **No shared abstraction exists.**

---

## Solution: `UrgencyBadge` + custom badge variants

**File to create:** `apps/web/src/components/urgency-badge.tsx`

**Shadcn primitives used:** `Badge` (already installed at `@workspace/ui/components/badge`)

### Strategy

Extend the existing `badgeVariants` CVA from shadcn's `badge.tsx` with **domain-specific variants** that map to our CSS token classes:

```tsx
// Pseudocode — planned implementation

const urgencyVariants = cva(
  "rounded-full font-black uppercase tracking-wide",
  {
    variants: {
      level: {
        critical: "bg-urgency-critical/10 text-urgency-critical",
        high:     "bg-urgency-high/10 text-urgency-high",
        medium:   "bg-urgency-medium/10 text-urgency-medium",
        low:      "bg-urgency-low/10 text-urgency-low",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",   // incident list rows
        md: "px-3 py-1 text-xs",          // incident headers, command center
      },
    },
    defaultVariants: {
      level: "low",
      size: "sm",
    },
  }
)

export interface UrgencyBadgeProps {
  level: "critical" | "high" | "medium" | "low"
  size?: "sm" | "md"
  className?: string
}

export function UrgencyBadge({ level, size, className }: UrgencyBadgeProps) { ... }
```

### StatusDot variant

The Map page uses a dot (not a pill) for personnel online/offline status. This is different enough visually to warrant a separate small component **or** an additional `shape` variant:

```tsx
// Option: dot shape variant
shape: {
  pill: "rounded-full px-2 py-0.5",   // default
  dot:  "size-2 rounded-full p-0",    // map personnel
}
```

---

## Where it replaces existing code

| File | Line(s) | Pattern replaced |
|------|---------|-----------------|
| `dashboard.tsx` | 107–114 | `urgencyClass` map + inline `<span>` in incident rows |
| `command-center.$incidentId.tsx` | 27–29 | Hardcoded critical span in incident header |
| `incidents.tsx` | *(stub — future incident rows)* | Will use when incidents list is built out |
| `map.tsx` | 69–74 | `statusDot` map + dot `<span>` (use `shape="dot"` variant) |

---

## Files changed

| File | Change |
|------|--------|
| `apps/web/src/components/urgency-badge.tsx` | **[NEW]** |
| `apps/web/src/routes/dashboard.tsx` | Remove `urgencyClass` map, import `UrgencyBadge` |
| `apps/web/src/routes/command-center.$incidentId.tsx` | Replace hardcoded `<span>` |
| `apps/web/src/routes/map.tsx` | Remove `statusDot` map, use `UrgencyBadge shape="dot"` |

## Visual preservation guarantee

The new component maps identically to the current `urgencyClass` record:
```
critical → bg-urgency-critical/10 text-urgency-critical  ✓ same
high     → bg-urgency-high/10 text-urgency-high          ✓ same
medium   → bg-urgency-medium/10 text-urgency-medium      ✓ same
low      → bg-urgency-low/10 text-urgency-low            ✓ same
```
Zero visual change. The tokens are unchanged.
